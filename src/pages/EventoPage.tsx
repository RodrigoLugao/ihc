import React, { useEffect } from "react"; // Adicionado useEffect
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"; // Adicionado useLocation
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
// Removida a importação direta de eventData, pois o store cuidará disso
// import { eventData } from "../interfaces/Evento";
import ListaAtividades from "../components/ListaDeAtividades";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEventStore } from "../store/eventoStore";

dayjs.locale("pt-br");

const EventoSoloPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para obter a localização atual
  const { slug } = useParams<{ slug: string }>();

  // Acessar o estado e as ações do store
  const initializeStore = useEventStore((state) => state.initializeStore);
  const getEventoBySlug = useEventStore((state) => state.getEventoBySlug);
  const eventos = useEventStore((state) => state.getEventos()); // Para verificar se já tem eventos carregados

  // Dispara a inicialização do store quando o componente monta
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Obter o evento usando a função do store.
  // Será reavaliado se 'eventos' mudar (após a inicialização, por exemplo)
  const event = getEventoBySlug(slug || ""); // Passa uma string vazia se slug for undefined

  const handleVoltar = () => {
    navigate(-1); // Volta uma página na história
  };

  // Verifica se o store está carregando ou se o evento não foi encontrado após a inicialização
  // No seu `eventStore.ts`, não temos estados `loading` ou `error` explicitamente no `create`,
  // mas `initializeStore` já lida com o carregamento inicial.
  // Se você adicionar `loading` e `error` ao `eventStore`, este bloco precisaria ser ajustado.
  // Por enquanto, baseamos o "carregamento" na presença de eventos após a inicialização.
  if (!useEventStore.getState().initialized || eventos.length === 0) {
    // Basicamente, se o store ainda não foi inicializado ou não tem eventos, assumimos que está "carregando" os dados iniciais
    return (
      <div className="text-white text-center py-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3">Carregando detalhes do evento...</p>
      </div>
    );
  }

  // Se o store está inicializado mas o evento não foi encontrado
  if (!event) {
    return (
      <div
        className="background-div text-white py-5 d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="container text-center">
          <h1 className="mb-4" style={{ fontWeight: "bold" }}>
            Evento Não Encontrado
          </h1>
          <p className="lead">
            Desculpe, o evento que você está procurando não existe ou o link
            está incorreto.
          </p>
          <Link to="/eventos" className="btn btn-primary mt-3">
            Voltar para a lista de Eventos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="background-div text-white py-5">
      <div className="container">
        {/* Fundo claro para o box de detalhes do evento */}
        <div className="p-4 rounded shadow-sm bg-light text-dark position-relative">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0" style={{ fontWeight: "bold" }}>
              {event.name}
            </h1>
            <button
              onClick={handleVoltar}
              className="btn btn-custom-navy-white mt-3"
            >
              <span className="d-none d-md-block">
                Voltar para a lista de Eventos
              </span>
              <span className="d-block d-md-none">
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
            </button>
          </div>

          <p className="lead opacity-75">{event.description}</p>

          <div className="mb-4">
            <h4 className="mb-2" style={{ fontWeight: "bold" }}>
              Detalhes do Evento
            </h4>
            <p className="mb-1">
              <strong>Local:</strong> {event.location}
            </p>
            <p className="mb-1">
              <strong>Início:</strong>{" "}
              {dayjs(event.startDate).format("DD/MM/YYYY HH:mm")}
            </p>
            <p className=" mb-1">
              <strong>Fim:</strong>{" "}
              {dayjs(event.endDate).format("DD/MM/YYYY HH:mm")}
            </p>
            {/* Usar event.link se existir, caso contrário exibir "Não disponível" */}
            <p className="mb-1">
              <strong>Link:</strong> <Link to={"/secret"}>Evento</Link>
            </p>
            {/* Usar event.contact se existir, caso contrário exibir "Não especificado" */}
            <p className="mb-1">
              <strong>Contato:</strong> Contato
            </p>
            {/* Usar event.organizer se existir, caso contrário exibir "Não especificado" */}
            <p className="mb-1">
              <strong>Organizador:</strong> Organizador
            </p>
          </div>

          {/* Renderiza o novo componente ListaAtividadesEvento se houver atividades */}
          {event.activities && event.activities.length > 0 && (
            <ListaAtividades activities={event.activities} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventoSoloPage;
