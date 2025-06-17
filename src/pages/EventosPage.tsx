// src/pages/EventosPage.tsx
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Removi 'replace' pois não é mais necessário chamá-lo explicitamente
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
// isSameOrBefore e isSameOrAfter agora são estendidos no eventStore.ts
// dayjs.extend(isSameOrBefore);
// dayjs.extend(isSameOrAfter);

// import { eventData, type Evento } from "../interfaces/Evento"; // REMOVIDO: Usaremos o store
import type { Evento } from "../interfaces/Evento"; // Mantenha a importação da interface
import type { EventSearchForm } from "../components/FormBuscaEventos";
import FormBuscaEventos from "../components/FormBuscaEventos";
import { type CurriculoTipo } from "../utils/acutils"; // Ainda necessário para a interface de filtro
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEventStore } from "../store/eventoStore";


dayjs.locale("pt-br");

const EventosPage = () => {
  // REMOVIDO: allFilteredEvents não é mais um estado local, é gerado pelo store
  // const [allFilteredEvents, setAllFilteredEvents] = useState<Evento[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Obtenha a função do store
  const { initializeStore, getFilteredEvents } = useEventStore();
  // Pega o estado `eventos` para re-renderizar quando o store muda (se necessário, embora getFilteredEvents já chame initializeStore)
  const allEventsFromStore = useEventStore((state) => state.eventos);


  const [initialFormValues, setInitialFormValues] =
    useState<EventSearchForm | null>(null);

  // --- Estados de Paginação ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(4);
  const [totalPages, setTotalPages] = useState<number>(0);
  // --- Fim Estados de Paginação ---

  // parseQueryParams agora lida com 'categories' e 'excludeCategories' como arrays na URL
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
      // Lendo categorias como arrays da URL, esperando que venham como strings separadas por vírgula
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
      limit: queryParams.get("limit") ? Number(queryParams.get("limit")) : 4,
    };
  }, [location.search]);

  // Função centralizada para aplicar filtros e paginação
  const applyFiltersAndPaginate = useCallback(
    (filters: EventSearchForm, page: number) => {
      setIsLoading(true);
      // Pega os eventos já filtrados diretamente do store
      const filteredEvents = getFilteredEvents(filters);

      // --- Aplicar Paginação ---
      const totalCount = filteredEvents.length;
      const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage);
      setTotalPages(calculatedTotalPages);

      const startIdx = (page - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const paginatedEvents = filteredEvents.slice(startIdx, endIdx);

      // REMOVIDO: setAllFilteredEvents não é mais necessário aqui
      // setAllFilteredEvents(filteredEvents);
      setDisplayedEvents(paginatedEvents);
      setCurrentPage(page);

      setIsLoading(false);
      console.log("Busca finalizada. Total de eventos filtrados:", totalCount);
      console.log("Eventos exibidos na página atual:", paginatedEvents.length);
    },
    [getFilteredEvents, itemsPerPage] // Dependências: getFilteredEvents (do store) e itemsPerPage
  );

  // Efeito para carregar filtros da URL e aplicar a busca inicial
  useEffect(() => {
    // Garante que o store está inicializado antes de tentar usar seus dados
    initializeStore();

    const { filters, page } = parseQueryParams(); // Desestrutura os filtros e a página

    // Verifica se há algum parâmetro de filtro para inicializar o formulário
    const hasAnyFilterParam = Object.values(filters).some(
      (value) =>
        (typeof value === "string" && value !== "") ||
        (typeof value === "number" &&
          !isNaN(value) &&
          value !== Infinity &&
          value !== -Infinity) ||
        (Array.isArray(value) && value.length > 0) // Inclui verificação para arrays não vazios
    );

    if (hasAnyFilterParam) {
      setInitialFormValues(filters); // Define apenas os filtros para o formulário
      applyFiltersAndPaginate(filters, page); // Aplica a busca com os filtros e a página da URL
    } else {
      setInitialFormValues(null); // Reseta os valores do formulário
      // Aplica a busca sem filtros e na primeira página (se não houver filtros na URL)
      applyFiltersAndPaginate(
        {
          searchTerm: "",
          startDate: "",
          endDate: "",
          location: "",
          minHours: "",
          maxHours: "",
          categories: [],
          curriculoType: "curriculoNovo",
          excludeCategories: [],
        },
        1
      );
    }
  }, [location.search, applyFiltersAndPaginate, parseQueryParams, initializeStore]); // Adicione initializeStore

  // Função que o FormBuscaEventos chamará ao submeter
  const handleSearchSubmit = (filters: EventSearchForm) => {
    // Ao fazer uma nova busca (aplicar filtros), sempre volta para a primeira página
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

    // Agora, passa 'categories' e 'excludeCategories' como strings separadas por vírgula para a URL
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

    newQueryParams.set("page", "1"); // Sempre define a página para 1 em uma nova busca
    newQueryParams.set("limit", String(itemsPerPage));

    navigate(`${location.pathname}?${newQueryParams.toString()}`, { replace: true });
  };

  const handleClearFilters = () => {
    setIsLoading(true); // Começa a carregar
    const currentPath = location.pathname;
    const currentSearch = location.search;
    const newSearch = ""; // A URL limpa

    // Verifica se a URL já está limpa para evitar navegação desnecessária
    if (currentSearch === newSearch) {
      setIsLoading(false);
      applyFiltersAndPaginate( // Aplica a busca sem filtros para resetar a exibição
        {
          searchTerm: "",
          startDate: "",
          endDate: "",
          location: "",
          minHours: "",
          maxHours: "",
          categories: [],
          curriculoType: "curriculoNovo",
          excludeCategories: [],
        },
        1
      );
    } else {
      // Se a URL não está limpa, navega para limpar, o useEffect cuidará do resto
      navigate(currentPath, { replace: true });
      // O setIsLoading(false) será chamado pelo useEffect após applyFiltersAndPaginate
    }
  };

  // Lógica de Paginação para botões na EventosPage
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const { filters } = parseQueryParams(); // Pega apenas os filtros atuais da URL
    const newQueryParams = new URLSearchParams();

    // Copia os filtros existentes para a nova URL
    if (filters.searchTerm)
      newQueryParams.set("searchTerm", filters.searchTerm);
    if (filters.startDate) newQueryParams.set("startDate", filters.startDate);
    if (filters.endDate) newQueryParams.set("endDate", filters.endDate);
    if (filters.location) newQueryParams.set("location", filters.location);
    if (filters.minHours !== "" && filters.minHours !== null)
      newQueryParams.set("minHours", String(filters.minHours));
    if (filters.maxHours !== "" && filters.maxHours !== null)
      newQueryParams.set("maxHours", String(filters.maxHours));

    // Copia as categorias como strings separadas por vírgula para a URL
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

    // Define a nova página e mantém o limite de itens
    newQueryParams.set("page", String(page));
    newQueryParams.set("limit", String(itemsPerPage));

    navigate(`${location.pathname}?${newQueryParams.toString()}`);
  };

  // Função para lidar com o clique do botão Voltar
  const handleGoBack = () => {
    navigate(-1); // Volta uma entrada no histórico do navegador
  };

  // O estado 'allFilteredEvents' não é mais necessário localmente.
  // Você pode obter a contagem total de eventos filtrados a partir de `getFilteredEvents`
  // antes de aplicar a paginação no `applyFiltersAndPaginate`.
  // Para exibir a contagem total, precisaremos recalcular isso no `useEffect` ou `useCallback`.
  const [totalFilteredCount, setTotalFilteredCount] = useState<number>(0);

  useEffect(() => {
    initializeStore(); // Garante que o store está inicializado
    const { filters, page } = parseQueryParams();
    const filteredResults = getFilteredEvents(filters); // Obtém todos os eventos filtrados
    setTotalFilteredCount(filteredResults.length); // Define a contagem total

    // Aplica a paginação sobre os eventos filtrados
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginated = filteredResults.slice(startIdx, endIdx);

    setDisplayedEvents(paginated);
    setCurrentPage(page);
    setTotalPages(Math.ceil(filteredResults.length / itemsPerPage));
    setIsLoading(false);
  }, [location.search, itemsPerPage, initializeStore, parseQueryParams, getFilteredEvents, allEventsFromStore]); // Adicione allEventsFromStore para re-executar quando o estado do store mudar


  return (
    <div className="background-div-2 text-white py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0" style={{ fontWeight: "bold" }}>
            Todos os Eventos
          </h1>
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

        <div className="row">
          <div className="col-12 col-md-5 mb-4 mb-md-0">
            <FormBuscaEventos
              onSearch={handleSearchSubmit}
              onClear={handleClearFilters}
              initialFormData={initialFormValues}
            />
          </div>

          <div className="col-12 col-md-7">
            <div className="p-4 rounded shadow-sm bg-white">
              <h2 className="mb-1 text-dark" style={{ fontWeight: "bold" }}>
                Lista de Eventos
              </h2>
              <h3 className="mb-4 text-dark">
                {totalFilteredCount} eventos encontrados
              </h3>
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
                  {/* --- Seção de Paginação no EventosPage --- */}
                  {totalPages > 0 && (
                    <div className="mt-4">
                      <nav>
                        <ul className="pagination justify-content-center">
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
                      <p className="text-center text-dark mt-2">
                        Página {currentPage} de {totalPages}
                      </p>
                    </div>
                  )}
                  {/* --- Fim da Seção de Paginação --- */}
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