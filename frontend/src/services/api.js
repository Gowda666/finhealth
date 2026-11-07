// Automatically point to local backend if running on localhost, else use the live Render backend
const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:8000';
  }
  // Production default fallback pointing to your live Render backend
  return 'https://finhealth-api-p8dk.onrender.com';
};

const API_BASE = getApiBase();

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch (err) {
    return false;
  }
}

export function uploadStatementFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.open('POST', `${API_BASE}/api/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(json);
        } else {
          const errMsg = json.detail || json.message || `Upload failed with status ${xhr.status}`;
          reject(new Error(errMsg));
        }
      } catch (e) {
        if (xhr.status === 0) {
          reject(new Error('Cannot reach backend server. Please verify the backend is online.'));
        } else if (xhr.status === 413) {
          reject(new Error('File is too large. Max allowed size is 15MB.'));
        } else {
          reject(new Error(`Server returned HTTP ${xhr.status}: ${xhr.statusText || 'Backend connection error'}`));
        }
      }
    };

    xhr.onerror = () => {
      const isRender = API_BASE.includes('onrender.com');
      const hint = isRender
        ? ' Note: Render Free tier services spin down after 15 minutes of inactivity and take ~50-90 seconds to wake up. Please wait 1 minute and retry.'
        : '';
      reject(new Error(`Cannot reach the backend server at ${API_BASE}.${hint} Please verify it is running.`));
    };

    xhr.send(formData);
  });
}

export async function fetchSampleStatement(currency = '₹') {
  try {
    const encCurr = encodeURIComponent(currency);
    const res = await fetch(`${API_BASE}/api/sample?currency=${encCurr}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || err.message || `Backend returned status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    const isRender = API_BASE.includes('onrender.com');
    const hint = isRender
      ? ' (Render Free tier services sleep when idle and take ~60s to wake up on first request)'
      : '';
    throw new Error(err.message || `Failed to connect to backend server at ${API_BASE}.${hint}`);
  }
}
