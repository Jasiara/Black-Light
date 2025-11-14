const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function apiFetch(path, opts = {}) {
  const res = await fetch(API_URL + path, {
    ...opts,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) }
  });
  return res.json();
}