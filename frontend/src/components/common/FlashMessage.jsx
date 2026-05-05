export default function FlashMessage({ flash }) {
  if (!flash || !flash.message) return null;

  const className = flash.type === "error" ? "alert-danger" : "alert-success";

  return (
    <div className={`alert ${className} alert-dismissible fade show col-6 offset-3`} role="alert">
      {flash.message}
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  );
}