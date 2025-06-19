// src/pages/EditarAtividadePage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActivityForm, {
  type ActivityFormInputs,
} from "../components/ActivityForm";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form"; // Ainda necessário para resetar o form programaticamente
import { useCategoriaStore } from "../store/categoriaStore";
import { useUserStore } from "../store/userStore";
import { useAtividadeStore } from "../store/atividadeStore";
import { useAtividadesConcluidasStore } from "../store/atividadesConcluidasStore";
import type { AtividadeConcluida } from "../interfaces/AtivdadeConcluida";
import type { Atividade } from "../interfaces/Atividade";

// Interface para os dados do modal de confirmação (agora para Edição/Registro)
interface ConfirmationModalData {
  atividade: ActivityFormInputs;
  categoriaNome: string;
  certificadoFileName: string | undefined;
  isEditing: boolean; // Indica se é uma confirmação de edição ou registro
}

const EditarAtividadePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Recebe a atividade e a atividade concluída do estado da rota
  const { atividade, atividadeConcluida } = location.state as {
    atividade: Atividade;
    atividadeConcluida: AtividadeConcluida;
  } || {}; // Desestrutura e fornece um objeto vazio como fallback

  const isEditingMode = !!atividade && !!atividadeConcluida; // Entra em modo de edição se ambos existirem

  const { reset } = useForm<ActivityFormInputs>(); // Usado para resetar o form

  const { getCategoriaByName } = useCategoriaStore();
  const currentUser = useUserStore((state) => state.user);
  const addAtividade = useAtividadeStore((state) => state.addAtividade);
  const updateAtividade = useAtividadeStore((state) => state.updateAtividade); // NOVO
  const addAtividadeConcluida = useAtividadesConcluidasStore(
    (state) => state.addAtividadeConcluida
  );
  const updateAtividadeConcluida = useAtividadesConcluidasStore(
    (state) => state.updateAtividadeConcluida
  ); // NOVO

  // Estados para o modal de confirmação
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState<
    ConfirmationModalData | undefined
  >(undefined);

  // Prepara os dados iniciais para o ActivityForm
  const initialPrefilledData: ActivityFormInputs | undefined = useMemo(() => {
    if (isEditingMode) {
      // Formata as datas para o formato "YYYY-MM-DD" que o input type="date" espera
      const inicioFormatted = atividade.inicio instanceof Date ? atividade.inicio.toISOString().split('T')[0] : atividade.inicio;
      const fimFormatted = atividade.fim instanceof Date ? atividade.fim.toISOString().split('T')[0] : (atividade.fim || '');

      // Cria um FileList mock para o certificado existente, se houver
      /* let certificadoFileList: FileList | null = null; */
      if (atividadeConcluida.comprovante) {
        // Você pode criar um File object mock se quiser "simular" o arquivo
        // ou passar null e deixar o ActivityForm lidar com o display do nome.
        // Para simplificar, se você só precisa exibir o nome, podemos manipular isso
        // no ActivityForm. Aqui, para a prop `prefilledData.certificado` que é `FileList`,
        // vamos ter que passar `null` e confiar que a lógica de `ActivityForm`
        // exibirá o `certificadoFileName` corretamente quando o `prefilledData`
        // for processado no useEffect de `ActivityForm` para configurar o `watch`.
        // A melhor abordagem é passar o nome do arquivo existente como uma prop separada para `ActivityForm`
        // e ele decide se mostra o nome do arquivo ou o FileList recém-selecionado.

        // Para a prop `prefilledData` que espera `FileList`, passaremos `null` aqui.
        // A exibição do nome do arquivo existente será gerenciada pelo ActivityForm
        // através do `prefilledData.certificadoFileName` se criarmos essa prop.
        // Por agora, vamos manter `certificado: null` e ajustar a exibição no `ActivityForm`.
        // Já ajustamos a lógica de `hasCertificado` e `certificadoFileName` no `ActivityForm`
        // para considerar `prefilledData.certificado` como o "arquivo que já existe".
      }

      return {
        nome: atividade.nome,
        descricao: atividade.descricao || "",
        inicio: inicioFormatted,
        fim: fimFormatted,
        responsavel: atividade.responsavel,
        duracao: atividade.duracao,
        categoriaNome: atividade.categoria?.nome || "",
        certificado: null, // O arquivo em si não pode ser pré-preenchido diretamente em um input file,
                          // mas o ActivityForm pode saber que ele "existe" via prefilledData
      };
    }
    return undefined;
  }, [isEditingMode, atividade, atividadeConcluida]);

  useEffect(() => {
    // Isso garante que o formulário seja resetado com os dados pré-preenchidos
    // ou zerado quando a página é carregada ou o modo muda
    reset(initialPrefilledData);
  }, [initialPrefilledData, reset]);


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
        : (isEditingMode && atividadeConcluida.comprovante) // Se estiver editando e já houver comprovante
          ? atividadeConcluida.comprovante.split('/').pop() // Pega o nome do arquivo do path
          : undefined;

    setConfirmationData({
      atividade: data,
      categoriaNome: selectedCategory.nome,
      certificadoFileName: certificadoFileName,
      isEditing: isEditingMode, // Passa o modo atual para o modal
    });
    setShowConfirmationModal(true);
  };

  const handleConfirmAction = () => {
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

    const newAtividadeData: Omit<Atividade, 'id'> = {
      nome: formData.nome,
      descricao: formData.descricao,
      inicio: new Date(formData.inicio),
      fim: formData.fim ? new Date(formData.fim) : undefined,
      responsavel: formData.responsavel,
      categoria: selectedCategory,
      duracao: formData.duracao,
    };

    if (isEditingMode && atividade && atividadeConcluida) {
      // Lógica de EDIÇÃO
      updateAtividade(atividade.id, newAtividadeData); // Atualiza a atividade
      
      const updatedComprovantePath = confirmationData.certificadoFileName
        ? `/uploads/${confirmationData.certificadoFileName}`
        : undefined;

      updateAtividadeConcluida(
        atividade.id,
        currentUser.id,
        { comprovante: updatedComprovantePath }
      );
      alert("Atividade atualizada com sucesso!");
    } else {
      // Lógica de REGISTRO (do RegistrarAtividadePage original)
      const atividadeAdicionada = addAtividade(newAtividadeData); // Adiciona a atividade

      const novaAtividadeConcluida: AtividadeConcluida = {
        idAtividade: atividadeAdicionada.id,
        idUsuario: currentUser.id,
        comprovante: confirmationData.certificadoFileName
          ? `/uploads/${confirmationData.certificadoFileName}`
          : undefined,
      };
      addAtividadeConcluida(novaAtividadeConcluida);
      alert("Atividade registrada com sucesso!");
    }

    console.log("Ação concluída e dados salvos nos stores!");
    setShowConfirmationModal(false);
    handleClear(); // Limpa o formulário após a ação
    navigate('/dashboard/atividades'); // Redireciona para a lista
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
    setConfirmationData(undefined);
  };

  const handleClear = () => {
    console.log("Formulário limpo pela página pai (EditarAtividadePage)");
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
    currentUserNome: string | undefined; // Para exibir no modal
  }> = ({ show, onClose, onConfirm, data, currentUserNome }) => {
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
              <h5 className="modal-title">
                Confirmar {data.isEditing ? "Edição" : "Registro"} de Atividade
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Você deseja realmente {data.isEditing ? "atualizar" : "registrar"} a seguinte atividade para o
                usuário{" "}
                <strong>{currentUserNome || "Não logado"}</strong>?
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
                Confirmar {data.isEditing ? "Edição" : "Registro"}
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
            {isEditingMode ? "Editar Atividade Complementar" : "Registrar Atividade Complementar"}
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
          prefilledData={initialPrefilledData} // Passa os dados pré-preenchidos aqui
          isEditing={isEditingMode} // Indica o modo de edição
        />

        {showConfirmationModal && confirmationData && ( // Renderiza condicionalmente
          <ConfirmationModal
            show={showConfirmationModal}
            onClose={handleCancelConfirmation}
            onConfirm={handleConfirmAction} // Agora chama handleConfirmAction
            data={confirmationData}
            currentUserNome={currentUser?.nome}
          />
        )}
      </div>
    </div>
  );
};

export default EditarAtividadePage;