import { toPng } from 'html-to-image';

export interface PrintOptions {
  title?: string;
  isThermal?: boolean;
  widthMm?: number;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * Downloads a DOM element as a high-resolution PNG image.
 */
export async function downloadElementAsImage(
  elementOrId: HTMLElement | string,
  fileName: string = 'receipt.png',
  options: { backgroundColor?: string; pixelRatio?: number } = {}
): Promise<boolean> {
  try {
    const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
    if (!el) {
      console.warn(`Element with ID "${elementOrId}" not found for image download.`);
      return false;
    }

    const dataUrl = await toPng(el, {
      pixelRatio: options.pixelRatio || 2,
      backgroundColor: options.backgroundColor || '#ffffff',
      cacheBust: true,
      skipAutoScale: false,
    });

    const link = document.createElement('a');
    link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Failed to export element as image:', error);
    return false;
  }
}

/**
 * Downloads plain text content (e.g. raw thermal receipt / KOT format).
 */
export function downloadTextFile(content: string, fileName: string = 'receipt.txt'): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a standalone, styled HTML receipt that can be opened and printed anywhere.
 */
export function downloadHtmlDocument(
  htmlContent: string,
  title: string = 'Receipt',
  fileName: string = 'receipt.html',
  isThermal: boolean = true
): void {
  const fullHtml = `<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Courier New", monospace;
      background: #f4f4f5;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      color: #111;
    }
    .print-actions {
      margin-bottom: 20px;
      display: flex;
      gap: 12px;
    }
    .btn {
      padding: 8px 16px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
    }
    .btn-secondary {
      background: #3f3f46;
    }
    .receipt-container {
      background: #ffffff;
      width: 100%;
      max-width: ${isThermal ? '80mm' : '700px'};
      padding: ${isThermal ? '16px' : '32px'};
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      border-radius: 8px;
      font-size: ${isThermal ? '11px' : '13px'};
      line-height: 1.4;
    }
    @media print {
      body {
        background: transparent !important;
        padding: 0 !important;
      }
      .print-actions {
        display: none !important;
      }
      .receipt-container {
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
        width: ${isThermal ? '80mm' : '100%'} !important;
        padding: ${isThermal ? '4mm' : '10mm'} !important;
      }
      @page {
        margin: 0;
        size: ${isThermal ? '80mm auto' : 'auto'};
      }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="btn" onclick="window.print()">🖨️ Chapisha (Print)</button>
    <button class="btn btn-secondary" onclick="window.close()">Funga</button>
  </div>
  <div class="receipt-container">
    ${htmlContent}
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.html') ? fileName : `${fileName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Universal print helper that prints any element cleanly using an isolated iframe
 * with thermal roll or A4 print styles, bypassing modal backdrop bugs.
 * Falls back to window.print() if iframe is restricted.
 */
export function printReceiptOrElement(
  elementOrId: HTMLElement | string,
  options: PrintOptions = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
      if (!el) {
        console.warn(`Element with ID "${elementOrId}" not found for printing.`);
        // Fallback to regular window.print
        window.print();
        resolve(true);
        return;
      }

      const isThermal = options.isThermal ?? true;
      const widthMm = options.widthMm ?? (isThermal ? 80 : undefined);
      const title = options.title || 'Risiti / Print Document';

      // Create an isolated hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      iframe.setAttribute('title', title);
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!iframeDoc) {
        // Fallback to standard window.print
        window.print();
        document.body.removeChild(iframe);
        resolve(true);
        return;
      }

      // Collect current stylesheet links and styles to preserve fonts & layout
      const styleSheets = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((node) => node.outerHTML)
        .join('\n');

      const printWidthCss = widthMm ? `width: ${widthMm}mm !important; max-width: ${widthMm}mm !important;` : 'width: 100% !important;';

      const iframeContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  ${styleSheets}
  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #000000 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Courier New", monospace !important;
    }
    #print-container {
      ${printWidthCss}
      margin: 0 auto !important;
      padding: ${isThermal ? '4mm' : '8mm'} !important;
      background: #ffffff !important;
      color: #000000 !important;
      font-size: ${isThermal ? '11px' : '12px'} !important;
      line-height: 1.35 !important;
    }
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
      }
      #print-container {
        padding: ${isThermal ? '2mm' : '8mm'} !important;
      }
      @page {
        margin: 0;
        size: ${isThermal ? `${widthMm || 80}mm auto` : 'auto'};
      }
    }
  </style>
</head>
<body>
  <div id="print-container">
    ${el.outerHTML}
  </div>
</body>
</html>`;

      iframeDoc.open();
      iframeDoc.write(iframeContent);
      iframeDoc.close();

      const triggerPrint = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          options.onSuccess?.();
          resolve(true);
        } catch (e) {
          console.warn('Iframe print error, falling back to window.print():', e);
          window.print();
          resolve(true);
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 2000);
        }
      };

      // Allow styles, images, and layout to render inside iframe
      setTimeout(triggerPrint, 350);
    } catch (err) {
      console.error('Print utility failed:', err);
      // Fallback
      window.print();
      options.onError?.(err);
      resolve(false);
    }
  });
}
