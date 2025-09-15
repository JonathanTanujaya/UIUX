/*
  Global network stub: disables all real API calls in the frontend.
  - Overrides axios adapter so ALL axios instances (created after this import) return stubbed responses.
  - Overrides window.fetch to return a stubbed Response.
  Import this file once at app bootstrap before any services create axios instances.
*/

import axios from 'axios';

// Build a minimal AxiosResponse-like object
function buildAxiosResponse(config, data) {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: undefined,
  };
}

// Decide stub payload based on method
function stubPayloadFor(method) {
  const m = (method || 'get').toLowerCase();
  // Standard empty payload; compatible with code that expects Laravel-style { data: [] }
  const emptyList = { data: [], totalCount: 0, success: true, message: 'Stubbed' };
  const emptyItem = { data: null, success: true, message: 'Stubbed' };

  if (m === 'get' || m === 'head' || m === 'options') {
    return emptyList;
  }
  // For mutating methods, return an empty success envelope
  return { success: true, message: 'Stubbed', data: null };
}

// Install a global axios adapter stub BEFORE any axios.create() usage elsewhere
axios.defaults.adapter = async (config) => {
  let payload = stubPayloadFor(config.method);

  // Respect binary response types to prevent consumer errors
  if (config.responseType === 'blob') {
    payload = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  } else if (config.responseType === 'arraybuffer') {
    payload = new TextEncoder().encode(JSON.stringify(payload)).buffer;
  }

  if (import.meta?.env?.DEV) {
    // eslint-disable-next-line no-console
    console.warn('[STUB] Axios request blocked:', config.method?.toUpperCase(), config.url);
  }
  return buildAxiosResponse(config, payload);
};

// Safe fetch stub
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch?.bind(window);

  window.fetch = async (input, init = {}) => {
    const method = (init.method || 'GET').toLowerCase();
    const payload = stubPayloadFor(method);

    if (import.meta?.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn('[STUB] fetch request blocked:', method.toUpperCase(), input);
    }

    // Minimal Response-like object
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      url: typeof input === 'string' ? input : (input?.url || ''),
      redirected: false,
      type: 'basic',
      clone() { return this; },
      async json() { return payload; },
      async text() { return JSON.stringify(payload); },
      async blob() { return new Blob([JSON.stringify(payload)], { type: 'application/json' }); },
      async arrayBuffer() { return new TextEncoder().encode(JSON.stringify(payload)).buffer; },
      bodyUsed: false,
    };
  };

  // Keep a reference in case you need to restore later (not used now)
  window.__ORIGINAL_FETCH__ = originalFetch;
}

// Export noop to avoid tree-shaking removal when imported
export default null;
