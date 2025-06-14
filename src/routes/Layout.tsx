import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <>
      <NavBar />
      <div style={{ marginTop: "90px" }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
export default Layout;
