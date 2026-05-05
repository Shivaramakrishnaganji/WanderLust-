import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function ListingsIndex({ setFlash }) {
  const [listings, setListings] = useState([]);
  const [showTax, setShowTax] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .getListings()
      .then((data) => {
        if (!active) return;
        setListings(data.listings || []);
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
  }, [setFlash]);

  return (
    <>
      <style>{`
        .filter{
          text-align: center;
          margin-right: 2rem;
          margin-top: 2rem;
          opacity: 0.7;
        }

        .tax-info{
          display: none;
        }

        .filter:hover{
          opacity: 1;
          cursor: pointer;
        }

        #filters{
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }

        .tax-toggle{
          border: 1px solid black;
          border-radius: 1rem;
          height: 3.5rem;
          padding: 1rem;
          margin-left: 5rem;
          display: flex;
          align-items: center;
        }
      `}</style>

      <div id="filters">
        <div className="filter">
          <div>
            <i className="fa-solid fa-fire"></i>
          </div>
          <p>Trending</p>
        </div>

        <div className="filter">
          <div>
            <i className="fa-solid fa-bed"></i>
          </div>
          <p>Rooms</p>
        </div>

        <div className="filter">
          <div>
            <i className="fa-solid fa-mountain-city"></i>
          </div>
          <p>Iconic Cities</p>
        </div>

        <div className="filter">
          <div>
            <i className="fa-solid fa-mountain"></i>
          </div>
          <p>Mountains</p>
        </div>

        <div className="filter">
          <div>
            <i className="fa-solid fa-person-swimming"></i>
          </div>
          <p>Amazing Pools</p>
        </div>

        <div className="filter">
          <div>
            <i className="fa-solid fa-bed"></i>
          </div>
          <p>Rooms</p>
        </div>

        {/* <div className="filter">
          <div>
            <i className="fa-solid fa-bed"></i>
          </div>
          <p>Rooms</p>
        </div>

        <div className="filter">
          <div>
            <i className="fa-solid fa-bed"></i>
          </div>
          <p>Rooms</p>
        </div> */}

        <div className="tax-toggle">
          <div className="form-check-reverse form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="switchCheckDefault"
              checked={showTax}
              onChange={(e) => setShowTax(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="switchCheckDefault">
              Display total after taxes
            </label>
          </div>
        </div>
      </div>

      {loading ? <p className="mt-4">Loading listings...</p> : null}

      <div className="row row-cols-lg-3 row row-cols-md-2 mt-3 row row-cols-sm-1">
        {listings.map((listing) => (
          <Link to={`/listings/${listing._id}`} key={listing._id} className="link-listing">
            <div className="card col listing-card" style={{ width: "20rem" }}>
              <img src={listing.image?.url} className="card-img-top" style={{ height: "20rem" }} alt="listing_img" />
              <div className="card-img-overlay"></div>
              <div className="card-body">
                <p className="card-text">
                  <b>{listing.title}</b>
                  <br />
                  {Number(listing.price || 0).toLocaleString("en-IN")} / night
                  <i className="tax-info" style={{ display: showTax ? "inline" : "none" }}>
                    &nbsp; &nbsp; +18% GST
                  </i>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
