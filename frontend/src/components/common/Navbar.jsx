import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .btn-search{
          background-color: #fe424f;
          color: #fff;
          border-radius: 25px;
          padding: 0.5rem 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          white-space: nowrap;
          line-height: 1;
        }

        .btn-search:hover{
          background-color: #fe424f;
          color: #fff;
        }

        .btn-search i {
          font-size: 0.95rem;
        }

        .search-inp{
          border-radius: 25px;
          padding: 0.5rem 3rem 0.5rem 3rem;
          font-size: 1rem;
        }
      `}</style>
      <nav className="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/listings">
            <i className="fa-solid fa-compass"></i>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav">
              <Link className="nav-link" to="/listings">
                Explore
              </Link>
            </div>

            <div className="navbar-nav ms-auto">
              <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                <input className="form-control me-2 search-inp" type="search" placeholder="Search destination" aria-label="Search" />
                <button className="btn btn-search" type="submit">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>Search</span>
                </button>
              </form>
            </div>

            <div className="navbar-nav ms-auto">
              <Link className="nav-link" to="/listings/new">
                Add new Listings
              </Link>
              {currentUser ? (
                <>
                  <a
                    className="nav-link"
                    href="/logout"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await onLogout();
                        navigate("/listings");
                      } catch (err) {
                        // flash state is handled in App
                      }
                    }}
                  >
                    Logout
                  </a>
                </>
              ) : (
                <>
                  <Link className="nav-link" to="/signup">
                    Sign up
                  </Link>
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
