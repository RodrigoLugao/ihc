import { Link, NavLink, useNavigate } from "react-router-dom"; // Importe useNavigate
import logo from "../../public/atividades complementares logo.jpg";
import { useState, useRef } from "react"; // Importe useState e useRef
import { useUserStore } from "../store/userStore";

const NavBar = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const usuario = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout); // Pegue a função de logout do store
  const navigate = useNavigate(); // Hook para navegação

  const [isLoggingOut, setIsLoggingOut] = useState(false); // Estado para o spinner de logout
  const navbarTogglerRef = useRef<HTMLButtonElement>(null); // Ref para o botão do toggler

  const handleLogout = async () => {
    setIsLoggingOut(true); // Ativa o spinner

    // Simula um atraso de 1 segundo
    await new Promise((resolve) => setTimeout(resolve, 1000));

    logout(); // Realiza o logout via store
    setIsLoggingOut(false); // Desativa o spinner
    navigate("/login"); // Redireciona para a página de login
  };

  // Função para fechar o menu mobile ao clicar em um link
  const closeMobileMenu = () => {
    if (navbarTogglerRef.current && 
        navbarTogglerRef.current.getAttribute('aria-expanded') === 'true') {
      navbarTogglerRef.current.click(); // Simula um clique no botão para fechar
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light fixed-top px-5"
      style={{ minHeight: "90px" }}
    >
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/" onClick={closeMobileMenu}>
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
          ref={navbarTogglerRef} // Atribui a ref ao botão toggler
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <NavLink
                className="nav-link texto-azul-escuro nav-custom-link"
                to="/atividades"
                onClick={closeMobileMenu} // Adiciona o onClick
              >
                Sobre Atividades Complementares
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link texto-azul-escuro nav-custom-link"
                to="/dashboard"
                onClick={closeMobileMenu} // Adiciona o onClick
              >
                Organizador
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link texto-azul-escuro nav-custom-link"
                to="/eventos"
                onClick={closeMobileMenu} // Adiciona o onClick
              >
                Eventos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link texto-azul-escuro nav-custom-link"
                to="/perguntas"
                onClick={closeMobileMenu} // Adiciona o onClick
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
                  onClick={closeMobileMenu} // Adiciona o onClick
                >
                  Entrar
                </Link>
              )}
              {isAuthenticated && (
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  style={{ minWidth: "100px" }}
                  onClick={handleLogout} // Chama a função de logout
                  disabled={isLoggingOut} // Desabilita o botão durante o logout
                >
                  {isLoggingOut ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ms-2">Saindo...</span>
                    </>
                  ) : (
                    'Sair'
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
                <span className="me-3 text-dark">Olá, {usuario?.nome}</span> {/* Corrigido para text-dark */}
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  style={{ minWidth: "100px" }}
                  onClick={handleLogout} // Chama a função de logout
                  disabled={isLoggingOut} // Desabilita o botão durante o logout
                >
                  {isLoggingOut ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ms-2">Saindo...</span>
                    </>
                  ) : (
                    'Sair'
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