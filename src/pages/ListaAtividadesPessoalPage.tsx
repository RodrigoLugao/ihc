import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "../context/DashboardContext";
import { useAtividadeStore } from "../store/atividadeStore";
import { useAtividadesConcluidasStore } from "../store/atividadesConcluidasStore";
import type { Atividade } from "../interfaces/Atividade";
import { useMemo, useState } from "react";
import ListaAtividades from "../components/ListaDeAtividades";

// Define a estrutura para as categorias com informações adicionais
interface CategorizedActivityData {
  activities: Atividade[];
  totalHours: number;
  maxHours: number; // Max hours for the category based on curriculum
}

const ListaAtividadesPessoalPage = () => {
  const navigate = useNavigate();
  const { usuario, loading, error } = useDashboardData();

  const getAtividades = useAtividadeStore((state) => state.getAtividades);
  const getAtividadesConcluidasByUserId = useAtividadesConcluidasStore(
    (state) => state.getAtividadesConcluidasByUsuario
  );
  // Assuming useAtividadeStore also has a way to get categories or category details if needed,
  // or we can infer max hours from the Atividade structure itself if it contains category limits.
  // For now, we'll rely on the Atividade's category object.

  const [openAccordionItem, setOpenAccordionItem] = useState<string | null>(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const categorizedActivities = useMemo(() => {
    if (!usuario) return {};

    const allAtividades: Atividade[] = getAtividades();
    const atividadesConcluidasDoUsuario = getAtividadesConcluidasByUserId(
      usuario.id
    );

    const activitiesByCategory: { [categoryName: string]: CategorizedActivityData } = {};

    atividadesConcluidasDoUsuario.forEach((acConcluida) => {
      const atividade = allAtividades.find(
        (atv) => atv.id === acConcluida.idAtividade
      );
      
      if (atividade && atividade.categoria) {
        const categoryName = atividade.categoria.nome;
        const coeficiente = usuario.curriculoNovo ? atividade.categoria.coeficienteNovo : atividade.categoria.coeficienteAntigo;
        const horasAtividade = atividade.duracao * coeficiente;

        if (!activitiesByCategory[categoryName]) {
          activitiesByCategory[categoryName] = {
            activities: [],
            totalHours: 0,
            maxHours: usuario.curriculoNovo ? (atividade.categoria.maximoNovo || Infinity) : (atividade.categoria.maximoAntigo || Infinity),
          };
        }
        activitiesByCategory[categoryName].activities.push(atividade);
        activitiesByCategory[categoryName].totalHours += horasAtividade;
      }
    });

    // Clamp total hours to maxHours for display if needed, or just show the raw total and max
    // For now, let's show the raw total and the max separately.
    return activitiesByCategory;
  }, [usuario, getAtividades, getAtividadesConcluidasByUserId]);

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
            const accordionId = `collapse-${categoryName.replace(/\s+/g, '-')}`;
            const isExpanded = openAccordionItem === accordionId;
            const categoryData = categorizedActivities[categoryName];

            return (
              <div className="accordion-item mb-3" key={categoryName}>
                <h2 className="accordion-header" id={`heading-${accordionId}`}>
                  <button
                    className={`accordion-button ${isExpanded ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => setOpenAccordionItem(isExpanded ? null : accordionId)}
                    aria-expanded={isExpanded}
                    aria-controls={accordionId}
                  >
                    <div className="d-flex flex-column align-items-start">
                      {/* Category Name - Adjusted to h3 equivalent for larger text */}
                      <h3 className="mb-1 text-dark" style={{fontWeight: 'bold'}}>
                        {categoryName}
                      </h3>
                      {/* Activity Count and Hours - Adjusted to small text */}
                      <small className="text-muted">
                        {categoryData.activities.length} Atividade(s) | Horas Registradas:{" "}
                        <span className="badge bg-primary">
                          {categoryData.totalHours.toFixed(1)}h
                        </span>{" "}
                        | Limite da Categoria:{" "}
                        <span className="badge bg-secondary">
                          {categoryData.maxHours === Infinity ? "N/A" : `${categoryData.maxHours.toFixed(1)}h`}
                        </span>
                      </small>
                    </div>
                  </button>
                </h2>
                <div
                  id={accordionId}
                  className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
                  aria-labelledby={`heading-${accordionId}`}
                  data-bs-parent="#activitiesAccordion"
                >
                  <div className="accordion-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <ListaAtividades activities={categoryData.activities} showEdit={true}/>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ListaAtividadesPessoalPage;