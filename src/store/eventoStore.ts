// src/store/eventStore.ts
import { create } from 'zustand';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

import { eventData, type Evento } from '../interfaces/Evento';
import type { EventSearchForm } from '../components/FormBuscaEventos';
import type { CurriculoTipo } from '../utils/acutils';

// Chave para o localStorage
const LOCAL_STORAGE_KEY = 'eventStore';

// --- Funções Auxiliares de Serialização/Desserialização para localStorage ---

const reviveDates = (key: string, value: any): any => {
  if (typeof value === 'string') {
    const dateMatch = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.exec(value);
    if (dateMatch) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  return value;
};

const replacerForDates = (key: string, value: any): any => {
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
}

// --- Criação do Store ---

export const useEventStore = create<EventStore>((set, get) => ({
  eventos: [],
  initialized: false,

  initializeStore: () => {
    if (!get().initialized) {
      const storedEventos = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedEventos) {
        try {
          const parsedEventos: Evento[] = JSON.parse(storedEventos, reviveDates);
          set({ eventos: parsedEventos, initialized: true });
          console.log('Eventos carregados do localStorage e datas restauradas.');
        } catch (e) {
          console.error("Erro ao carregar eventos do localStorage, inicializando com dados padrão:", e);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(eventData, replacerForDates));
          set({ eventos: eventData, initialized: true });
        }
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(eventData, replacerForDates));
        set({ eventos: eventData, initialized: true });
        console.log('Eventos inicializados a partir de eventData.ts e salvos no localStorage.');
      }
    }
  },

  getEventos: () => {
    get().initializeStore();
    return get().eventos;
  },

  getEventoById: (id: number) => {
    get().initializeStore();
    return get().eventos.find(evento => evento.id === id);
  },

  getEventoBySlug: (slug: string) => {
    get().initializeStore();
    const lowerCaseSlug = slug.toLowerCase();
    return get().eventos.find(evento => evento.slug.toLowerCase() === lowerCaseSlug);
  },

  addEvento: (newEvento: Evento) => {
    get().initializeStore();
    set((state) => {
      const currentMaxId = state.eventos.length > 0 ? Math.max(...state.eventos.map(e => e.id)) : 0;
      const nextId = currentMaxId + 1;
      const eventoToAdd = { ...newEvento, id: nextId };

      const updatedEventos = [...state.eventos, eventoToAdd];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEventos, replacerForDates));
      return { eventos: updatedEventos };
    });
  },

  updateEvento: (id: number, updatedFields: Partial<Evento>) => {
    get().initializeStore();
    set((state) => {
      const updatedEventos = state.eventos.map((evento) =>
        evento.id === id ? { ...evento, ...updatedFields } : evento
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEventos, replacerForDates));
      return { eventos: updatedEventos };
    });
  },

  removeEvento: (id: number) => {
    get().initializeStore();
    set((state) => {
      const updatedEventos = state.eventos.filter(
        (evento) => evento.id !== id
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEventos, replacerForDates));
      return { eventos: updatedEventos };
    });
  },

  // --- MÉTODO getFilteredEvents OTIMIZADO ---
  getFilteredEvents: (filters: EventSearchForm): Evento[] => {
    get().initializeStore(); // Garante que os dados estejam carregados

    let filteredEvents = [...get().eventos]; // Começa com todos os eventos do store

    const selectedCurriculoType: CurriculoTipo = filters.curriculoType || "curriculoNovo";

    // 1. Filtrar por termo de busca (nome ou descrição do evento)
    if (filters.searchTerm) {
      const lowerCaseSearchTerm = filters.searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          event.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // 2. Filtrar por data de início do evento
    if (filters.startDate) {
      const searchStartDate = dayjs(filters.startDate);
      if (searchStartDate.isValid()) {
        filteredEvents = filteredEvents.filter((event) =>
          dayjs(event.startDate).isSameOrAfter(searchStartDate, "day")
        );
      } else {
        console.warn("Data de início inválida fornecida no filtro de evento:", filters.startDate);
      }
    }

    // 3. Filtrar por data de fim do evento
    if (filters.endDate) {
      const searchEndDate = dayjs(filters.endDate);
      if (searchEndDate.isValid()) {
        filteredEvents = filteredEvents.filter((event) =>
          dayjs(event.endDate).isSameOrBefore(searchEndDate, "day")
        );
      } else {
        console.warn("Data de fim inválida fornecida no filtro de evento:", filters.endDate);
      }
    }

    // 4. Filtrar por local do evento
    if (filters.location) {
      const lowerCaseLocation = filters.location.toLowerCase();
      filteredEvents = filteredEvents.filter((event) =>
        event.location.toLowerCase().includes(lowerCaseLocation)
      );
    }

    // Validar e padronizar valores de horas
    const minHoursValue = filters.minHours ? Number(filters.minHours) : -Infinity;
    const maxHoursValue = filters.maxHours ? Number(filters.maxHours) : Infinity;

    // Padronizar categorias para minúsculas e usar Sets para busca eficiente
    const selectedCategoriesToInclude = new Set(
      filters.categories?.map(cat => cat.toLowerCase()) || []
    );
    const selectedCategoriesToExclude = new Set(
      filters.excludeCategories?.map(cat => cat.toLowerCase()) || []
    );

    // 5. Filtrar por atividades dentro dos eventos (categorias e horas)
    if (selectedCategoriesToInclude.size > 0 || selectedCategoriesToExclude.size > 0 || isFinite(minHoursValue) || isFinite(maxHoursValue)) {
      filteredEvents = filteredEvents.filter((event) => {
        // Se o evento não tem atividades, ele não pode satisfazer filtros de atividade
        if (!event.activities || event.activities.length === 0) {
          return false;
        }

        // Verifica se QUALQUER atividade do evento se encaixa nos critérios
        const hasMatchingActivity = event.activities.some((activity) => {
          const activityCategoryName = activity.categoria?.nome?.toLowerCase();

          // Se a atividade não tem categoria, não pode ser filtrada por categoria
          if (!activityCategoryName) {
            return false;
          }

          // **Verificação de Exclusão (primeiro, para otimização)**
          // Se a categoria da atividade está na lista de exclusão, esta atividade não conta.
          if (selectedCategoriesToExclude.has(activityCategoryName)) {
            return false; // Esta atividade é excluída
          }

          // **Verificação de Inclusão**
          // Se há categorias para incluir e esta atividade não está em nenhuma delas, ela não conta.
          if (selectedCategoriesToInclude.size > 0 && !selectedCategoriesToInclude.has(activityCategoryName)) {
            return false; // Esta atividade não está nas categorias desejadas
          }

          // **Cálculo de Horas da Atividade para o currículo selecionado**
          const calculatedHoursAC = activity.duracao *
            (activity.categoria
              ? selectedCurriculoType === "curriculoNovo"
                ? activity.categoria.coeficienteNovo
                : activity.categoria.coeficienteAntigo
              : 1); // Fallback para 1 se categoria for indefinida

          // **Verificação de Horas**
          const meetsHoursCriteria =
            calculatedHoursAC >= minHoursValue &&
            calculatedHoursAC <= maxHoursValue;

          return meetsHoursCriteria; // Se passou por todas as verificações, esta atividade é um 'match'
        });

        // O evento é incluído se pelo menos uma de suas atividades corresponde aos critérios
        return hasMatchingActivity;
      });
    }

    return filteredEvents; // Retorna os eventos filtrados
  },
}));