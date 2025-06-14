import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 w-100">
      <div className="container">
        {/* Desktop */}
        <div className="d-none d-md-flex justify-content-between">
          <section className="w-25">
            <h5>
              <NavLink
                className="text-white "
                to="/quem-somos"
              >
                Quem Somos
              </NavLink>
            </h5>
            <p className="text-white-50">
              Lorem ipsum 
            </p>
          </section>

          <nav className="w-25">
            <h5 className="text-white">Mapa do Site</h5>
            {/* <ul className="list-unstyled">
              <li>
                <NavLink
                  className="text-white-50"
                  to="/quem-somos"
                >
                  Quem Somos
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="text-white-50 "
                  to="/veiculos"
                >
                  Veículos
                </NavLink>
              </li>
              <li>
                <a className="text-white-50 " href="#">
                  Serviços
                </a>
              </li>
              <li>
                <NavLink
                  className="text-white-50 "
                  to="/contato"
                >
                  Contato
                </NavLink>
              </li>
            </ul> */}
          </nav>

          {/* <address className="w-25 text-white-50">
            <h5 className="text-white">Contato</h5>
            <p>
              <i className="fa-solid fa-phone"></i> (21) 999-999-999
            </p>
            <p>
              <i className="fa fa-envelope"></i> simasauto@turbo.com.br
            </p>
          </address>

          <section className="w-25 text-white-50">
            <h5 className="text-white">Endereço</h5>
            <p>
              123 Motor Drive - Automotive District, Detroit, MI, USA - ZIP
              48201
            </p>
          </section> */}
        </div>

        {/* Mobile */}
        <div className="d-block d-md-none text-center">
          <div
            className="btn-group mb-3"
            role="group"
            aria-label="Informações do footer"
          >
            <NavLink
              className="btn btn-dark text-white-50 "
              to="/quem-somos"
            >
              Quem Somos
            </NavLink>

            <button
              type="button"
              className="btn btn-dark text-white-50"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFooterContato"
              aria-expanded="false"
              aria-controls="collapseFooterContato"
            >
              Contato
            </button>

            <button
              type="button"
              className="btn btn-dark text-white-50"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFooterEndereco"
              aria-expanded="false"
              aria-controls="collapseFooterEndereco"
            >
              Endereço
            </button>
          </div>

          <div id="accordionFooter">
            <div
              className="collapse"
              id="collapseFooterContato"
              data-bs-parent="#accordionFooter"
            >
              <div className="card card-body bg-transparent text-white-50">
                <p>
                  <i className="fa-solid fa-phone"></i> (21) 999-999-999
                </p>
                <p>
                  <i className="fa fa-envelope"></i> simasauto@turbo.com.br
                </p>
              </div>
            </div>

            <div
              className="collapse"
              id="collapseFooterEndereco"
              data-bs-parent="#accordionFooter"
            >
              <div className="card card-body bg-transparent text-white-50">
                <p>
                  123 Motor Drive - Automotive District, Detroit, MI, USA - ZIP
                  48201
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
