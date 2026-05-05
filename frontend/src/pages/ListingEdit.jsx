import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function ListingEdit({ currentUser, setFlash }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    if (!currentUser) {
      setFlash({ type: "error", message: "you must be logged in to continue" });
      navigate("/login");
      return () => {
        active = false;
      };
    }

    api
      .getListingForEdit(id)
      .then((data) => {
        if (!active) return;
        setListing(data.listing);
        setOriginalImageUrl(data.originalImageUrl || "");
      })
      .catch((err) => {
        if (!active) return;
        setFlash({ type: "error", message: err.message });
        if (err.message.toLowerCase().includes("logged in")) {
          navigate("/login");
          return;
        }
        navigate(`/listings/${id}`);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentUser, id, navigate, setFlash]);

  const initialValues = useMemo(() => {
    if (!listing) return null;
    return {
      title: listing.title || "",
      description: listing.description || "",
      price: listing.price || "",
      country: listing.country || "",
      location: listing.location || "",
    };
  }, [listing]);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    form.classList.add("was-validated");
    setSubmitting(true);

    try {
      const formData = new FormData(form);
      const result = await api.updateListing(id, formData);
      setFlash({ type: "success", message: result.message || "Listing is Updated!" });
      navigate(`/listings/${id}`);
    } catch (err) {
      setFlash({ type: "error", message: err.message });
      if (err.message.toLowerCase().includes("logged in")) {
        navigate("/login");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="mt-4">Loading listing...</p>;
  }

  if (!initialValues) {
    return <p className="mt-4">Listing not found.</p>;
  }

  return (
    <div className="row mt-3">
      <div className="col-8 offset-2">
        <h3>Create a new list</h3>
        <form
          className="needs-validation"
          noValidate
          method="post"
          action={`/api/listings/${id}`}
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input type="text" name="listing[title]" defaultValue={initialValues.title} className="form-control" required />
            <div className="valid-feedback">Title Looks good!</div>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input type="text" name="listing[description]" defaultValue={initialValues.description} required className="form-control" />
            <div className="invalid-feedback">Enter Valid Description</div>
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Original IMG
            </label>
            <br />
            {originalImageUrl ? <img src={originalImageUrl} alt="IMG" /> : <span>No image</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Upload New Image
            </label>
            <input name="listing[image]" type="file" className="form-control" />
            <div className="invalid-feedback">Enter Valid Img!</div>
          </div>

          <div className="row">
            <div className="mb-3 col-md-4">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input type="number" name="listing[price]" required defaultValue={initialValues.price} className="form-control" />
              <div className="invalid-feedback">Enter Valid Price!</div>
            </div>

            <div className="mb-3 col-md-8">
              <label htmlFor="country" className="form-label">
                country
              </label>
              <input type="text" name="listing[country]" required defaultValue={initialValues.country} className="form-control" />
              <div className="invalid-feedback">Enter Valid County</div>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              location
            </label>
            <input type="text" name="listing[location]" required defaultValue={initialValues.location} className="form-control" />
            <div className="invalid-feedback">Enter Valid location</div>
          </div>
          <button className="btn btn-dark edit-btn mt-3" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Edit"}
          </button>
          <div className="mt-5"></div>
        </form>
      </div>
    </div>
  );
}
