const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('Can’t reach the backend. Make sure Node.js and MongoDB are running on port 5000.');
  }

  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof data === 'object'
      ? data.message || data.errors?.map(e => e.msg).join(', ')
      : data;
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return data;
}

export const todosApi = {
  list: () => request('/todos'),
  create: (title) => request('/todos', { method: 'POST', body: JSON.stringify({ title, completed: false }) }),
  update: (id, updates) => request(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  remove: (id) => request(`/todos/${id}`, { method: 'DELETE' }),
};
