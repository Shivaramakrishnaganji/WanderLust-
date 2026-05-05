import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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
      await onSignup({ username, email, password });
      navigate("/listings");
    } catch (err) {
      // flash state is handled in App
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="row mt-3">
      <div className="col-6 offset-3">
        <h1 className="mb-3">Signup on Wanderlust</h1>
        <form action="/signup" method="post" className="needs-validation" noValidate onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              required
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Please choose a username.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Please provide a valid email.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              required
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Please enter a password.</div>
          </div>

          <button className="btn btn-success" type="submit" disabled={submitting}>
            {submitting ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}
