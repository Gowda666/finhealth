const API_BASE = import.meta.env.VITE_API_URL || '';

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
          reject(new Error(json.detail || json.message || `Upload failed with HTTP ${xhr.status}`));
        }
      } catch (e) {
        reject(new Error(`Server response error: ${xhr.statusText || 'Unable to parse server response'}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error connecting to backend API. Please check if the server is running.'));
    };

    xhr.send(formData);
  });
}

export async function fetchSampleStatement(currency = '₹') {
  const encCurr = encodeURIComponent(currency);
  const res = await fetch(`${API_BASE}/api/sample?currency=${encCurr}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `Failed to fetch sample statement: HTTP ${res.status}`);
  }
  return await res.json();
}
