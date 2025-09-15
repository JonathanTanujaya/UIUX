// Stubbed axios-like client: disconnects frontend from backend completely.
// All HTTP methods resolve with placeholder data and never hit the network.

const buildResponse = (config, data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: { 'x-stubbed': 'true' },
  config: config || {},
  request: {},
});

const listPayload = { data: [], totalCount: 0, success: true, message: 'Stubbed' };
const itemPayload = { data: null, success: true, message: 'Stubbed' };

const apiClient = {
  defaults: {},
  get: async (url, config) => buildResponse({ method: 'get', url, ...config }, listPayload),
  delete: async (url, config) => buildResponse({ method: 'delete', url, ...config }, itemPayload),
  head: async (url, config) => buildResponse({ method: 'head', url, ...config }, null),
  options: async (url, config) => buildResponse({ method: 'options', url, ...config }, listPayload),
  post: async (url, data, config) => buildResponse({ method: 'post', url, data, ...config }, itemPayload),
  put: async (url, data, config) => buildResponse({ method: 'put', url, data, ...config }, itemPayload),
  patch: async (url, data, config) => buildResponse({ method: 'patch', url, data, ...config }, itemPayload),
  // mimic axios.create
  create() { return this; },
};

export default apiClient;
