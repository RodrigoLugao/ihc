// src/pages/PreRegistroPage.tsx
import React, { useRef, useState } from "react"; // Adicionado useState
import { useNavigate, Link } from "react-router-dom";
import type { ActivityFormInputs } from "../components/ActivityForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons"; // Adicionado faSpinner

const PreRegistroPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para controlar a visibilidade do modal de carregamento
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  // Estado para armazenar o abort controller para o cancelamento (opcional, mas bom para simulações mais complexas)
  const [abortController, setAbortController] = useState<AbortController | null>(null);


  const handleManualRegistration = () => {
    navigate("/registrar-atividade");
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    // Mostra o modal de carregamento imediatamente
    setShowLoadingModal(true);

    // Cria um AbortController para permitir o cancelamento
    const currentAbortController = new AbortController();
    setAbortController(currentAbortController);

    // Simula o processamento da IA com um atraso de 1 segundo
    setTimeout(() => {
      // Verifica se a operação não foi cancelada antes de prosseguir
      if (currentAbortController.signal.aborted) {
        console.log("Processamento de certificado cancelado.");
        return;
      }

      let mockCertificado: FileList | undefined = undefined;

      if (files && files.length > 0) {
        mockCertificado = files;
        console.log("Arquivo real selecionado para upload:", files[0].name);
      } else {
        const mockFile = new File(
          ["dummy content"],
          "certificado_simulado_IA.pdf",
          {
            type: "application/pdf",
          }
        );
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);
        mockCertificado = dataTransfer.files;
        console.log("Arquivo mockado criado para simular preenchimento da IA.");
      }

      const mockActivityData: ActivityFormInputs = {
        nome: "Participação em Seminário de Computação",
        descricao:
          "Simulado: Participação no seminário 'Avanços em IA' organizado pela UFF.",
        inicio: "2024-05-10",
        fim: "2024-05-10",
        responsavel: "Universidade Federal Fluminense (UFF)",
        duracao: 8,
        categoriaNome: "Participação em seminários, congressos e eventos",
        certificado: mockCertificado,
      };

      // Esconde o modal de carregamento antes de navegar
      setShowLoadingModal(false);
      navigate("/registrar-atividade", {
        state: { prefilledData: mockActivityData },
      });
    }, 1000); // Atraso de 1 segundo
  };

  // Função para lidar com o clique do botão Voltar
  const handleGoBack = () => {
    navigate(-1);
  };

  // Função para cancelar o processo de upload/IA
  const handleCancelUpload = () => {
    if (abortController) {
      abortController.abort(); // Sinaliza o cancelamento
      console.log("Upload de certificado cancelado pelo usuário.");
    }
    setShowLoadingModal(false); // Esconde o modal
    setAbortController(null); // Limpa o controller
    // Opcional: Se quiser limpar a seleção de arquivo no input visualmente (não é padrão do browser)
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = "";
    // }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center ">
        <h1>Registrar Atividade Complementar</h1>
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

      <div className="card text-dark bg-light mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Opção 1: Registrar com Certificado</h5>
          <p className="card-text">
            Envie seu certificado e deixe a inteligência artificial preencher
            automaticamente os campos do formulário para você.
          </p>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <button
              type="button"
              className="btn btn-outline-success btn-lg"
              onClick={handleFileUploadClick}
            >
              <i className="bi bi-upload me-2"></i> Subir Certificado
            </button>
          </div>
        </div>
      </div>

      <div className="card text-dark bg-light shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Opção 2: Preencher Manualmente</h5>
          <p className="card-text">
            Prefere ter controle total? Preencha o formulário de registro de
            atividade complementar manualmente, passo a passo.
          </p>
          <div className="d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-custom-navy-white btn-lg"
              onClick={handleManualRegistration}
            >
              <i className="bi bi-pencil-square me-2"></i> Preencher Formulário
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 p-3 border rounded bg-dark text-white-50">
        <h4 className="text-white">
          <span className="text-warning">Importante:</span> Regras de Atividades Complementares
        </h4>
        <ul className="list-unstyled">
          <li>
            • Atividades Complementares são componentes curriculares{" "}
            <strong>obrigatórios</strong>.
          </li>
          <li>
            • Para o currículo 31.02.003, são necessárias no mínimo{" "}
            <strong>148h</strong>.
          </li>
          <li>• A carga horária não pode ser obtida por uma única AC.</li>
          <li>
            • Disciplinas Eletivas podem compor até metade da carga horária
            total.
          </li>
          <li>
            • A solicitação de registro (SRAC) deve ser enviada para{" "}
            <code>tgi.tic@id.uff.br</code>
            com no mínimo <strong>60 dias</strong> antes do fim do período
            letivo.
          </li>
          <li>
            • A Coordenação de Curso avisará sobre o resultado da análise.
          </li>
        </ul>
        <p className="text-center mt-3">
          Para mais detalhes, consulte a{" "}
          <Link to="/atividades#tabela-atividades" className="comece-agora-link">
            Tabela de Pontuação para Atividades Complementares
          </Link>
          {" "}e o{" "}
          <Link to="/formulario-solicitacao" className="comece-agora-link">
            Formulário de Solicitação de Atividade Complementar
          </Link>
          .
        </p>
      </div>

      {/* Modal de Carregamento */}
      {showLoadingModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)", display: "block" }}
          aria-labelledby="loadingModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-0">
                <h5 className="modal-title" id="loadingModalLabel">Processando Certificado</h5>
              </div>
              <div className="modal-body text-center">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" className="mb-3 text-info" />
                <p>Aguarde enquanto estamos recuperando as informações do seu certificado...</p>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleCancelUpload}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreRegistroPage;