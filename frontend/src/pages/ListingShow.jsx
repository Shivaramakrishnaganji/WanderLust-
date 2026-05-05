import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

const FALLBACK_COORDINATES = [78.48667, 17.38504];

export default function ListingShow({ currentUser, setFlash }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("1");
  const [mapToken, setMapToken] = useState(import.meta.env.VITE_MAP_TOKEN || "");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const isOwner = useMemo(() => {
    if (!currentUser || !listing?.owner) return false;
    return currentUser._id === listing.owner._id;
  }, [currentUser, listing]);

  useEffect(() => {
    let active = true;

    api
      .getListing(id)
      .then((data) => {
        if (!active) return;
        setListing(data.listing);
        setMapToken(data.mapToken || import.meta.env.VITE_MAP_TOKEN || "");
      })
      .catch((err) => {
        if (!active) return;
        setFlash({ type: "error", message: err.message });
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, setFlash]);

  useEffect(() => {
    if (!listing || !mapRef.current || !window.mapboxgl) return;
    if (!mapToken) return;

    const coordinates = listing.geometry?.coordinates || FALLBACK_COORDINATES;

    window.mapboxgl.accessToken = mapToken;

    const map = new window.mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: coordinates,
      zoom: 8,
    });

    new window.mapboxgl.Marker({ color: "red" })
      .setLngLat(coordinates)
      .setPopup(
        new window.mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h6>${listing.location}</h6><p>Exact location is provided after booking</p>`
        )
      )
      .addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listing, mapToken]);

  async function handleReviewSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    form.classList.add("was-validated");

    try {
      await api.createReview({
        listingId: id,
        review: {
          rating: Number(rating),
          comment,
        },
      });

      const data = await api.getListing(id);
      setListing(data.listing);
      setComment("");
      setRating("1");
      form.classList.remove("was-validated");
      setFlash({ type: "success", message: "New Review is Created!" });
    } catch (err) {
      setFlash({ type: "error", message: err.message });
    }
  }

  async function handleReviewDelete(reviewId) {
    try {
      await api.deleteReview({ reviewId, listingId: id });
      const data = await api.getListing(id);
      setListing(data.listing);
      setFlash({ type: "success", message: "Review is  Deleted!" });
    } catch (err) {
      setFlash({ type: "error", message: err.message });
    }
  }

  async function handleListingDelete() {
    try {
      const result = await api.deleteListing(id);
      setFlash({ type: "success", message: result.message || " Listing is Deleted!" });
      navigate("/listings");
    } catch (err) {
      setFlash({ type: "error", message: err.message });
      if (err.message.toLowerCase().includes("logged in")) {
        navigate("/login");
      }
    }
  }

  if (loading) {
    return <p className="mt-4">Loading listing...</p>;
  }

  if (!listing) {
    return <p className="mt-4">Listing not found.</p>;
  }

  return (
    <div className="show-page py-4">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="show-card">
            <img src={listing.image?.url} className="card-img-top show-img" alt={listing.title} />

            <div className="show-card-body">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                <div>
                  <h3 className="mb-2">{listing.title}</h3>
                  <p className="text-muted mb-0">Hosted by {listing.owner ? listing.owner.username : "Unknown"}</p>
                </div>

                <div className="show-price">
                  &#8377; {Number(listing.price || 0).toLocaleString("en-IN")}
                  <span>/ night</span>
                </div>
              </div>

              <hr />

              <p className="show-description">{listing.description}</p>

              <div className="show-meta">
                <span>
                  <i className="fa-solid fa-location-dot"></i> {listing.location}
                </span>
                <span>
                  <i className="fa-solid fa-earth-asia"></i> {listing.country}
                </span>
              </div>

              {isOwner ? (
                <div className="show-actions">
                  <Link to={`/listings/${listing._id}/edit`} className="btn btn-dark">
                    Edit
                  </Link>
                  <button className="btn btn-outline-dark" type="button" onClick={handleListingDelete}>
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mt-4">
        <div className="col-lg-9">
          {currentUser ? (
            <section className="review-panel">
              <h4 className="mb-3">Leave a Review</h4>
              <form onSubmit={handleReviewSubmit} noValidate className="needs-validation">
                <div className="mb-3">
                  <label className="form-label d-block">Rating</label>
                  <fieldset className="starability-slot">
                    <input type="radio" id="first-rate1" name="review[rating]" value="1" checked={rating === "1"} onChange={(e) => setRating(e.target.value)} />
                    <label htmlFor="first-rate1" title="Terrible">
                      1 star
                    </label>
                    <input type="radio" id="first-rate2" name="review[rating]" value="2" checked={rating === "2"} onChange={(e) => setRating(e.target.value)} />
                    <label htmlFor="first-rate2" title="Not good">
                      2 stars
                    </label>
                    <input type="radio" id="first-rate3" name="review[rating]" value="3" checked={rating === "3"} onChange={(e) => setRating(e.target.value)} />
                    <label htmlFor="first-rate3" title="Average">
                      3 stars
                    </label>
                    <input type="radio" id="first-rate4" name="review[rating]" value="4" checked={rating === "4"} onChange={(e) => setRating(e.target.value)} />
                    <label htmlFor="first-rate4" title="Very good">
                      4 stars
                    </label>
                    <input type="radio" id="first-rate5" name="review[rating]" value="5" checked={rating === "5"} onChange={(e) => setRating(e.target.value)} />
                    <label htmlFor="first-rate5" title="Amazing">
                      5 stars
                    </label>
                  </fieldset>
                </div>

                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">
                    Comments
                  </label>
                  <textarea
                    cols="30"
                    rows="4"
                    id="comment"
                    className="form-control"
                    name="review[comment]"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <div className="invalid-feedback">Please submit some comments for the review</div>
                </div>

                <button className="btn btn-outline-dark" type="submit">
                  Submit
                </button>
              </form>
            </section>
          ) : null}

          {listing.reviews?.length > 0 ? (
            <section className="mt-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="mb-0">All Reviews</h4>
                <span className="text-muted">{listing.reviews.length} total</span>
              </div>

              <div className="row g-3">
                {listing.reviews.map((review) => {
                  const canDelete = currentUser && review.author && currentUser._id === review.author._id;

                  return (
                    <div className="col-md-6" key={review._id}>
                      <div className="review-card">
                        <div className="d-flex justify-content-between gap-3">
                          <div>
                            <h5 className="mb-1">{review.author ? review.author.username : "Anonymous"}</h5>
                            <p className="starability-result mb-2" data-rating={review.rating}>
                              {review.rating}
                            </p>
                          </div>

                          {canDelete ? (
                            <button className="btn btn-sm btn-outline-dark" type="button" onClick={() => handleReviewDelete(review._id)}>
                              Delete
                            </button>
                          ) : null}
                        </div>

                        <p className="mb-0">{review.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          <hr />
          <h3>This is the place</h3>
          <div id="map" ref={mapRef}></div>
          {!mapToken ? (
            <p className="text-muted mt-2">Map token is missing.</p>
          ) : null}

          <div className="mt-4">
            <Link to="/listings" className="btn btn-outline-dark">
              Back to Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
