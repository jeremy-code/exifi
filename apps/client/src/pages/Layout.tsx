import { Outlet } from "react-router";

import { Footer } from "#layout/Footer";
import { Navbar } from "#layout/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container py-8">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export { Layout };
