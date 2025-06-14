// src/pages/EventosPage.tsx
import { useState, useEffect } from 'react'; // Adicionado useEffect
import { Link, useLocation } from 'react-router-dom'; // Adicionado useLocation
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
// Importa o plugin isSameOrBefore e isSameOrAfter para dayjs
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

import { eventData, type Evento } from '../interfaces/Evento';
import type { EventSearchForm } from '../components/FormBuscaEventos'; // Importa a interface do formulário
import FormBuscaEventos from '../components/FormBuscaEventos';
import { calcularHorasAC, type CurriculoTipo } from '../utils/acutils';

dayjs.locale('pt-br');

const EventosPage = () => {
  const [filteredEvents, setFilteredEvents] = useState<Evento[]>(eventData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation(); // Hook para acessar os parâmetros da URL
  // Estado para armazenar os valores iniciais do formulário vindos da URL
  const [initialFormValues, setInitialFormValues] = useState<EventSearchForm | null>(null);

  // Função para parsear os query params da URL para o formato EventSearchForm
  const parseQueryParams = (): EventSearchForm => {
    const queryParams = new URLSearchParams(location.search);
    const data: EventSearchForm = {
      searchTerm: queryParams.get('searchTerm') || '',
      startDate: queryParams.get('startDate') || '',
      endDate: queryParams.get('endDate') || '',
      location: queryParams.get('location') || '',
      minHours: queryParams.get('minHours') ? Number(queryParams.get('minHours')) : '',
      maxHours: queryParams.get('maxHours') ? Number(queryParams.get('maxHours')) : '',
      // categoriesInput recebe a string diretamente do URL
      categoriesInput: queryParams.get('categoriesInput') || '',
      // categories é processado a partir de categoriesInput para uso na lógica de filtro
      categories: [],
      curriculoType: (queryParams.get('curriculoType') as CurriculoTipo) || 'curriculoNovo',
    };

    // Processa a string de categoriesInput para preencher o array categories
    if (data.categoriesInput) {
      data.categories = data.categoriesInput
        .split(',')
        .map(category => category.trim())
        .filter(category => category.length > 0)
        .map(category => category.toLowerCase());
    }

    return data;
  };

  // Efeito para ler os query params e disparar a busca inicial na montagem do componente
  useEffect(() => {
    const params = parseQueryParams();
    // Verifica se algum parâmetro de busca significativo está presente
    const hasAnyParam = Object.values(params).some(value =>
      (typeof value === 'string' && value !== '') ||
      (typeof value === 'number' && !isNaN(value) && value !== Infinity && value !== -Infinity) ||
      (Array.isArray(value) && value.length > 0)
    );

    if (hasAnyParam) {
      setInitialFormValues(params); // Define os valores iniciais para o formulário
      handleSearch(params); // Dispara a busca com os valores da URL
    } else {
      // Se não houver parâmetros, garante que todos os eventos sejam exibidos inicialmente
      setFilteredEvents(eventData);
      setInitialFormValues(null); // Reseta para que o formulário não inicie pré-preenchido
    }
  }, [location.search]); // Dependência em location.search para re-executar se a URL mudar

  // Função para lidar com a busca, recebida do FormBuscaEventos
  const handleSearch = (data: EventSearchForm) => {
    setIsLoading(true); // Ativa o spinner
    console.log("Iniciando busca com dados:", data); // Para depuração

    setTimeout(() => { // Atraso de 1 segundo para simular carregamento
      let tempEvents = eventData;
      // Define o tipo de currículo a ser usado nos cálculos de AC para este filtro
      const selectedCurriculoType: CurriculoTipo = data.curriculoType || 'curriculoNovo';

      console.log("Eventos iniciais (antes dos filtros):", tempEvents.length); // Para depuração

      // 1. Filtrar por termo de busca (nome ou descrição do evento)
      if (data.searchTerm) {
        const lowerCaseSearchTerm = data.searchTerm.toLowerCase();
        tempEvents = tempEvents.filter(event =>
          event.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          event.description.toLowerCase().includes(lowerCaseSearchTerm)
        );
        console.log("Após filtro por termo de busca do evento:", tempEvents.length); // Para depuração
      }

      // 2. Filtrar por data de início do evento
      if (data.startDate) {
        const searchStartDate = dayjs(data.startDate);
        if (searchStartDate.isValid()) {
          tempEvents = tempEvents.filter(event =>
            dayjs(event.startDate).isSameOrAfter(searchStartDate, 'day')
          );
        } else {
          console.warn("Data de início inválida fornecida:", data.startDate);
        }
        console.log("Após filtro por data de início do evento:", tempEvents.length); // Para depuração
      }

      // 3. Filtrar por data de fim do evento
      if (data.endDate) {
        const searchEndDate = dayjs(data.endDate);
        if (searchEndDate.isValid()) {
          tempEvents = tempEvents.filter(event =>
            dayjs(event.endDate).isSameOrBefore(searchEndDate, 'day')
          );
        } else {
          console.warn("Data de fim inválida fornecida:", data.endDate);
        }
        console.log("Após filtro por data de fim do evento:", tempEvents.length); // Para depuração
      }

      // 4. Filtrar por local do evento
      if (data.location) {
        const lowerCaseLocation = data.location.toLowerCase();
        tempEvents = tempEvents.filter(event =>
          event.location.toLowerCase().includes(lowerCaseLocation)
        );
        console.log("Após filtro por local do evento:", tempEvents.length); // Para depuração
      }

      // NOVO: Filtros baseados nas ATIVIDADES DENTRO DO EVENTO
      // Um evento é incluído se TIVER PELA MENOS UMA ATIVIDADE que atenda aos critérios
      const hasMinHours = data.minHours !== undefined && data.minHours !== null && data.minHours !== '';
      const minHoursValue = hasMinHours ? Number(data.minHours) : -Infinity; // Usar -Infinity se não houver mínimo

      const hasMaxHours = data.maxHours !== undefined && data.maxHours !== null && data.maxHours !== '';
      const maxHoursValue = hasMaxHours ? Number(data.maxHours) : Infinity; // Usar Infinity se não houver máximo

      // data.categories já vem processado para minúsculas e como array
      const hasCategories = data.categories && data.categories.length > 0;
      const selectedCategories = hasCategories ? data.categories : [];

      // Aplicar filtros de atividade APENAS SE ALGUM CRITÉRIO DE ATIVIDADE FOI PREENCHIDO
      if (hasMinHours || hasMaxHours || hasCategories) {
        tempEvents = tempEvents.filter(event => {
          // Um evento só é relevante se tiver atividades para verificar
          if (!event.activities || event.activities.length === 0) {
            return false;
          }

          // Verifica se ALGUMA atividade dentro do evento corresponde aos critérios
          return event.activities.some(activity => {
            const activityCategoryType = activity.categoria?.tipo?.toLowerCase();

            if (!activityCategoryType) {
              return false;
            }

            const calculatedHoursAC = calcularHorasAC(activity, selectedCurriculoType);

            const meetsHoursCriteria = calculatedHoursAC >= minHoursValue && calculatedHoursAC <= maxHoursValue;

            // Busca parcial nas categorias
            const meetsCategoryCriteria = selectedCategories.length === 0 ||
              selectedCategories.some(selectedCat => activityCategoryType.includes(selectedCat));

            return meetsHoursCriteria && meetsCategoryCriteria;
          });
        });
        console.log("Após filtro por atividades (horas/categorias):", tempEvents.length); // Para depuração
      }

      setFilteredEvents(tempEvents);
      setIsLoading(false); // Desativa o spinner após o filtro
      console.log("Busca finalizada. Eventos filtrados:", tempEvents.length, tempEvents); // Para depuração
    }, 1000); // 1 segundo de atraso
  };

  // Função para limpar os filtros e exibir todos os eventos
  const handleClearFilters = () => {
    setIsLoading(true); // Ativa o spinner
    console.log("Limpando filtros..."); // Para depuração

    // Limpa os parâmetros da URL, o que irá disparar o useEffect para resetar a página
    window.history.replaceState(null, '', location.pathname); 

    setTimeout(() => { // Atraso de 1 segundo
      setInitialFormValues(null); // Reseta o estado inicial do formulário
      setFilteredEvents(eventData); // Exibe todos os eventos
      setIsLoading(false); // Desativa o spinner
      console.log("Filtros limpos. Eventos totais:", eventData.length); // Para depuração
    }, 1000); // 1 segundo de atraso
  };

  return (
    <div className="background-div-2 text-white py-5">
      <div className="container">
        <h1 className="mb-4" style={{ fontWeight: 'bold' }}>Próximos Eventos</h1>

        <div className="row">
          {/* Coluna do Formulário de Busca */}
          <div className="col-12 col-md-5 mb-4 mb-md-0">
            {/* Passa o initialFormValues para o FormBuscaEventos */}
            <FormBuscaEventos 
                onSearch={handleSearch} 
                onClear={handleClearFilters} 
                initialFormData={initialFormValues} 
            />
          </div>

          {/* Coluna da Lista de Eventos */}
          <div className="col-12 col-md-7">
            <div className="p-4 rounded shadow-sm bg-white">
              <h2 className="mb-4 text-dark" style={{ fontWeight: 'bold' }}>Lista de Eventos</h2>
              {isLoading ? ( // Se isLoading for true, exibe o spinner
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-3 text-dark">Buscando eventos, aguarde...</p>
                </div>
              ) : filteredEvents.length > 0 ? ( // Caso contrário, verifica se há eventos
                <div className="event-list-container">
                  {filteredEvents.map((event) => (
                    <div className="event-item mb-3 p-3 rounded bg-light" key={event.id}>
                      <h5 className="event-title mb-1">
                        <Link
                          className="text-decoration-none nav-custom-link texto-azul-escuro"
                          to={`/eventos/${event.slug}`}
                        >
                          {event.name}
                        </Link>
                        <span className="event-date text-muted fst-italic ms-2">
                          - {dayjs(event.startDate).format('DD/MM/YYYY HH:mm')} até {dayjs(event.endDate).format('DD/MM/YYYY HH:mm')}
                        </span>
                      </h5>
                      <p className="event-description text-dark mb-0">
                        Local: {event.location}
                      </p>
                      <p className="event-description text-dark mt-3 mb-3">
                        {event.description}
                      </p>
                      <Link className='btn btn-outline-success' to={`/eventos/${event.slug}`}>Mais Informações</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark">Nenhum evento encontrado com os filtros aplicados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventosPage;