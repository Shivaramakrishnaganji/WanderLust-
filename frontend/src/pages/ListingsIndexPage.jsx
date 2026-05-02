import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { listingsApi, reviewsApi } from '../services/api.js'

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(price || 0))
}

function getOwnerId(listing) {
  return listing?.owner?._id || listing?.owner
}

function ListingsIndexPage({ initialListingId, navigate }) {
  const { currentUser } = useAuth()
  const [listings, setListings] = useState([])
  const [selectedListing, setSelectedListing] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [reviewError, setReviewError] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState(null)

  const applyListings = useCallback((data) => {
    setListings(data)

    if (data.length > 0) {
      setSelectedListing((current) => {
        const nextSelected = data.find((listing) => listing._id === current?._id)
        return nextSelected || data[0]
      })
    } else {
      setSelectedListing(null)
    }
  }, [])

  const refreshListings = useCallback(async () => {
    try {
      const data = await listingsApi.list()
      applyListings(data)
      return data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [applyListings])

  const refreshSelectedListing = useCallback(async (listingId) => {
    const data = await listingsApi.show(listingId)
    setSelectedListing(data)
    return data
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadInitialListings() {
      try {
        const data = await listingsApi.list()
        if (isMounted) {
          applyListings(data)
        }
        const listingId = initialListingId || data[0]?._id
        if (listingId) {
          const listing = await listingsApi.show(listingId)
          if (isMounted) {
            setSelectedListing(listing)
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadInitialListings()

    return () => {
      isMounted = false
    }
  }, [applyListings, initialListingId])

  const handleSelectListing = async (listing) => {
    setSelectedListing(listing)
    navigate(`/listings/${listing._id}`)
    setIsDetailLoading(true)
    setError('')
    setReviewError('')
    setReviewText('')
    setReviewRating(5)

    try {
      await refreshSelectedListing(listing._id)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsDetailLoading(false)
    }
  }

  const handleNewListing = () => {
    if (!currentUser) {
      navigate('/login?redirect=%2Flistings%2Fnew')
      return
    }

    navigate('/listings/new')
  }

  const handleEditListing = () => {
    if (!currentUser) {
      navigate(`/login?redirect=${encodeURIComponent(`/listings/${selectedListing._id}/edit`)}`)
      return
    }

    navigate(`/listings/${selectedListing._id}/edit`)
  }

  const handleDeleteListing = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    const confirmed = window.confirm('Delete this listing? This cannot be undone.')
    if (!confirmed) return

    setError('')
    setIsDeleting(true)

    try {
      await listingsApi.destroy(selectedListing._id)
      const data = await refreshListings()
      if (data[0]) {
        await refreshSelectedListing(data[0]._id)
      }
    } catch (err) {
      if (err.status === 401) {
        navigate('/login')
        return
      }

      setError(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCreateReview = async (e) => {
    e.preventDefault()

    if (!selectedListing) return

    if (!currentUser) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    const comment = reviewText.trim()
    if (!comment) {
      setReviewError('Review comment is required.')
      return
    }

    setReviewError('')
    setIsSubmittingReview(true)

    try {
      await reviewsApi.create(selectedListing._id, {
        comment,
        rating: Number(reviewRating),
      })
      await refreshSelectedListing(selectedListing._id)
      setReviewText('')
      setReviewRating(5)
    } catch (err) {
      if (err.status === 401) {
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
        return
      }
      setReviewError(err.message)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!selectedListing) return

    if (!currentUser) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    const confirmed = window.confirm('Delete this review?')
    if (!confirmed) return

    setReviewError('')
    setDeletingReviewId(reviewId)
    try {
      await reviewsApi.destroy(selectedListing._id, reviewId)
      await refreshSelectedListing(selectedListing._id)
    } catch (err) {
      if (err.status === 401) {
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
        return
      }
      setReviewError(err.message)
    } finally {
      setDeletingReviewId(null)
    }
  }

  const canManageSelectedListing =
    currentUser &&
    selectedListing &&
    String(getOwnerId(selectedListing)) === String(currentUser.id)

  return (
    <section className="listings-workspace">
      <div className="list-panel">
        <div className="panel-heading">
          <h1>Listings</h1>
          <div className="panel-actions">
            <span>{listings.length}</span>
            <button className="secondary-action" onClick={handleNewListing} type="button">
              New
            </button>
          </div>
        </div>

        {isLoading && <p className="muted">Loading listings...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="listing-list">
          {listings.map((listing) => (
            <button
              className={`listing-row ${
                selectedListing?._id === listing._id ? 'active' : ''
              }`}
              key={listing._id}
              type="button"
              onClick={() => handleSelectListing(listing)}
            >
              <img src={listing.image?.url} alt="" />
              <span>
                <strong>{listing.title}</strong>
                <small>
                  {listing.location}, {listing.country}
                </small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <article className="detail-panel">
        {selectedListing ? (
          <>
            <img
              className="detail-image"
              src={selectedListing.image?.url}
              alt={selectedListing.title}
            />
            <div className="detail-body">
              <div>
                <p className="eyebrow">{selectedListing.location}</p>
                <h2>{selectedListing.title}</h2>
              </div>
              {canManageSelectedListing && (
                <div className="detail-actions">
                  <button className="secondary-action" onClick={handleEditListing} type="button">
                    Edit
                  </button>
                  <button
                    className="danger-action"
                    disabled={isDeleting}
                    onClick={handleDeleteListing}
                    type="button"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
              <p>{selectedListing.description}</p>
              <div className="metadata-grid">
                <span>{formatPrice(selectedListing.price)}</span>
                <span>{selectedListing.country}</span>
                <span>
                  {selectedListing.reviews?.length || 0}{' '}
                  {(selectedListing.reviews?.length || 0) === 1 ? 'review' : 'reviews'}
                </span>
                <span>{selectedListing.owner?.username || 'Unassigned'}</span>
              </div>
              {isDetailLoading && <p className="muted">Refreshing details...</p>}

              <hr className="divider" />
              <div className="reviews-section">
                <h3>Reviews</h3>
                {reviewError && (
                  <p className="error-message review-message" role="alert">
                    {reviewError}
                  </p>
                )}
                {currentUser ? (
                  <form className="review-form" onSubmit={handleCreateReview}>
                    <label>
                      Rating
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        required
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Okay</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Terrible</option>
                      </select>
                    </label>
                    <label>
                      Comment
                      <textarea
                        rows="3"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                      />
                    </label>
                    <button className="primary-action" disabled={isSubmittingReview} type="submit">
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <p className="muted">Log in to leave a review.</p>
                )}

                <div className="reviews-list">
                  {selectedListing.reviews?.length > 0 ? (
                    selectedListing.reviews.map((review) => (
                      <div className="review-card" key={review._id}>
                        <div className="review-header">
                          <strong>{review.author?.username || 'Unknown'}</strong>
                          <span>Rating {review.rating}/5</span>
                        </div>
                        <p>{review.comment}</p>
                        {currentUser && String(review.author?._id) === String(currentUser.id) && (
                          <button
                            className="danger-action small-action"
                            disabled={deletingReviewId === review._id}
                            onClick={() => handleDeleteReview(review._id)}
                            type="button"
                          >
                            {deletingReviewId === review._id ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="muted">No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="muted">No listing selected.</p>
        )}
      </article>
    </section>
  )
}

export default ListingsIndexPage
