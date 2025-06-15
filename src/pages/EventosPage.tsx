// src/pages/EventosPage.tsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Adicionado useNavigate
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

import { eventData, type Evento } from "../interfaces/Evento";
import type { EventSearchForm } from "../components/FormBuscaEventos";
import FormBuscaEventos from "../components/FormBuscaEventos";
import { calcularHorasAC, type CurriculoTipo } from "../utils/acutils";

dayjs.locale("pt-br");

const EventosPage = () => {
  const [filteredEvents, setFilteredEvents] = useState<Evento[]>(eventData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate(); // Hook para navegar programaticamente
  const [initialFormValues, setInitialFormValues] =
    useState<EventSearchForm | null>(null);

  const parseQueryParams = (): EventSearchForm => {
    const queryParams = new URLSearchParams(location.search);
    const data: EventSearchForm = {
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
      categoriesInput: queryParams.get("categoriesInput") || "",
      categories: [], // Processado abaixo
      curriculoType:
        (queryParams.get("curriculoType") as CurriculoTipo) || "curriculoNovo",
      // NOVO CAMPO: Lendo excludeCategoriesInput da URL
      excludeCategoriesInput: queryParams.get("excludeCategoriesInput") || "",
      excludeCategories: [], // Processado abaixo
    };

    // Processa a string de categoriesInput para preencher o array categories
    if (data.categoriesInput) {
      data.categories = data.categoriesInput
        .split(",")
        .map((category) => category.trim())
        .filter((category) => category.length > 0)
        .map((category) => category.toLowerCase());
    }

    // NOVO: Processa a string de excludeCategoriesInput para preencher o array excludeCategories
    if (data.excludeCategoriesInput) {
      data.excludeCategories = data.excludeCategoriesInput
        .split(",")
        .map((category) => category.trim())
        .filter((category) => category.length > 0)
        .map((category) => category.toLowerCase());
    }

    return data;
  };

  useEffect(() => {
    const params = parseQueryParams();
    const hasAnyParam = Object.values(params).some(
      (value) =>
        (typeof value === "string" && value !== "") ||
        (typeof value === "number" &&
          !isNaN(value) &&
          value !== Infinity &&
          value !== -Infinity) ||
        (Array.isArray(value) && value.length > 0)
    );

    if (hasAnyParam) {
      setInitialFormValues(params);
      handleSearch(params); // Dispara a busca com os valores da URL
    } else {
      setFilteredEvents(eventData);
      setInitialFormValues(null);
    }
  }, [location.search]);

  const handleSearch = (data: EventSearchForm) => {
    setIsLoading(true);
    console.log("Iniciando busca com dados:", data);

    // ... (construção dos query parameters e navigate existentes) ...

    setTimeout(() => {
      let tempEvents = eventData;
      const selectedCurriculoType: CurriculoTipo =
        data.curriculoType || "curriculoNovo";

      // 1. Filtrar por termo de busca (nome ou descrição do evento)
      if (data.searchTerm) {
        const lowerCaseSearchTerm = data.searchTerm.toLowerCase();
        tempEvents = tempEvents.filter(
          (event) =>
            event.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            event.description.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }

      // 2. Filtrar por data de início do evento
      if (data.startDate) {
        const searchStartDate = dayjs(data.startDate);
        if (searchStartDate.isValid()) {
          tempEvents = tempEvents.filter((event) =>
            dayjs(event.startDate).isSameOrAfter(searchStartDate, "day")
          );
        } else {
          console.warn("Data de início inválida fornecida:", data.startDate);
        }
      }

      // 3. Filtrar por data de fim do evento
      if (data.endDate) {
        const searchEndDate = dayjs(data.endDate);
        if (searchEndDate.isValid()) {
          tempEvents = tempEvents.filter((event) =>
            dayjs(event.endDate).isSameOrBefore(searchEndDate, "day")
          );
        } else {
          console.warn("Data de fim inválida fornecida:", data.endDate);
        }
      }

      // 4. Filtrar por local do evento
      if (data.location) {
        const lowerCaseLocation = data.location.toLowerCase();
        tempEvents = tempEvents.filter((event) =>
          event.location.toLowerCase().includes(lowerCaseLocation)
        );
      }

      const hasMinHours =
        data.minHours !== undefined &&
        data.minHours !== null &&
        data.minHours !== "";
      const minHoursValue = hasMinHours ? Number(data.minHours) : -Infinity;

      const hasMaxHours =
        data.maxHours !== undefined &&
        data.maxHours !== null &&
        data.maxHours !== "";
      const maxHoursValue = hasMaxHours ? Number(data.maxHours) : Infinity;

      const hasCategoriesToInclude =
        data.categories && data.categories.length > 0;
      const selectedCategoriesToInclude = hasCategoriesToInclude
        ? data.categories
        : [];

      const hasCategoriesToExclude =
        data.excludeCategories && data.excludeCategories.length > 0;
      const selectedCategoriesToExclude = hasCategoriesToExclude
        ? data.excludeCategories
        : [];

      if (
        hasMinHours ||
        hasMaxHours ||
        hasCategoriesToInclude ||
        hasCategoriesToExclude
      ) {
        tempEvents = tempEvents.filter((event) => {
          if (!event.activities || event.activities.length === 0) {
            return false; // Se o evento não tem atividades, ele não é relevante para este filtro.
          }

          // **NOVA LÓGICA DE EXCLUSÃO:**
          // Um evento é excluído SOMENTE SE TODAS as suas atividades
          // pertencerem a categorias que estão na lista de exclusão
          if (hasCategoriesToExclude) {
            const allActivitiesAreExcluded = event.activities.every(
              (activity) => {
                const activityCategoryType =
                  activity.categoria?.tipo?.toLowerCase();
                if (!activityCategoryType) return false; // Atividades sem categoria não contam para exclusão total

                // Verifica se a categoria da atividade está na lista de exclusão
                return selectedCategoriesToExclude.some((excludedCat) =>
                  activityCategoryType.includes(excludedCat)
                );
              }
            );

            if (allActivitiesAreExcluded) {
              return false; // Exclui o evento se TODAS as atividades são de categorias a excluir
            }
          }

          // Lógica de inclusão (se alguma atividade se encaixa nos critérios de horas/categorias de inclusão)
          // O evento é incluído se pelo menos UMA atividade NÃO for excluída (pela lógica acima)
          // E essa atividade atender aos critérios de horas/categorias de inclusão.
          return event.activities.some((activity) => {
            const activityCategoryType =
              activity.categoria?.tipo?.toLowerCase();

            if (!activityCategoryType) {
              return false; // Atividade sem categoria não pode ser avaliada para inclusão
            }

            // Garante que esta atividade específica não esteja na lista de categorias a excluir
            const isActivityExcluded = selectedCategoriesToExclude.some(
              (excludedCat) => activityCategoryType.includes(excludedCat)
            );
            if (isActivityExcluded && hasCategoriesToExclude) {
              // Se o filtro de exclusão está ativo E esta atividade está na lista de exclusão,
              // então esta atividade não pode contribuir para a inclusão do evento.
              return false;
            }

            const calculatedHoursAC = calcularHorasAC(
              activity,
              selectedCurriculoType
            );
            const meetsHoursCriteria =
              calculatedHoursAC >= minHoursValue &&
              calculatedHoursAC <= maxHoursValue;

            const meetsCategoryCriteria =
              !hasCategoriesToInclude ||
              selectedCategoriesToInclude.some((includedCat) =>
                activityCategoryType.includes(includedCat)
              );

            return meetsHoursCriteria && meetsCategoryCriteria;
          });
        });
      }

      setFilteredEvents(tempEvents);
      setIsLoading(false);
      console.log(
        "Busca finalizada. Eventos filtrados:",
        tempEvents.length,
        tempEvents
      );
    }, 1000);
  };

  const handleClearFilters = () => {
    setIsLoading(true);

    // Limpa os parâmetros da URL, o que irá disparar o useEffect para resetar a página
    navigate(location.pathname, { replace: true });

    setTimeout(() => {
      setInitialFormValues(null);
      setFilteredEvents(eventData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="background-div-2 text-white py-5">
      <div className="container">
        <h1 className="mb-4" style={{ fontWeight: "bold" }}>
          Próximos Eventos
        </h1>

        <div className="row">
          <div className="col-12 col-md-5 mb-4 mb-md-0">
            <FormBuscaEventos
              onSearch={handleSearch}
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
                {filteredEvents.length} eventos encontrados
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
              ) : filteredEvents.length > 0 ? (
                <div className="event-list-container">
                  {filteredEvents.map((event) => (
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
                          - {dayjs(event.startDate).format("DD/MM/YYYY HH:mm")}{" "}
                          até {dayjs(event.endDate).format("DD/MM/YYYY HH:mm")}
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
