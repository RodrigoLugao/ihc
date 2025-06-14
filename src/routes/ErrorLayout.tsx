
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ErrorPage from "../pages/ErrorPage";

const ErrorLayout = () => {
  return (
    <>
      <NavBar />
      <div style={{ marginTop: "90px" }}>
        <ErrorPage></ErrorPage>
      </div>
      <Footer />
    </>
  );
};
export default ErrorLayout;
