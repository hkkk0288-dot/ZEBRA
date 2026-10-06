/**
 * Kookoos - Media & Video Storage Service
 * Handles storing large splash screen videos, banner media, and images
 * using IndexedDB so localStorage never runs out of quota.
 * Also parses YouTube / Vimeo embeds and handles Blob URL generation.
 */

const DB_NAME = 'KookoosMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

// Memory cache for generated Blob URLs so we don't recreate them continuously
const blobUrlCache = new Map<string, string>();

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Save a File or Blob into IndexedDB
 * Returns a media reference string in the form: `idb:${id}`
 */
export async function saveMediaToStorage(id: string, fileOrBlob: Blob | File): Promise<string> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(fileOrBlob, id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.onabort = () => reject(tx.error);
    });

    const key = `idb:${id}`;
    // Revoke old blob url if cached
    if (blobUrlCache.has(key)) {
      try {
        URL.revokeObjectURL(blobUrlCache.get(key)!);
      } catch {}
      blobUrlCache.delete(key);
    }

    // Pre-cache fresh blob url
    const objectUrl = URL.createObjectURL(fileOrBlob);
    blobUrlCache.set(key, objectUrl);

    return key;
  } catch (error) {
    console.error('Failed to save media to IndexedDB:', error);
    // Fallback: If IndexedDB fails, create standard object URL
    const objectUrl = URL.createObjectURL(fileOrBlob);
    return objectUrl;
  }
}

/**
 * Retrieve a Blob from IndexedDB by ID
 */
export async function getMediaFromStorage(id: string): Promise<Blob | null> {
  try {
    const cleanId = id.replace(/^idb:/, '');
    const db = await openDB();
    return await new Promise<Blob | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(cleanId);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('Failed to get media from IndexedDB:', error);
    return null;
  }
}

/**
 * Delete a media item from IndexedDB
 */
export async function deleteMediaFromStorage(id: string): Promise<void> {
  try {
    const cleanId = id.replace(/^idb:/, '');
    const key = `idb:${cleanId}`;
    if (blobUrlCache.has(key)) {
      try {
        URL.revokeObjectURL(blobUrlCache.get(key)!);
      } catch {}
      blobUrlCache.delete(key);
    }

    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(cleanId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('Failed to delete media from IndexedDB:', error);
  }
}

/**
 * Convert base64 DataURL to a Blob
 */
export function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'video/mp4';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Resolves any media reference (idb:*, data:*, blob:*, http:*) into a playable URL.
 * Ensures data:video/ URLs are converted to Blob URLs for browser decoder compatibility.
 */
export async function resolveMediaUrl(rawUrl: string): Promise<string> {
  if (!rawUrl) return '';

  // 1. Check if it's an IndexedDB reference
  if (rawUrl.startsWith('idb:')) {
    if (blobUrlCache.has(rawUrl)) {
      return blobUrlCache.get(rawUrl)!;
    }
    const blob = await getMediaFromStorage(rawUrl);
    if (blob) {
      const url = URL.createObjectURL(blob);
      blobUrlCache.set(rawUrl, url);
      return url;
    }
    // If not found in storage, return empty
    return '';
  }

  // 2. If it's a huge base64 data URL for video, convert to Blob URL to fix HTML5 <video> decoder errors
  if (rawUrl.startsWith('data:video/')) {
    if (blobUrlCache.has(rawUrl)) {
      return blobUrlCache.get(rawUrl)!;
    }
    try {
      const blob = dataURLtoBlob(rawUrl);
      const url = URL.createObjectURL(blob);
      blobUrlCache.set(rawUrl, url);
      return url;
    } catch (e) {
      console.warn('Failed to convert data:video URL to Blob URL:', e);
      return rawUrl;
    }
  }

  // 3. Regular HTTP, HTTPS, or Blob URL
  return rawUrl;
}

export type ParsedVideoInfo =
  | { type: 'youtube'; embedUrl: string; videoId: string }
  | { type: 'vimeo'; embedUrl: string; videoId: string }
  | { type: 'direct'; directUrl: string };

/**
 * Parses a video URL to detect YouTube, Vimeo, or direct video streams
 */
export function parseVideoSource(rawUrl: string): ParsedVideoInfo {
  if (!rawUrl) {
    return { type: 'direct', directUrl: '' };
  }

  const trimmed = rawUrl.trim();

  // 1. YouTube URL detection
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch =
    trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/) ||
    trimmed.match(/^[a-zA-Z0-9_-]{11}$/);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    // YouTube embed parameters for autoplay, mute, loop, hidden controls, mobile playsinline
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
    return { type: 'youtube', embedUrl, videoId };
  }

  // 2. Vimeo URL detection
  // Matches: vimeo.com/123456789
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[3]) {
    const videoId = vimeoMatch[3];
    const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1&controls=0&playsinline=1`;
    return { type: 'vimeo', embedUrl, videoId };
  }

  // 3. Direct video (MP4, WebM, Blob, idb, etc.)
  return { type: 'direct', directUrl: trimmed };
}
