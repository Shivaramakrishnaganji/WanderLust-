import { useEffect, useState } from 'react'
import ListingForm from '../components/ListingForm.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { listingsApi } from '../services/api.js'

function getOwnerId(listing) {
  return listing?.owner?._id || listing?.owner
}

function EditListingPage({ listingId, navigate }) {
  const { currentUser } = useAuth()
  const [listing, setListing] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const canManageListing =
    currentUser && listing && String(getOwnerId(listing)) === String(currentUser.id)

  useEffect(() => {
    let isMounted = true

    async function loadListing() {
      try {
        const data = await listingsApi.show(listingId)
        if (isMounted) {
          setListing(data)
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

    loadListing()

    return () => {
      isMounted = false
    }
  }, [listingId])

  const handleSubmit = async ({ listing: listingPayload, imageFile }) => {
    if (!canManageListing) {
      setError('You are not the owner of this listing.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await listingsApi.update(listingId, { listing: listingPayload, imageFile })
      navigate('/')
    } catch (err) {
      if (err.status === 401) {
        navigate(`/login?redirect=${encodeURIComponent(`/listings/${listingId}/edit`)}`)
        return
      }

      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!canManageListing) {
      setError('You are not the owner of this listing.')
      return
    }

    const confirmed = window.confirm('Delete this listing? This cannot be undone.')
    if (!confirmed) return

    setError('')
    setIsDeleting(true)

    try {
      await listingsApi.destroy(listingId)
      navigate('/')
    } catch (err) {
      if (err.status === 401) {
        navigate(`/login?redirect=${encodeURIComponent(`/listings/${listingId}/edit`)}`)
        return
      }

      setError(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section className="form-page">
      <div className="form-card">
        <div className="form-heading-row">
          <div>
            <p className="eyebrow">Listings</p>
            <h1>Edit listing</h1>
          </div>
          {canManageListing && (
            <button
              className="danger-action"
              disabled={isDeleting}
              onClick={handleDelete}
              type="button"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>

        {isLoading && <p className="muted compact">Loading listing...</p>}
        {!isLoading && listing && canManageListing && (
          <ListingForm
            error={error}
            initialListing={listing}
            isSubmitting={isSubmitting}
            onCancel={() => navigate('/')}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        )}
        {!isLoading && listing && !canManageListing && (
          <p className="error-message compact">You are not the owner of this listing.</p>
        )}
        {!isLoading && !listing && error && <p className="error-message compact">{error}</p>}
      </div>
    </section>
  )
}

export default EditListingPage
