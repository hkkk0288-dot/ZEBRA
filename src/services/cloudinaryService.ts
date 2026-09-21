/**
 * Cloudinary Integration Service for Zebra Restaurant
 * Cloud Name: cy4pidvh
 * Console: https://console.cloudinary.com/
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  folder: string;
  autoOptimize: boolean;
}

const STORAGE_KEY = 'zebra_cloudinary_config';

export const DEFAULT_CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) || 'cy4pidvh',
  uploadPreset: (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) || 'zebra',
  folder: 'zebra_restaurant',
  autoOptimize: true
};

export function getCloudinaryConfig(): CloudinaryConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CLOUDINARY_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Error reading cloudinary config from storage', e);
  }
  return DEFAULT_CLOUDINARY_CONFIG;
}

export function saveCloudinaryConfig(config: Partial<CloudinaryConfig>): CloudinaryConfig {
  const current = getCloudinaryConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving cloudinary config to storage', e);
  }
  return updated;
}

export interface UploadResult {
  success: boolean;
  url: string;
  secureUrl?: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  isFallback?: boolean;
  message?: string;
}

/**
 * Upload an image file directly to Cloudinary
 */
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const config = getCloudinaryConfig();
  const cloudName = config.cloudName.trim() || 'cy4pidvh';
  const uploadPreset = config.uploadPreset.trim() || 'ml_default';

  const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (config.folder) {
      formData.append('folder', config.folder);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadEndpoint, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            success: true,
            url: response.secure_url || response.url,
            secureUrl: response.secure_url,
            publicId: response.public_id,
            format: response.format,
            width: response.width,
            height: response.height,
            message: 'Picha imepakiwa Cloudinary kikamilifu!'
          });
          return;
        } catch (err) {
          console.error('Failed to parse Cloudinary response:', err);
        }
      }

      // Handle non-200 responses (e.g., unsigned preset requirement)
      let errorMsg = 'Hitilafu ya kupakia Cloudinary';
      try {
        const errorResponse = JSON.parse(xhr.responseText);
        if (errorResponse.error && errorResponse.error.message) {
          errorMsg = errorResponse.error.message;
        }
      } catch {
        errorMsg = `HTTP Error ${xhr.status}: ${xhr.statusText}`;
      }

      console.warn('Cloudinary upload warning:', errorMsg);

      // Gracefully fall back to local Base64 URL so the user's flow is never blocked
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          success: true,
          isFallback: true,
          url: reader.result as string,
          message: errorMsg.includes('unsigned') || errorMsg.includes('Signed')
            ? `Picha imehifadhiwa! Kumbuka: Preset '${uploadPreset}' kwenye Cloudinary console (${cloudName}) ipo kwenye 'Signed mode'. Ili kupakia moja kwa moja kwenye CDN ya Cloudinary, bofya '+ Add Upload Preset' kule Cloudinary kisha chagua 'Unsigned'.`
            : `Picha imehifadhiwa (${errorMsg}).`
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          url: '',
          message: errorMsg
        });
      };
      reader.readAsDataURL(file);
    };

    xhr.onerror = () => {
      // Offline or network error fallback
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          success: true,
          isFallback: true,
          url: reader.result as string,
          message: 'Mtandao ulikatika, lakini picha imehifadhiwa vizuri ndani ya app!'
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          url: '',
          message: 'Imeshindwa kusoma picha'
        });
      };
      reader.readAsDataURL(file);
    };

    xhr.send(formData);
  });
}

/**
 * Generate optimized Cloudinary transformation URL
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'scale' | 'thumb' | 'fit';
    quality?: 'auto' | 'best' | 'good' | 'eco';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const { width = 600, height = 400, crop = 'fill', quality = 'auto', format = 'auto' } = options;
  const transform = `c_${crop},w_${width},h_${height},q_${quality},f_${format}`;

  // Insert transformations after /upload/
  if (url.includes('/image/upload/')) {
    return url.replace('/image/upload/', `/image/upload/${transform}/`);
  }

  return url;
}
