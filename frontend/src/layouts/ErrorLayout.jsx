import MainLayout from "./MainLayout";

export default function ErrorLayout({ currentUser, onLogout, flash, children }) {
  return (
    <MainLayout currentUser={currentUser} onLogout={onLogout} flash={flash}>
      {children}
    </MainLayout>
  );
}