import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "../context/DashboardContext";
import { useAtividadeStore } from "../store/atividadeStore";
import { useAtividadesConcluidasStore } from "../store/atividadesConcluidasStore";
import type { Atividade } from "../interfaces/Atividade";
import { useMemo, useState, useCallback } from "react";
import ListaAtividades from "../components/ListaDeAtividades";
import { useEventStore } from "../store/eventoStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Define a estrutura para as categorias com informações adicionais
interface CategorizedActivityData {
  activities: Atividade[];
  totalHours: number;
  maxHours: number; // Max hours for the category based on curriculum
  hasPendingActivities: boolean; // Indicador de atividades sem comprovante
}

const ListaAtividadesPessoalPage = () => {
  const navigate = useNavigate();
  const { usuario, loading, error } = useDashboardData();

  const allAtividadesFromStore = useAtividadeStore((state) => state.atividades);
  const removeAtividadeFromStore = useAtividadeStore(
    (state) => state.removeAtividade
  );

  const allAtividadesConcluidasFromStore = useAtividadesConcluidasStore(
    (state) => state.atividadesConcluidas
  );

  const removeAtividadeConcluidaFromStore = useAtividadesConcluidasStore(
    (state) => state.removeAtividadeConcluida
  );

  const getEventosByAtividadeId = useEventStore(
    (state) => state.getEventosByAtividadeId
  );

  const [openAccordionItem, setOpenAccordionItem] = useState<string | null>(
    null
  );

  // Estados para o modal de confirmação de remoção
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activityToRemove, setActivityToRemove] = useState<{
    atividadeId: number;
    usuarioId: number;
    atividadeNome: string; // Adicionado para exibir no modal
  } | null>(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Função para abrir o modal de confirmação
  const confirmRemoval = useCallback(
    (atividadeId: number, usuarioId: number) => {
      // Busca o nome da atividade para exibir no modal
      const atividadeParaRemover = allAtividadesFromStore.find(
        (atv) => atv.id === atividadeId
      );
      const atividadeNome = atividadeParaRemover
        ? atividadeParaRemover.nome
        : "Atividade Desconhecida";

      setActivityToRemove({ atividadeId, usuarioId, atividadeNome });
      setShowConfirmModal(true);
    },
    [allAtividadesFromStore]
  );

  // Função para fechar o modal
  const handleCloseConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
    setActivityToRemove(null); // Limpa os dados da atividade a ser removida
  }, []);

  // Lógica principal de remoção após a confirmação
  const handleRemoveActivityConfirmed = useCallback(() => {
    if (activityToRemove && usuario) {
      const { atividadeId, usuarioId } = activityToRemove;

      // 1. Remover do atividadesConcluidasStore SEMPRE
      removeAtividadeConcluidaFromStore(atividadeId, usuarioId);
      console.log(
        `Atividade Concluída (Atividade ID: ${atividadeId}, Usuário ID: ${usuarioId}) removida do atividadesConcluidasStore.`
      );

      // 2. Verificar se a atividade faz parte de algum evento ANTES de tentar remover do atividadeStore
      const eventosAssociados = getEventosByAtividadeId(atividadeId);
      if (eventosAssociados.length === 0) {
        // Se não houver eventos associados, remove do atividadeStore
        removeAtividadeFromStore(atividadeId);
        console.log(
          `Atividade (ID: ${atividadeId}) NÃO removida do atividadeStore porque não está associada a nenhum evento.`
        );
      } else {
        console.log(
          `Atividade (ID: ${atividadeId}) NÃO removida do atividadeStore porque está associada a ${eventosAssociados.length} evento(s).`
        );
      }
    }
    handleCloseConfirmModal(); // Fecha o modal após a tentativa de remoção
  }, [
    activityToRemove,
    usuario,
    removeAtividadeConcluidaFromStore,
    removeAtividadeFromStore,
    getEventosByAtividadeId,
    handleCloseConfirmModal,
  ]);

  const categorizedActivities = useMemo(() => {
    if (!usuario) return {};

    const allAtividades: Atividade[] = allAtividadesFromStore;
    const atividadesConcluidasDoUsuario =
      allAtividadesConcluidasFromStore.filter(
        (ac) => ac.idUsuario === usuario.id
      );

    const activitiesByCategory: {
      [categoryName: string]: CategorizedActivityData;
    } = {};

    atividadesConcluidasDoUsuario.forEach((acConcluida) => {
      const atividade = allAtividades.find(
        (atv) => atv.id === acConcluida.idAtividade
      );

      if (atividade && atividade.categoria) {
        const categoryName = atividade.categoria.nome;
        const coeficiente = usuario.curriculoNovo
          ? atividade.categoria.coeficienteNovo
          : atividade.categoria.coeficienteAntigo;
        const horasAtividade = atividade.duracao * coeficiente;

        // Inicializa a categoria se ainda não existir
        if (!activitiesByCategory[categoryName]) {
          activitiesByCategory[categoryName] = {
            activities: [],
            totalHours: 0,
            maxHours: usuario.curriculoNovo
              ? atividade.categoria.maximoNovo || Infinity
              : atividade.categoria.maximoAntigo || Infinity,
            hasPendingActivities: false, // Inicializa como false
          };
        }

        // Adiciona a atividade à lista se ainda não estiver presente nesta categoria.
        // É importante que 'activities' contenha as atividades únicas que contribuíram para a categoria.
        const existingActivityInList = activitiesByCategory[
          categoryName
        ].activities.find((a) => a.id === atividade.id);
        if (!existingActivityInList) {
          activitiesByCategory[categoryName].activities.push(atividade);
        }

        // Atualiza o total de horas da categoria
        activitiesByCategory[categoryName].totalHours += horasAtividade;

        // Verifica se a atividade atual (do loop acConcluida) é "pendente"
        // E atualiza a flag da categoria se for o caso
        if (!acConcluida.comprovante) {
          activitiesByCategory[categoryName].hasPendingActivities = true;
        }
      }
    });

    return activitiesByCategory;
  }, [usuario, allAtividadesFromStore, allAtividadesConcluidasFromStore]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-light mt-2">Carregando suas atividades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Erro: {error}
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="alert alert-info" role="alert">
        Por favor, faça login para ver suas atividades.
      </div>
    );
  }

  const hasActivities = Object.keys(categorizedActivities).length > 0;

  // Componente Modal de Confirmação (adaptado do seu RegistrarAtividadePage)
  const ConfirmationModal: React.FC<{
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    atividadeNome: string | undefined; // Para exibir o nome da atividade no modal
  }> = ({ show, onClose, onConfirm, atividadeNome }) => {
    if (!show) return null;

    return (
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar Remoção de Atividade</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Você deseja realmente remover a seguinte atividade:</p>
              <p>
                <strong>{atividadeNome || "Atividade Desconhecida"}</strong>?
              </p>
              <p className="text-danger small">
                **Atenção:** Esta ação removerá a atividade do seu registro
                pessoal. Se esta atividade não estiver associada a nenhum evento
                em nosso sistema, ela será completamente removida da base de
                dados de atividades.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger" // Usar btn-danger para a ação de remoção
                onClick={onConfirm}
              >
                Remover Permanentemente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Lista de Atividades Complementares Registradas</h1>
        <button onClick={handleGoBack} className="btn btn-outline-light btn-sm">
          <span className="d-none d-md-block">Voltar</span>
          <span className="d-block d-md-none">
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
        </button>
      </div>
      <hr className="my-4" />

      {!hasActivities && (
        <div className="alert alert-info text-center" role="alert">
          Você ainda não registrou nenhuma atividade complementar.
        </div>
      )}

      <div className="accordion" id="activitiesAccordion">
        {Object.keys(categorizedActivities)
          .sort()
          .map((categoryName) => {
            const accordionId = `collapse-${categoryName.replace(/\s+/g, "-")}`;
            const isExpanded = openAccordionItem === accordionId;
            const categoryData = categorizedActivities[categoryName];

            return (
              <div className="accordion-item mb-3" key={categoryName}>
                <h2 className="accordion-header" id={`heading-${accordionId}`}>
                  <button
                    className={`accordion-button ${
                      isExpanded ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() =>
                      setOpenAccordionItem(isExpanded ? null : accordionId)
                    }
                    aria-expanded={isExpanded}
                    aria-controls={accordionId}
                  >
                    {/* Header do Acordeão: Apenas nome da categoria e badge de horas */}
                    <div className="d-flex align-items-center">
                      <h3
                        className="mb-0 me-2 text-dark"
                        style={{ fontWeight: "bold" }}
                      >
                        {categoryName}
                      </h3>
                      {/* Badge de Horas Concluídas */}
                      <span className="badge bg-primary text-white">
                        {categoryData.totalHours.toFixed(1)}h
                      </span>
                      {/* Indicador de atividade pendente (opcional, mantido aqui para feedback rápido) */}
                      {categoryData.hasPendingActivities && (
                        <span className="badge bg-warning text-dark ms-2">
                          Pendente
                        </span>
                      )}
                    </div>
                  </button>
                </h2>
                <div
                  id={accordionId}
                  className={`accordion-collapse collapse ${
                    isExpanded ? "show" : ""
                  }`}
                  aria-labelledby={`heading-${accordionId}`}
                  data-bs-parent="#activitiesAccordion"
                >
                  <div
                    className="accordion-body bg-light"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    {/* Informações detalhadas da categoria dentro do corpo */}
                    <div className="mb-3 p-3 bg-white rounded shadow-sm">
                      <p className="mb-1">
                        Atividades incluídas:{" "}
                        <span className="badge bg-info">
                          {" "}
                          {/* Usando bg-info para essa badge */}
                          {categoryData.activities.length}
                        </span>
                      </p>
                      <p className="mb-1">
                        Horas Registradas:{" "}
                        <span className="badge bg-primary">
                          {categoryData.totalHours.toFixed(1)}h
                        </span>
                      </p>
                      <p className="mb-0">
                        Limite de horas da Categoria:{" "}
                        <span className="badge bg-secondary">
                          {categoryData.maxHours === Infinity
                            ? "N/A"
                            : `${categoryData.maxHours.toFixed(1)}h`}
                        </span>
                      </p>
                    </div>

                    <ListaAtividades
                      activities={categoryData.activities}
                      showEdit={true}
                      usuario={usuario}
                      onRemoveActivity={confirmRemoval}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Renderização do Modal de Confirmação de Remoção personalizado */}
      <ConfirmationModal
        show={showConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleRemoveActivityConfirmed}
        atividadeNome={activityToRemove?.atividadeNome} // Passa o nome para o modal
      />
    </>
  );
};

export default ListaAtividadesPessoalPage;
