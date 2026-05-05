import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import FlashMessage from "../components/common/FlashMessage";

export default function MainLayout({ currentUser, onLogout, flash, children }) {
  return (
    <>
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <div className="container">
        <FlashMessage flash={flash} />
        {children}
      </div>
      <Footer />
    </>
  );
}