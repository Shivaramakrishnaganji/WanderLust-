import { useState } from 'react'

const emptyListing = {
  title: '',
  description: '',
  price: '',
  location: '',
  country: '',
}

function ListingForm({
  error,
  initialListing = emptyListing,
  isSubmitting,
  onCancel,
  onSubmit,
  submitLabel,
}) {
  const [listing, setListing] = useState({
    title: initialListing.title || '',
    description: initialListing.description || '',
    price: initialListing.price == null ? '' : String(initialListing.price),
    location: initialListing.location || '',
    country: initialListing.country || '',
  })
  const [imageFile, setImageFile] = useState(null)

  const handleChange = (event) => {
    setListing((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ listing, imageFile })
  }

  return (
    <form className="listing-form" onSubmit={handleSubmit}>
      {error && <p className="error-message compact">{error}</p>}

      <label>
        Title
        <input
          name="title"
          onChange={handleChange}
          required
          type="text"
          value={listing.title}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          onChange={handleChange}
          required
          rows="5"
          value={listing.description}
        />
      </label>

      <div className="form-grid">
        <label>
          Price
          <input
            min="0"
            name="price"
            onChange={handleChange}
            required
            type="number"
            value={listing.price}
          />
        </label>

        <label>
          Country
          <input
            name="country"
            onChange={handleChange}
            required
            type="text"
            value={listing.country}
          />
        </label>
      </div>

      <label>
        Location
        <input
          name="location"
          onChange={handleChange}
          required
          type="text"
          value={listing.location}
        />
      </label>

      <label>
        Image
        <input
          accept="image/png,image/jpeg,image/jpg"
          name="image"
          onChange={(event) => setImageFile(event.target.files[0] || null)}
          type="file"
        />
      </label>

      <div className="form-actions">
        <button className="primary-action" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        <button className="secondary-action" onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ListingForm
