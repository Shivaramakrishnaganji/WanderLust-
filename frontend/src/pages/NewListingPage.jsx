import { useState } from 'react'
import ListingForm from '../components/ListingForm.jsx'
import { listingsApi } from '../services/api.js'

function NewListingPage({ navigate }) {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async ({ listing, imageFile }) => {
    setError('')
    setIsSubmitting(true)

    try {
      await listingsApi.create({ listing, imageFile })
      navigate('/')
    } catch (err) {
      if (err.status === 401) {
        navigate('/login?redirect=%2Flistings%2Fnew')
        return
      }

      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="form-page">
      <div className="form-card">
        <div>
          <p className="eyebrow">Listings</p>
          <h1>Create listing</h1>
        </div>
        <ListingForm
          error={error}
          isSubmitting={isSubmitting}
          onCancel={() => navigate('/')}
          onSubmit={handleSubmit}
          submitLabel="Create listing"
        />
      </div>
    </section>
  )
}

export default NewListingPage
