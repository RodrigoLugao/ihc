// src/store/eventStore.ts
import { create } from "zustand";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

import { eventData, type Evento } from "../interfaces/Evento";
import type { EventSearchForm } from "../components/FormBuscaEventos";
import type { CurriculoTipo } from "../utils/acutils";

// Chave para o localStorage
const LOCAL_STORAGE_KEY = "eventStore";

// --- Funções Auxiliares de Serialização/Desserialização para localStorage ---

const reviveDates = (_: string, value: any): any => {
  if (typeof value === "string") {
    const dateMatch =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.exec(value);
    if (dateMatch) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  return value;
};

const replacerForDates = (_: string, value: any): any => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

// --- Interface do Store ---

interface EventStore {
  eventos: Evento[];
  initialized: boolean;
  initializeStore: () => void;
  getEventos: () => Evento[];
  getEventoById: (id: number) => Evento | undefined;
  getEventoBySlug: (slug: string) => Evento | undefined;
  addEvento: (newEvento: Evento) => void;
  updateEvento: (id: number, updatedFields: Partial<Evento>) => void;
  removeEvento: (id: number) => void;
  getFilteredEvents: (filters: EventSearchForm) => Evento[];
  // NOVA FUNÇÃO: Buscar eventos por ID de Atividade
  getEventosByAtividadeId: (atividadeId: number) => Evento[];
}

// --- Criação do Store ---

export const useEventStore = create<EventStore>((set, get) => ({
  eventos: [], // Estado inicial é um array vazio
  initialized: false,

  initializeStore: () => {
    if (!get().initialized) {
      const storedEventos = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedEventos) {
        try {
          const parsedEventos: Evento[] = JSON.parse(
            storedEventos,
            reviveDates
          );
          set({
            eventos: Array.isArray(parsedEventos) ? parsedEventos : [],
            initialized: true,
          });
          console.log(
            "Eventos carregados do localStorage e datas restauradas."
          );
        } catch (e) {
          console.error(
            "Erro ao carregar eventos do localStorage, inicializando com dados padrão:",
            e
          );
          localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(
              Array.isArray(eventData) ? eventData : [],
              replacerForDates
            )
          );
          set({
            eventos: Array.isArray(eventData) ? eventData : [],
            initialized: true,
          });
        }
      } else {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(
            Array.isArray(eventData) ? eventData : [],
            replacerForDates
          )
        );
        set({
          eventos: Array.isArray(eventData) ? eventData : [],
          initialized: true,
        });
        console.log(
          "Eventos inicializados a partir de eventData.ts e salvos no localStorage."
        );
      }
    }
  },

  getEventos: () => {
    get().initializeStore();
    const currentEventos = get().eventos;
    return Array.isArray(currentEventos) ? currentEventos : [];
  },

  getEventoById: (id: number) => {
    get().initializeStore();
    const currentEventos = get().eventos;
    return Array.isArray(currentEventos)
      ? currentEventos.find((evento) => evento.id === id)
      : undefined;
  },

  getEventoBySlug: (slug: string) => {
    get().initializeStore();
    const lowerCaseSlug = slug.toLowerCase();
    const currentEventos = get().eventos;
    return Array.isArray(currentEventos)
      ? currentEventos.find(
          (evento) => evento.slug.toLowerCase() === lowerCaseSlug
        )
      : undefined;
  },

  addEvento: (newEvento: Evento) => {
    get().initializeStore();
    set((state) => {
      const currentEventos = Array.isArray(state.eventos) ? state.eventos : [];
      const currentMaxId =
        currentEventos.length > 0
          ? Math.max(...currentEventos.map((e) => e.id))
          : 0;
      const nextId = currentMaxId + 1;
      const eventoToAdd = { ...newEvento, id: nextId };

      const updatedEventos = [...currentEventos, eventoToAdd];
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedEventos, replacerForDates)
      );
      return { eventos: updatedEventos };
    });
  },

  updateEvento: (id: number, updatedFields: Partial<Evento>) => {
    get().initializeStore();
    set((state) => {
      const currentEventos = Array.isArray(state.eventos) ? state.eventos : [];
      const updatedEventos = currentEventos.map((evento) =>
        evento.id === id ? { ...evento, ...updatedFields } : evento
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedEventos, replacerForDates)
      );
      return { eventos: updatedEventos };
    });
  },

  removeEvento: (id: number) => {
    get().initializeStore();
    set((state) => {
      const currentEventos = Array.isArray(state.eventos) ? state.eventos : [];
      const updatedEventos = currentEventos.filter(
        (evento) => evento.id !== id
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedEventos, replacerForDates)
      );
      return { eventos: updatedEventos };
    });
  },

  getFilteredEvents: (filters: EventSearchForm): Evento[] => {
    get().initializeStore();

    let filteredEvents = [
      ...(Array.isArray(get().eventos) ? get().eventos : []),
    ];

    const selectedCurriculoType: CurriculoTipo =
      filters.curriculoType || "31.02.003";

    if (filters.searchTerm) {
      const lowerCaseSearchTerm = filters.searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          event.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (filters.startDate) {
      const searchStartDate = dayjs(filters.startDate);
      if (searchStartDate.isValid()) {
        filteredEvents = filteredEvents.filter((event) =>
          dayjs(event.startDate).isSameOrAfter(searchStartDate, "day")
        );
      } else {
        console.warn(
          "Data de início inválida fornecida no filtro de evento:",
          filters.startDate
        );
      }
    }

    if (filters.endDate) {
      const searchEndDate = dayjs(filters.endDate);
      if (searchEndDate.isValid()) {
        filteredEvents = filteredEvents.filter((event) =>
          dayjs(event.endDate).isSameOrBefore(searchEndDate, "day")
        );
      } else {
        console.warn(
          "Data de fim inválida fornecida no filtro de evento:",
          filters.endDate
        );
      }
    }

    if (filters.location) {
      const lowerCaseLocation = filters.location.toLowerCase();
      filteredEvents = filteredEvents.filter((event) =>
        event.location.toLowerCase().includes(lowerCaseLocation)
      );
    }

    const minHoursValue = filters.minHours
      ? Number(filters.minHours)
      : -Infinity;
    const maxHoursValue = filters.maxHours
      ? Number(filters.maxHours)
      : Infinity;

    const selectedCategoriesToInclude = new Set(
      filters.categories?.map((cat) => cat.toLowerCase()) || []
    );
    const selectedCategoriesToExclude = new Set(
      filters.excludeCategories?.map((cat) => cat.toLowerCase()) || []
    );

    if (
      selectedCategoriesToInclude.size > 0 ||
      selectedCategoriesToExclude.size > 0 ||
      isFinite(minHoursValue) ||
      isFinite(maxHoursValue)
    ) {
      filteredEvents = filteredEvents.filter((event) => {
        if (!event.activities || event.activities.length === 0) {
          return false;
        }

        const hasMatchingActivity = event.activities.some((activity) => {
          const activityCategoryName = activity.categoria?.nome?.toLowerCase();

          if (!activityCategoryName) {
            return false;
          }

          if (selectedCategoriesToExclude.has(activityCategoryName)) {
            return false;
          }

          if (
            selectedCategoriesToInclude.size > 0 &&
            !selectedCategoriesToInclude.has(activityCategoryName)
          ) {
            return false;
          }

          const calculatedHoursAC =
            activity.duracao *
            (activity.categoria ?
              activity.categoria.coeficienteNovo
              : 1);

          const meetsHoursCriteria =
            calculatedHoursAC >= minHoursValue &&
            calculatedHoursAC <= maxHoursValue;

          return meetsHoursCriteria;
        });

        return hasMatchingActivity;
      });
    }

    return filteredEvents;
  },

  // IMPLEMENTAÇÃO DA NOVA FUNÇÃO getEventosByAtividadeId
  getEventosByAtividadeId: (atividadeId: number): Evento[] => {
    get().initializeStore(); // Garante que o store esteja inicializado
    const currentEventos = get().eventos;
    if (!Array.isArray(currentEventos)) {
      return []; // Retorna um array vazio se eventos não for um array
    }

    // Filtra os eventos, verificando se a lista de atividades do evento
    // contém alguma atividade com o ID fornecido.
    return currentEventos.filter((evento) =>
      evento.activities?.some((activity) => activity.id === atividadeId)
    );
  },
}));