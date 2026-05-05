import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function ListingNew({ currentUser, setFlash }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setFlash({ type: "error", message: "you must be logged in to continue" });
      navigate("/login");
    }
  }, [currentUser, navigate, setFlash]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser) {
      setFlash({ type: "error", message: "you must be logged in to continue" });
      navigate("/login");
      return;
    }

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
      const result = await api.createListing(formData);
      setFlash({ type: "success", message: result.message || "New Listing is Created!" });
      navigate("/listings");
    } catch (err) {
      setFlash({ type: "error", message: err.message });
      if (err.message.toLowerCase().includes("logged in")) {
        navigate("/login");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="row mt-3">
      <div className="col-8 offset-2">
        <h3>Create a new list</h3>
        <form
          method="POST"
          action="/api/listings"
          noValidate
          className="needs-validation"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input required type="text" name="listing[title]" className="form-control" placeholder="enter title" />
            <div className="valid-feedback">Title Looks good!</div>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input required type="text" name="listing[description]" className="form-control" placeholder="enter description" />
            <div className="invalid-feedback">Enter Valid Description</div>
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Upload Listing I
            </label>
            <input type="file" name="listing[image]" className="form-control" />
            <div className="invalid-feedback">Enter Valid URL!</div>
          </div>

          <div className="row">
            <div className="mb-3 col-4">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input required name="listing[price]" className="form-control" placeholder="1500" />
              <div className="invalid-feedback">Enter Valid Price!</div>
            </div>
            <div className="mb-3 col-8">
              <label htmlFor="location" className="form-label">
                location
              </label>
              <input required type="text" name="listing[location]" className="form-control" placeholder="Hyderabad, Telangana" />
              <div className="invalid-feedback">Enter Valid location</div>
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">
                country
              </label>
              <input required type="text" name="listing[country]" className="form-control" placeholder="India" />
              <div className="invalid-feedback">Enter Valid country</div>
            </div>
          </div>

          <button className="btn btn-dark add-btn mt-3" type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add"}
          </button>
          <div className="mt-5"></div>
        </form>
      </div>
    </div>
  );
}
