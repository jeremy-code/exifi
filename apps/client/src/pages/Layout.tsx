import { Outlet } from "react-router";

import { Footer } from "#layout/Footer";
import { Navbar } from "#layout/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      {/* `mt-15.25` accounts for <Navbar> height */}
      <main className="container mt-15.25 py-8">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export { Layout };
