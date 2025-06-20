import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActivityForm, {
  type ActivityFormInputs,
} from "../components/ActivityForm";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCategoriaStore } from "../store/categoriaStore";
import { useUserStore } from "../store/userStore";
import { useAtividadeStore } from "../store/atividadeStore";
import { useAtividadesConcluidasStore } from "../store/atividadesConcluidasStore";
import type { AtividadeConcluida } from "../interfaces/AtivdadeConcluida";
import type { Atividade } from "../interfaces/Atividade"; // Importar a interface de Atividade

// Interface para os dados do modal de confirmação
interface ConfirmationModalData {
  atividade: ActivityFormInputs;
  categoriaNome: string;
  certificadoFileName: string | undefined;
}

const RegistrarAtividadePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledData = location.state?.prefilledData as
    | ActivityFormInputs
    | undefined;

  // Usa useForm para gerenciar o estado do formulário e o método reset
  const methods = useForm<ActivityFormInputs>({
    defaultValues: prefilledData, // Define os valores padrão iniciais
  });

  const { reset } = methods; // Obtém o método reset de methods

  const { getCategoriaByName } = useCategoriaStore();
  const currentUser = useUserStore((state) => state.user);
  const addAtividade = useAtividadeStore((state) => state.addAtividade);
  const addAtividadeConcluida = useAtividadesConcluidasStore(
    (state) => state.addAtividadeConcluida
  );

  // Estados para o modal de confirmação
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState<
    ConfirmationModalData | undefined
  >(undefined);

  useEffect(() => {
    // Quando prefilledData muda (por exemplo, ao navegar com dados), reseta o formulário
    if (prefilledData) {
      reset(prefilledData);
    } else {
      // Se não houver prefilledData, reseta para um estado vazio
      reset({
        nome: "",
        descricao: "",
        inicio: "",
        fim: "",
        responsavel: "",
        duracao: 0,
        categoriaNome: "",
        certificado: null,
      });
    }
  }, [prefilledData, reset]);

  const onSubmit: SubmitHandler<ActivityFormInputs> = (data) => {
    const selectedCategory = getCategoriaByName(data.categoriaNome);

    if (!selectedCategory) {
      alert(
        "Erro interno: Categoria não encontrada no store. Por favor, selecione uma categoria válida."
      );
      return;
    }

    const certificadoFileName =
      data.certificado && data.certificado.length > 0
        ? data.certificado[0].name
        : undefined;

    setConfirmationData({
      atividade: data,
      categoriaNome: selectedCategory.nome,
      certificadoFileName: certificadoFileName,
    });
    setShowConfirmationModal(true);
  };

  const handleConfirmRegistration = () => {
    if (!confirmationData || !currentUser) {
      alert(
        "Erro: Dados de confirmação ausentes ou usuário não logado. Tente novamente."
      );
      setShowConfirmationModal(false);
      return;
    }

    const { atividade: formData, categoriaNome } = confirmationData;
    const selectedCategory = getCategoriaByName(categoriaNome);

    if (!selectedCategory) {
      alert(
        "Erro interno: Categoria não encontrada durante a confirmação. Por favor, selecione uma categoria válida."
      );
      setShowConfirmationModal(false);
      return;
    }

    // 1. Preparar os dados da atividade para o store de atividades.
    const atividadeSemId: Omit<Atividade, "id"> = {
      nome: formData.nome,
      descricao: formData.descricao,
      // Garante que as datas sejam criadas como objetos Date
      inicio: new Date(formData.inicio),
      fim: formData.fim ? new Date(formData.fim) : undefined,
      responsavel: formData.responsavel,
      categoria: selectedCategory,
      duracao: formData.duracao,
    };

    // 2. Adicionar a Atividade no store de atividades e CAPTURAR a atividade com o ID gerado
    const atividadeAdicionada = addAtividade(atividadeSemId); // This call is now correctly typed

    // 3. Adicionar a Atividade Concluída ao store de atividades concluídas, usando o ID REAL da atividade
    const novaAtividadeConcluida: AtividadeConcluida = {
      idAtividade: atividadeAdicionada.id, // Uses the ID returned by addAtividade
      idUsuario: currentUser.id,
      comprovante: confirmationData.certificadoFileName
        ? `/uploads/${confirmationData.certificadoFileName}`
        : undefined,
    };

    addAtividadeConcluida(novaAtividadeConcluida);

    console.log("Atividade registrada e dados salvos nos stores!");
    alert("Atividade registrada com sucesso!");

    setShowConfirmationModal(false);
    handleClear();
    navigate("/dashboard"); // <-- REDIRECIONAMENTO ADICIONADO AQUI
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
    setConfirmationData(undefined);
  };

  const handleClear = () => {
    console.log("Formulário limpo pela página pai (RegistrarAtividadePage)");
    reset({
      nome: "",
      descricao: "",
      inicio: "",
      fim: "",
      responsavel: "",
      duracao: 0,
      categoriaNome: "",
      certificado: null,
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const ConfirmationModal: React.FC<{
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: ConfirmationModalData;
  }> = ({ show, onClose, onConfirm, data }) => {
    if (!show || !data) return null;

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
              <h5 className="modal-title">Confirmar Registro de Atividade</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Você deseja realmente registrar a seguinte atividade para o
                usuário{" "}
                <strong>{currentUser?.nome || "Não logado"}</strong>?
              </p>
              <ul className="list-group mb-3">
                <li className="list-group-item">
                  <strong>Nome:</strong> {data.atividade.nome}
                </li>
                <li className="list-group-item">
                  <strong>Descrição:</strong>{" "}
                  {data.atividade.descricao || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Início:</strong> {data.atividade.inicio}
                </li>
                <li className="list-group-item">
                  <strong>Fim:</strong> {data.atividade.fim || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Responsável:</strong> {data.atividade.responsavel}
                </li>
                <li className="list-group-item">
                  <strong>Duração:</strong> {data.atividade.duracao}{" "}
                  {
                    getCategoriaByName(data.categoriaNome)?.unidadeDeTempo
                  }
                </li>
                <li className="list-group-item">
                  <strong>Categoria:</strong> {data.categoriaNome}
                </li>
                <li className="list-group-item">
                  <strong>Certificado:</strong>{" "}
                  {data.certificadoFileName || "Nenhum anexado"}
                </li>
              </ul>
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
                className="btn btn-primary"
                onClick={onConfirm}
              >
                Confirmar Registro
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="background-div">
      <div className="container pt-5 pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0" style={{ fontWeight: "bold" }}>
            Registrar Atividade Complementar
          </h1>
          <button
            onClick={handleGoBack}
            className="btn btn-outline-light btn-sm"
          >
            <span className="d-none d-md-block">Voltar</span>
            <span className="d-block d-md-none">
              <FontAwesomeIcon icon={faArrowLeft} />
            </span>
          </button>
        </div>
        <hr className="my-4" />

        <ActivityForm
          onSubmit={onSubmit}
          onClear={handleClear}
          precisaCertificado={true}
          prefilledData={prefilledData}
        />

        {showConfirmationModal && confirmationData && (
          <ConfirmationModal
            show={showConfirmationModal}
            onClose={handleCancelConfirmation}
            onConfirm={handleConfirmRegistration}
            data={confirmationData}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrarAtividadePage;