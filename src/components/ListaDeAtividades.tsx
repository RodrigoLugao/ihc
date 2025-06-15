// src/components/ListaAtividades.tsx
import React from 'react';
import dayjs from 'dayjs';
import type { Atividade } from '../interfaces/Atividade';
import { calcularHorasAC } from '../utils/acutils';
import { Link } from 'react-router-dom';

// Renomeado de ListaAtividadesEventoProps para ListaAtividadesProps
interface ListaAtividadesProps {
  activities: Atividade[];
}

// Renomeado de ListaAtividadesEvento para ListaAtividades
const ListaAtividades: React.FC<ListaAtividadesProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="mb-4">
        <h4 className="mb-3 text-dark" style={{ fontWeight: 'bold' }}>Atividades Incluídas</h4>
        <p className="text-muted">Nenhuma atividade listada para este evento.</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4 className="mb-3 text-dark" style={{ fontWeight: 'bold' }}>Atividades Incluídas</h4>
      <div className="list-group">
        {activities.map((activity: Atividade) => (
          <div key={activity.id} className="list-group-item list-group-item-action mb-2 rounded" style={{ backgroundColor: '#e9ecef', borderColor: '#d6d8db' }}>
            <div className="d-flex w-100 justify-content-between mt-3">
              <h5 className="mb-1 text-dark">{activity.nome}</h5>
              {activity.inicio && activity.fim && (
                <small className="text-muted">
                  {dayjs(activity.inicio).format('DD/MM/YYYY HH:mm')} - {dayjs(activity.fim).format('DD/MM/YYYY HH:mm')}
                </small>
              )}
            </div>
            <p className="mb-1 text-secondary">
              <small><b>Descrição:</b> {activity.descricao || 'Sem descrição.'}</small>
            </p>
            <p className="mb-1 text-secondary">
              <small><b>Tipo de Atividade:</b> {activity.categoria?.tipo || 'Não especificado'}</small>
            </p>
            <p className="mb-1 text-secondary">
              <small><b>Responsável:</b> {activity.responsavel || 'Não especificado'}</small>
            </p>
            <p className="mb-1 text-secondary">
              <small><b>Carga Horária Informada:</b> X horas</small>
            </p>
            <p className="mb-1 text-secondary">
              <small><b>Horas AC (Currículo Novo):</b> <span className="badge bg-success">{calcularHorasAC(activity, 'curriculoNovo').toFixed(1)}h</span></small>
            </p>
            <p className="mb-3 text-secondary">
              <small><b>Horas AC (Currículo Antigo):</b> <span className="badge bg-info">{calcularHorasAC(activity, 'curriculoAntigo').toFixed(1)}h</span></small>
            </p>
            <p className="mt-2 d-flex align-items-center gap-3">
              <span className="text-dark">Participou dessa Atividade?</span>
              <Link className='btn btn-outline-success btn-sm' to="/dashboard">Registre no Organizador de Atividades</Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Renomeado o export
export default ListaAtividades;