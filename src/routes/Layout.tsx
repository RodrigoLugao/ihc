import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

const Layout = () => {
  return (
    <>
      <NavBar />
      <ScrollToTop/>
      <div style={{ marginTop: "90px" }}>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
};
export default Layout;
