import { Link, NavLink } from "react-router-dom";
import logo from "../../public/atividades complementares logo.jpg";

const NavBar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light fixed-top px-5"
      style={{ minHeight: "90px" }}
    >
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            width="50px"
            alt="Logo da Ferramenta de Organização"
          />
          <p className="h5 texto-azul-escuro mb-0 ms-2">SOAC</p>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <NavLink className="nav-link texto-azul-escuro nav-custom-link" to="/atividades">
                Sobre Atividades Complementares
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link texto-azul-escuro nav-custom-link" to="/dashboard">
                Organizador
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link texto-azul-escuro nav-custom-link" to="/eventos">
                Eventos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link texto-azul-escuro nav-custom-link" to="/perguntas">
                Perguntas Frequentes
              </NavLink>
            </li>

            <li className="nav-item d-lg-none mt-3">
              <Link
                className="btn btn-outline-success"
                to="/login"
                style={{ minWidth: "100px" }}
              >
                Entrar
              </Link>
            </li>
          </ul>

          <div className="d-none d-lg-block mx-3 border-start border-secondary ps-3"></div>
          <div className="d-none d-lg-block border-start border-secondary ps-3">
            <Link className="btn btn-outline-success" to="/login">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
