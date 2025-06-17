import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"; // Importe useLocation
import logo from "/atividades complementares logo.jpg";
import { useState, useRef } from "react";
import { useUserStore } from "../store/userStore";

const NavBar = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const usuario = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation(); // Use o hook useLocation aqui

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navbarTogglerRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    logout();
    setIsLoggingOut(false);
    navigate("/login");
  };

  const closeMobileMenu = () => {
    if (
      navbarTogglerRef.current &&
      navbarTogglerRef.current.getAttribute("aria-expanded") === "true"
    ) {
      navbarTogglerRef.current.click();
    }
  };

  // Determina o texto a ser exibido ao lado do logo
  const brandText = location.pathname === "/" ? "SOAC" : "Início";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light fixed-top px-5"
      style={{ minHeight: "90px" }}
    >
      <div className="container">
        <NavLink
          className="navbar-brand d-flex align-items-center"
          to="/"
          onClick={closeMobileMenu}
        >
          <img
            src={logo}
            width="50px"
            alt="Logo da Ferramenta de Organização"
          />
          {/* Renderiza o texto condicionalmente */}
          <p className="h5 texto-azul-escuro mb-0 ms-2">{brandText}</p>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          ref={navbarTogglerRef}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <NavLink
                className="nav-link texto-azul-escuro nav-custom-link"
                to="/atividades" // Corrigido para a rota correta da página de regras
                onClick={closeMobileMenu}
              >
                Sobre Atividades Complementares
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link texto-azul-escuro nav-custom-link"
                to="/dashboard"
                onClick={closeMobileMenu}
              >
                Organizador
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link texto-azul-escuro nav-custom-link"
                to="/eventos"
                onClick={closeMobileMenu}
              >
                Eventos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link texto-azul-escuro nav-custom-link"
                to="/perguntas"
                onClick={closeMobileMenu}
              >
                Perguntas Frequentes
              </NavLink>
            </li>

            {/* Links visíveis APENAS em telas pequenas (d-lg-none) */}
            <li className="nav-item d-lg-none mt-3">
              {!isAuthenticated && (
                <Link
                  className="btn btn-outline-success"
                  to="/login"
                  style={{ minWidth: "100px" }}
                  onClick={closeMobileMenu}
                >
                  Entrar
                </Link>
              )}
              {isAuthenticated && (
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  style={{ minWidth: "100px" }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span className="ms-2">Saindo...</span>
                    </>
                  ) : (
                    "Sair"
                  )}
                </button>
              )}
            </li>
          </ul>

          {/* Separador e Botões visíveis APENAS em telas grandes (d-none d-lg-block) */}
          <div className="d-none d-lg-block mx-3 border-start border-secondary ps-3"></div>
          <div className="d-none d-lg-block border-start border-secondary ps-3">
            {!isAuthenticated && (
              <Link className="btn btn-outline-success" to="/login">
                Entrar
              </Link>
            )}
            {isAuthenticated && (
              <>
                <span className="me-3 text-dark">Olá, {usuario?.nome}</span>
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  style={{ minWidth: "100px" }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span className="ms-2">Saindo...</span>
                    </>
                  ) : (
                    "Sair"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
