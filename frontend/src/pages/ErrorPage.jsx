export default function ErrorPage({ message = "Something went wrong" }) {
  return (
    <div className="row mt-3">
      <div className="alert alert-danger col-6 offset-3" role="alert">
        <h4 className="alert-heading">{message}</h4>
      </div>
    </div>
  );
}