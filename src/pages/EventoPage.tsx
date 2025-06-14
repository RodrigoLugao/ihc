// src/pages/EventoSoloPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
// Removido import de Atividade, pois ListaAtividadesEvento já cuida disso
// Removido import de calcularHorasAC, pois ListaAtividadesEvento já cuida disso
import { eventData } from '../interfaces/Evento'; // Importa Evento
import ListaAtividades from '../components/ListaDeAtividades';

dayjs.locale('pt-br');

const EventoSoloPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const event = eventData.find(e => e.slug === slug);

  if (!event) {
    return (
      <div className="background-div text-white py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <div className="container text-center">
          <h1 className="mb-4" style={{ fontWeight: 'bold' }}>Evento Não Encontrado</h1>
          <p className="lead">Desculpe, o evento que você está procurando não existe ou o link está incorreto.</p>
          <Link to="/eventos" className="btn btn-primary mt-3">Voltar para a lista de Eventos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="background-div text-white py-5">
      <div className="container">
        {/* Fundo claro para o box de detalhes do evento */}
        <div className="p-4 rounded shadow-sm bg-light text-dark">
          <h1 className="mb-4" style={{ fontWeight: 'bold'}}>{event.name}</h1>
          <p className="lead opacity-75">{event.description}</p>
          
          <div className="mb-4">
            <h4 className="mb-2" style={{ fontWeight: 'bold'}}>Detalhes do Evento</h4>
            <p className="mb-1">
              <strong>Local:</strong> {event.location}
            </p>
            <p className="mb-1">
              <strong>Início:</strong> {dayjs(event.startDate).format('DD/MM/YYYY HH:mm')}
            </p>
            <p className=" mb-1">
              <strong>Fim:</strong> {dayjs(event.endDate).format('DD/MM/YYYY HH:mm')}
            </p>
            {/* Usar event.link se existir, caso contrário exibir "Não disponível" */}
            <p className="mb-1">
              <strong>Link:</strong> <a href={"https://google.com"} target="_blank" rel="noopener noreferrer" className="text-info">Google</a>
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

          <Link to="/eventos" className="btn btn-outline-success mt-3">Voltar para a lista de Eventos</Link>
        </div>
      </div>
    </div>
  );
};

export default EventoSoloPage;