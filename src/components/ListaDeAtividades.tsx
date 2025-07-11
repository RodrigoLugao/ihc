import React, { useEffect } from "react"; // Importe useEffect
import dayjs from "dayjs";
import type { Atividade } from "../interfaces/Atividade";
import { useNavigate } from "react-router-dom";
import type { Usuario } from "../interfaces/Usuario";
import { useAtividadesConcluidasStore } from "../store/atividadesConcluidasStore";

// Se você não tiver o Bootstrap JS inicializado globalmente,
// pode precisar de algo assim para inicializar tooltips:
declare const bootstrap: any; // Declaração para evitar erro de tipo se 'bootstrap' não for reconhecido

interface ListaAtividadesProps {
  activities: Atividade[];
  showEdit?: boolean;
  usuario?: Usuario | null;
  onRemoveActivity?: (atividadeId: number, usuarioId: number) => void;
  showRegisterButton?: boolean;
  showPendingStatus?: boolean;
}

const ListaAtividades: React.FC<ListaAtividadesProps> = ({
  activities,
  showEdit = false,
  usuario = null,
  onRemoveActivity,
  showRegisterButton = false,
  showPendingStatus = true,
}) => {
  const navigate = useNavigate();

  const getAtividadeConcluida = useAtividadesConcluidasStore(
    (state) => state.getAtividadeConcluida
  );

  // Inicializa os tooltips do Bootstrap quando o componente é montado
  useEffect(() => {
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map(function (tooltipTriggerEl: Element) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      })
    }
  }, [activities, showRegisterButton]); // Re-inicializa se as atividades ou o botão de registro mudarem

  const handleEditClick = (activity: Atividade) => {
    if (usuario) {
      const atividadeConcluidaDoUsuario = getAtividadeConcluida(
        activity.id,
        usuario.id
      );
      if (atividadeConcluidaDoUsuario) {
        navigate("/editar-atividade", {
          state: {
            atividade: activity,
            atividadeConcluida: atividadeConcluidaDoUsuario,
          },
        });
      } else {
        alert(
          "Erro: Não foi possível encontrar os dados de conclusão para esta atividade."
        );
      }
    } else {
      alert("Erro: Usuário não logado para editar a atividade.");
    }
  };

  const handleRegisterActivityClick = (activity: Atividade) => {
    const hasStarted = dayjs().isAfter(dayjs(activity.inicio));

    if (hasStarted) {
      navigate("/registrar-atividade", {
        state: {
          prefilledData: {
            nome: activity.nome,
            descricao: activity.descricao,
            inicio: dayjs(activity.inicio).format("YYYY-MM-DDTHH:mm"),
            fim: activity.fim
              ? dayjs(activity.fim).format("YYYY-MM-DDTHH:mm")
              : "",
            responsavel: activity.responsavel,
            duracao: activity.duracao,
            categoriaNome: activity.categoria?.nome || "",
            certificado: null,
          },
        },
      });
    } else {
      navigate("/planejar-atividade", {
        state: {
          prefilledData: {
            nome: activity.nome,
            descricao: activity.descricao,
            inicio: dayjs(activity.inicio).format("YYYY-MM-DDTHH:mm"),
            fim: activity.fim
              ? dayjs(activity.fim).format("YYYY-MM-DDTHH:mm")
              : "",
            responsavel: activity.responsavel,
            duracao: activity.duracao,
            categoriaNome: activity.categoria?.nome || "",
          },
        },
      });
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="mb-4">
        <h4 className="mb-3 text-dark" style={{ fontWeight: "bold" }}>
          Atividades Incluídas
        </h4>
        <p className="text-muted">Nenhuma atividade listada para este evento.</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4 className="mb-3 text-dark" style={{ fontWeight: "bold" }}>
        Atividades Incluídas
      </h4>
      <div className="list-group">
        {activities.map((activity: Atividade) => {
          const atividadeConcluidaDoUsuario =
            usuario && getAtividadeConcluida(activity.id, usuario.id);

          const comprovanteNome = atividadeConcluidaDoUsuario
            ? atividadeConcluidaDoUsuario.comprovante
              ? atividadeConcluidaDoUsuario.comprovante.split("/").pop()
              : null
            : null;

          const isPending = usuario && !comprovanteNome && showPendingStatus;

          const hasActivityStarted = dayjs().isAfter(dayjs(activity.inicio));

          // Texto do tooltip dinâmico
          const tooltipText = hasActivityStarted
            ? "Clique para registrar a sua participação e anexar comprovantes."
            : "Clique para adicionar esta atividade ao organizador e simular as horas de AC.";

          return (
            <div
              key={activity.id}
              className="list-group-item list-group-item-action mb-2 rounded"
              style={{
                backgroundColor: "#e9ecef",
                borderColor: "#d6d8db",
                borderLeft: isPending ? "5px solid orange" : "",
              }}
            >
              <div className="d-flex w-100 justify-content-between mt-3">
                <h5 className="mb-1 text-dark">{activity.nome}</h5>
                {activity.inicio && activity.fim && (
                  <small className="text-muted">
                    {dayjs(activity.inicio).format("DD/MM/YYYY HH:mm")} -{" "}
                    {dayjs(activity.fim).format("DD/MM/YYYY HH:mm")}
                  </small>
                )}
              </div>
              <p className="mb-1 text-secondary">
                <small>
                  <b>Descrição:</b> {activity.descricao || "Sem descrição."}
                </small>
              </p>
              <p className="mb-1 text-secondary">
                <small>
                  <b>Categoria de Atividade:</b>{" "}
                  {activity.categoria?.nome || "Não especificado"}
                </small>
              </p>
              <p className="mb-1 text-secondary">
                <small>
                  <b>Responsável:</b> {activity.responsavel || "Não especificado"}
                </small>
              </p>
              <p className="mb-1 text-secondary">
                <small>
                  <b>Duração da atividade:</b>
                  {activity.duracao} {activity.categoria?.unidadeDeTempo}
                </small>
              </p>

              {usuario && (
                <p className="mb-1">
                  <small>
                    <b>Comprovante:</b>{" "}
                    {comprovanteNome ? (
                      <span className="text-success">{comprovanteNome}</span>
                    ) : (
                      showPendingStatus && (
                        <span className="text-warning">
                          Pendente (nenhum comprovante anexado)
                        </span>
                      )
                    )}
                  </small>
                </p>
              )}

              <p className="mb-1 text-secondary">
                <small>
                  <b>Horas AC:</b>{" "}
                  <span className="badge bg-success">
                    {(
                      activity.duracao *
                      (activity.categoria ? activity.categoria.coeficienteNovo : 1)
                    ).toFixed(1)}{" "}
                    h
                  </span>
                </small>
              </p>
              <p className="mt-2 d-flex align-items-center gap-3">
                {showEdit ? (
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleEditClick(activity)}
                  >
                    Editar Atividade
                  </button>
                ) : (
                  showRegisterButton && (
                    <>
                      <span className="text-dark">
                        {hasActivityStarted
                          ? "Participou dessa Atividade?"
                          : "Essa atividade ainda não começou, mas você pode adicionar ela no organizador."}
                      </span>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleRegisterActivityClick(activity)}
                        data-bs-toggle="tooltip" // Adicione este atributo
                        data-bs-placement="top" // Onde o tooltip aparece (top, bottom, left, right)
                        title={tooltipText} // O texto do tooltip
                      >
                        {hasActivityStarted
                          ? "Registre no Organizador de Atividades"
                          : "Adicionar para Planejamento/Simulação"}
                      </button>
                    </>
                  )
                )}

                {usuario && onRemoveActivity && atividadeConcluidaDoUsuario && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() =>
                      onRemoveActivity(activity.id, usuario.id)
                    }
                  >
                    Remover do Meu Registro
                  </button>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListaAtividades;