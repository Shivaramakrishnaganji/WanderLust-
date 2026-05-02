const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api')

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function apiRequest(path, options = {}) {
  const { body, headers = {}, ...fetchOptions } = options
  const isFormData = body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...fetchOptions,
    headers: isFormData
      ? headers
      : {
          'Content-Type': 'application/json',
          ...headers,
        },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.message || 'Request failed',
      response.status,
      payload?.details,
    )
  }

  return payload?.data
}

function buildListingBody(listing, imageFile) {
  if (!imageFile) {
    return { listing }
  }

  const formData = new FormData()

  Object.entries(listing).forEach(([key, value]) => {
    formData.append(`listing[${key}]`, value)
  })

  formData.append('listing[image]', imageFile)

  return formData
}

export const listingsApi = {
  list: () => apiRequest('/listings'),
  show: (id) => apiRequest(`/listings/${id}`),
  create: ({ listing, imageFile }) =>
    apiRequest('/listings', {
      method: 'POST',
      body: buildListingBody(listing, imageFile),
    }),
  update: (id, { listing, imageFile }) =>
    apiRequest(`/listings/${id}`, {
      method: 'PUT',
      body: buildListingBody(listing, imageFile),
    }),
  destroy: (id) =>
    apiRequest(`/listings/${id}`, {
      method: 'DELETE',
    }),
}

export const authApi = {
  me: () => apiRequest('/auth/me'),
  signup: ({ username, email, password }) =>
    apiRequest('/auth/signup', {
      method: 'POST',
      body: { username, email, password },
    }),
  login: ({ username, password }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),
  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
}

export const reviewsApi = {
  create: (id, review) =>
    apiRequest(`/listings/${id}/reviews`, {
      method: 'POST',
      body: { review },
    }),
  destroy: (id, reviewId) =>
    apiRequest(`/listings/${id}/reviews/${reviewId}`, {
      method: 'DELETE',
    }),
}
