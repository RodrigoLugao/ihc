// src/pages/EventosPage.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import type { Evento } from "../interfaces/Evento";
import type { EventSearchForm } from "../components/FormBuscaEventos";
import FormBuscaEventos from "../components/FormBuscaEventos";
import { type CurriculoTipo } from "../utils/acutils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFilter,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { useEventStore } from "../store/eventoStore";

dayjs.locale("pt-br");

const EventosPage = () => {
  const [displayedEvents, setDisplayedEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Estado para controlar a visibilidade do formulário. Inicia escondido.
  const [showForm, setShowForm] = useState(false);
  // Ref para controlar se é a primeira montagem do componente
  const isInitialMount = useRef(true);

  const { initializeStore, getFilteredEvents } = useEventStore();
  const allEventsFromStore = useEventStore((state) => state.eventos);

  const [initialFormValues, setInitialFormValues] =
    useState<EventSearchForm | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(4);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalFilteredCount, setTotalFilteredCount] = useState<number>(0);

  const parseQueryParams = useCallback(() => {
    const queryParams = new URLSearchParams(location.search);
    const filters: EventSearchForm = {
      searchTerm: queryParams.get("searchTerm") || "",
      startDate: queryParams.get("startDate") || "",
      endDate: queryParams.get("endDate") || "",
      location: queryParams.get("location") || "",
      minHours: queryParams.get("minHours")
        ? Number(queryParams.get("minHours"))
        : "",
      maxHours: queryParams.get("maxHours")
        ? Number(queryParams.get("maxHours"))
        : "",
      categories: queryParams.get("categories")
        ? queryParams
            .get("categories")!
            .split(",")
            .map((cat) => cat.trim())
            .filter((cat) => cat.length > 0)
        : [],
      curriculoType:
        (queryParams.get("curriculoType") as CurriculoTipo) || "curriculoNovo",
      excludeCategories: queryParams.get("excludeCategories")
        ? queryParams
            .get("excludeCategories")!
            .split(",")
            .map((cat) => cat.trim())
            .filter((cat) => cat.length > 0)
        : [],
    };
    return {
      filters,
      page: queryParams.get("page") ? Number(queryParams.get("page")) : 1,
    };
  }, [location.search]);

  useEffect(() => {
    setIsLoading(true);
    initializeStore();
    const { filters, page } = parseQueryParams();

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    const filteredResults = getFilteredEvents(filters);
    setTotalFilteredCount(filteredResults.length);

    const totalCount = filteredResults.length;
    const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage);
    setTotalPages(calculatedTotalPages);

    let actualPage = page;
    if (page > calculatedTotalPages && calculatedTotalPages > 0) {
      actualPage = calculatedTotalPages;
      const newQueryParams = new URLSearchParams(location.search);
      newQueryParams.set("page", String(actualPage));
      navigate(`${location.pathname}?${newQueryParams.toString()}`, {
        replace: true,
      });
      return;
    } else if (calculatedTotalPages === 0) {
      actualPage = 1;
    }

    const startIdx = (actualPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedEvents = filteredResults.slice(startIdx, endIdx);

    setDisplayedEvents(paginatedEvents);
    setCurrentPage(actualPage);
    setIsLoading(false);
    setInitialFormValues(filters);

    console.log("Busca e Paginação finalizada.");
  }, [
    location.search,
    itemsPerPage,
    initializeStore,
    parseQueryParams,
    getFilteredEvents,
    allEventsFromStore,
    navigate,
  ]);

  const handleSearchSubmit = (filters: EventSearchForm) => {
    const newQueryParams = new URLSearchParams();
    if (filters.searchTerm)
      newQueryParams.set("searchTerm", filters.searchTerm);
    if (filters.startDate) newQueryParams.set("startDate", filters.startDate);
    if (filters.endDate) newQueryParams.set("endDate", filters.endDate);
    if (filters.location) newQueryParams.set("location", filters.location);
    if (filters.minHours !== "" && filters.minHours !== null)
      newQueryParams.set("minHours", String(filters.minHours));
    if (filters.maxHours !== "" && filters.maxHours !== null)
      newQueryParams.set("maxHours", String(filters.maxHours));
    if (filters.categories && filters.categories.length > 0) {
      newQueryParams.set("categories", filters.categories.join(","));
    }
    if (filters.curriculoType)
      newQueryParams.set("curriculoType", filters.curriculoType);
    if (filters.excludeCategories && filters.excludeCategories.length > 0) {
      newQueryParams.set(
        "excludeCategories",
        filters.excludeCategories.join(",")
      );
    }
    newQueryParams.set("page", "1");
    navigate(`${location.pathname}?${newQueryParams.toString()}`);
  };

  const handleClearFilters = () => {
    navigate(location.pathname);
    setShowForm(false);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const { filters } = parseQueryParams();
    const newQueryParams = new URLSearchParams();

    if (filters.searchTerm)
      newQueryParams.set("searchTerm", filters.searchTerm);
    if (filters.startDate) newQueryParams.set("startDate", filters.startDate);
    if (filters.endDate) newQueryParams.set("endDate", filters.endDate);
    if (filters.location) newQueryParams.set("location", filters.location);
    if (filters.minHours !== "" && filters.minHours !== null)
      newQueryParams.set("minHours", String(filters.minHours));
    if (filters.maxHours !== "" && filters.maxHours !== null)
      newQueryParams.set("maxHours", String(filters.maxHours));
    if (filters.categories && filters.categories.length > 0) {
      newQueryParams.set("categories", filters.categories.join(","));
    }
    if (filters.curriculoType)
      newQueryParams.set("curriculoType", filters.curriculoType);
    if (filters.excludeCategories && filters.excludeCategories.length > 0) {
      newQueryParams.set(
        "excludeCategories",
        filters.excludeCategories.join(",")
      );
    }

    newQueryParams.set("page", String(page));
    navigate(`${location.pathname}?${newQueryParams.toString()}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="background-div-2 text-white py-5" style={{minHeight: "900px"}}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0" style={{ fontWeight: "bold" }}>
            Todos os Eventos
          </h1>
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm d-flex align-items-center"
              onClick={() => setShowForm(!showForm)}
            >
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              <span className="d-none d-md-block">
                {showForm ? "Esconder Filtros" : "Mostrar Filtros"}
              </span>
              <FontAwesomeIcon
                icon={showForm ? faChevronUp : faChevronDown}
                className="ms-2 d-none d-md-inline"
              />
              <span className="d-block d-md-none">
                <FontAwesomeIcon icon={showForm ? faChevronUp : faChevronDown} />
              </span>
            </button>
            <button
              onClick={handleGoBack}
              className="btn btn-outline-light btn-sm"
            >
              <span className="d-none d-md-block">Voltar</span>
              <span className="d-block d-md-none">
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
            </button>
          </div>
        </div>

        <div className="row">
          {showForm && (
            <div className="col-12 col-md-5 mb-4 mb-md-0">
              <FormBuscaEventos
                onSearch={handleSearchSubmit}
                onClear={handleClearFilters}
                initialFormData={initialFormValues}
              />
            </div>
          )}

          <div className={showForm ? "col-12 col-md-7" : "col-12"}>
            <div className="p-4 rounded shadow-sm bg-white" style={{ minHeight: '400px' }}> {/* Adicionado minHeight */}
              {/* Contagem de resultados e Paginação */}
              <div className="d-md-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-md-0 text-dark" style={{ fontWeight: "bold" }}>
                  {totalFilteredCount} eventos encontrados
                </h3>
                {totalPages > 0 && (
                  // Em telas pequenas, a paginação fica abaixo e centralizada
                  // Em telas médias/grandes, ela fica ao lado e à direita
                  <nav className="d-block d-md-flex align-items-center mt-3 mt-md-0 justify-content-center justify-content-md-end">
                    <ul className="pagination mb-0">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </button>
                      </li>
                      {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            page === currentPage ? "active" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Próximo
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>

              {totalPages > 0 && (
                // Texto "Página X de Y" também se adapta:
                // Em telas pequenas, fica abaixo da paginação e centralizado.
                // Em telas médias/grandes, continua alinhado à direita.
                <p className="text-center text-md-end text-dark mt-2">
                  Página {currentPage} de {totalPages}
                </p>
              )}

              {isLoading ? (
                <div
                  className="d-flex flex-column align-items-center justify-content-center"
                  style={{ minHeight: "200px" }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-3 text-dark">Buscando eventos, aguarde...</p>
                </div>
              ) : displayedEvents.length > 0 ? (
                <>
                  <div className="event-list-container">
                    {displayedEvents.map((event) => (
                      <div
                        className="event-item mb-3 p-3 rounded bg-light"
                        key={event.id}
                      >
                        <h5 className="event-title mb-1">
                          <Link
                            className="text-decoration-none nav-custom-link texto-azul-escuro"
                            to={`/eventos/${event.slug}`}
                          >
                            {event.name}
                          </Link>
                          <span className="event-date text-muted fst-italic ms-2">
                            -{" "}
                            {dayjs(event.startDate).format("DD/MM/YYYY HH:mm")}{" "}
                            até{" "}
                            {dayjs(event.endDate).format("DD/MM/YYYY HH:mm")}
                          </span>
                        </h5>
                        <p className="event-description text-dark mb-0">
                          Local: {event.location}
                        </p>
                        <p className="event-description text-dark mt-3 mb-3">
                          {event.description}
                        </p>
                        <Link
                          className="btn btn-outline-success"
                          to={`/eventos/${event.slug}`}
                        >
                          Mais Informações
                        </Link>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-dark">
                  Nenhum evento encontrado com os filtros aplicados.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventosPage;