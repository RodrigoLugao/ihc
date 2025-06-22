import React from "react";
import dayjs from "dayjs";
import type { Atividade } from "../interfaces/Atividade";
import { useNavigate } from "react-router-dom";
import type { Usuario } from "../interfaces/Usuario";
import { useAtividadesConcluidasStore } from "../store/atividadesConcluidasStore";

interface ListaAtividadesProps {
  activities: Atividade[];
  showEdit?: boolean;
  usuario?: Usuario | null;
  onRemoveActivity?: (atividadeId: number, usuarioId: number) => void;
  // Novo prop: controla a exibição do botão "Registre no Organizador de Atividades"
  showRegisterButton?: boolean;
  // Novo prop: controla a exibição do status "Pendente (nenhum comprovante anexado)"
  showPendingStatus?: boolean;
}

const ListaAtividades: React.FC<ListaAtividadesProps> = ({
  activities,
  showEdit = false,
  usuario = null,
  onRemoveActivity,
  showRegisterButton = false, // Padrão como false
  showPendingStatus = true, // Padrão como true
}) => {
  const navigate = useNavigate();

  const getAtividadeConcluida = useAtividadesConcluidasStore(
    (state) => state.getAtividadeConcluida
  );

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

  // Nova função para lidar com o registro de atividade
  const handleRegisterActivityClick = (activity: Atividade) => {
    navigate("/registrar-atividade", {
      state: {
        prefilledData: {
          nome: activity.nome,
          descricao: activity.descricao,
          inicio: dayjs(activity.inicio).format("YYYY-MM-DDTHH:mm"), // Formata para o tipo de input datetime-local
          fim: activity.fim ? dayjs(activity.fim).format("YYYY-MM-DDTHH:mm") : "", // Formata ou deixa vazio
          responsavel: activity.responsavel,
          duracao: activity.duracao,
          categoriaNome: activity.categoria?.nome || "", // Pega o nome da categoria
          certificado: null, // O certificado será enviado na RegistrarAtividadePage
        },
      },
    });
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

          // A mensagem de pendência agora também depende de showPendingStatus
          const isPending = usuario && !comprovanteNome && showPendingStatus;

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
                      // A mensagem de pendência só é exibida se showPendingStatus for true
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
                  // O botão "Registre no Organizador de Atividades" só é exibido se showRegisterButton for true
                  showRegisterButton && (
                    <>
                      <span className="text-dark">
                        Participou dessa Atividade?
                      </span>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleRegisterActivityClick(activity)} // Usar a nova função
                      >
                        Registre no Organizador de Atividades
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