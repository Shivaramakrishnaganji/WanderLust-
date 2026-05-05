const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

async function request(path, options = {}) {
  const config = {
    credentials: "include",
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...(options.headers || {}),
    },
  };

  if (config.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  const response = await fetch(path, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }

  return data;
}

export const api = {
  me: () => request("/api/auth/me"),
  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  signup: (payload) =>
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () =>
    request("/api/auth/logout", {
      method: "POST",
    }),
  getListings: () => request("/api/listings"),
  getListing: (id) => request(`/api/listings/${id}`),
  getListingForEdit: (id) => request(`/api/listings/${id}/edit`),
  createListing: (formData) =>
    request("/api/listings", {
      method: "POST",
      body: formData,
    }),
  updateListing: (id, formData) =>
    request(`/api/listings/${id}`, {
      method: "PUT",
      body: formData,
    }),
  deleteListing: (id) =>
    request(`/api/listings/${id}`, {
      method: "DELETE",
    }),
  createReview: (payload) =>
    request("/api/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteReview: ({ reviewId, listingId }) =>
    request(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      body: JSON.stringify({ listingId }),
    }),
};
