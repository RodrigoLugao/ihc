import { Link } from "react-router-dom";
import Card from "../components/Card";
// Remova a importação direta de eventData, pois usaremos o store
// import { eventData } from "../interfaces/Evento"; 

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useEventStore } from "../store/eventoStore";
dayjs.locale("pt-br");

const HomePage = () => {
  // Acessa a função getEventos do seu store
  const getEventos = useEventStore((state) => state.getEventos);

  // Obtém os eventos do store e pega apenas os 4 primeiros
  const eventosParaExibir = getEventos().slice(0, 4);

  // Dados dos cards para facilitar a renderização e reutilização
  const cardData = [
    {
      id: 1, // ID único para a key no React
      imageUrl: "palestra.png", // Caminho relativo à pasta public
      title: "O que são?",
      text: "Aprenda o que são as Atividades Complementares",
      linkTo: "/atividades", // O destino do link
    },
    {
      id: 2,
      imageUrl: "tabelas.png",
      title: "Tabela de Atividades",
      text: "Descubra as categorias de atividades e os limites de horas de cada categoria",
      linkTo: "/atividades#tabela-atividades",
    },
    {
      id: 3,
      imageUrl: "perguntas.jpg",
      title: "Perguntas Frequentes",
      text: "As dúvidas mais comuns sobre Atividades Complementares",
      linkTo: "/perguntas",
    },
  ];

  return (
    <>
      {/* Seção Principal com Imagem de Fundo */}
      <div className="background-div text-white">
        <div className="container">
          <div className="row pt-5">
            <h1
              className="col-md-5 col-12 mb-3"
              style={{ fontSize: "3.3em", fontWeight: "bold" }}
            >
              Sistema de Organização de Atividades Complementares
            </h1>
            <p
              className="text-light col-md-8 col-12 text-1 mb-3"
              style={{ fontSize: "1.75em" }}
            >
              Aqui, você pode gerenciar suas horas de atividades complementares
              de forma simples e eficiente.{" "}
              <span className="d-none d-md-block">
                {" "}
                Nosso objetivo é facilitar o processo para que você tenha mais
                controle sobre seu progresso acadêmico, sem dor de cabeça.{" "}
              </span>
            </p>
            <div className="w-100"></div> {/* Quebra de linha */}
            <Link
              className="comece-agora-link text-decoration-none"
              to="/dashboard"
              style={{ fontSize: "1.75em", width: "245px" }}
            >
              Comece Agora <i className="bi bi-chevron-right"></i>
            </Link>
            {/* Margens para espaçamento vertical, se necessário */}
            <div className="w-100 mt-5 mb-5"></div>
            <div className="w-100 mt-5 mb-5"></div>
          </div>
        </div>
      </div>

      {/* Seção de Cards (Atividades Complementares) */}
      <div className="background-div-no-image d-flex text-white">
        <div className="container">
          <div className="row pt-5">
            <h2 className="mb-5 col-12" style={{ fontWeight: "bold" }}>
              {" "}
              Atividades Complementares:
            </h2>

            {/* Versão para telas GRANDES (md e acima) - Cards em Colunas */}
            <div className="row d-none d-md-flex">
              {" "}
              {cardData.map((card) => (
                <div className="col-md-4 mb-4" key={card.id}>
                  <Link
                    to={card.linkTo}
                    className="text-decoration-none text-dark"
                  >
                    <Card
                      imageUrl={card.imageUrl}
                      title={card.title}
                      text={card.text}
                    />
                  </Link>
                </div>
              ))}
            </div>

            {/* Versão para telas PEQUENAS (sm e abaixo) - Carrossel de Cards */}
            <div className="d-md-none col-12">
              {" "}
              <div
                id="cardsCarousel"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {cardData.map((card, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      key={card.id}
                    >
                      <div className="d-flex justify-content-center px-4">
                        <Link
                          to={card.linkTo}
                          className="text-decoration-none text-dark"
                        >
                          <Card
                            imageUrl={card.imageUrl}
                            title={card.title}
                            text={card.text}
                          />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controles do Carrossel (setas) */}
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#cardsCarousel"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Anterior</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#cardsCarousel"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Próximo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Seção de Eventos */}
      <div className="background-div-no-image text-white pb-5">
        <div className="container pt-5">
          <h2 className="mb-5 col-12" style={{ fontWeight: "bold" }}>
            Próximos Eventos:
          </h2>

          <div className="row pt-3 pb-5 bg-light rounded shadow-sm">
            <Link
              className="comece-agora-link col-2 text-decoration-none mb-2  mx-2"
              to="/eventos"
              style={{ fontSize: "1.25em" }}
            >
              {" "}
              Ver Todos <i className="bi bi-chevron-right"></i>
            </Link>
            <div className="col-12"></div>
            <div className="col-12 col-md-6">
              <div className="event-list-container">
                {/* Iterando sobre os eventos obtidos do store, limitados a 4 */}
                {eventosParaExibir.map((event) => (
                  <div className="event-item mb-3 p-3 rounded" key={event.id}>
                    <h5 className="event-title mb-1">
                      <Link
                        className="text-decoration-none"
                        style={{ color: "inherit" }}
                        to={`/eventos/${event.slug}`}
                      >
                        {event.name}{" "}
                      </Link>
                      <span className="event-date text-muted fst-italic ms-2">
                        - {dayjs(event.startDate).format("DD/MM/YYYY HH:mm")}{" "}
                        até {dayjs(event.endDate).format("DD/MM/YYYY HH:mm")}
                      </span>
                    </h5>
                    <p className="event-description text-secondary mb-0">
                      Local: {event.location}
                    </p>
                    <p className="event-description text-secondary mb-3">
                      {event.description}
                    </p>
                    <Link
                      className="btn btn-outline-success"
                      to={`/eventos/${event.slug}`}
                    >
                      Ver Evento
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6 d-none d-md-block">
              <img
                src={"quadro.png"}
                className="rounded"
                alt={"Quadro de Atividades"}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;