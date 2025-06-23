// src/pages/PreRegistroPage.tsx
import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { ActivityFormInputs } from "../components/ActivityForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import qrCodeCameraImage from "../assets/qrcode .png"; // Certifique-se de que o caminho está correto

const PreRegistroPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleManualRegistration = () => {
    navigate("/registrar-atividade");
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    setShowLoadingModal(true);

    const currentAbortController = new AbortController();
    setAbortController(currentAbortController);

    setTimeout(() => {
      // **Verifica se a operação não foi cancelada antes de navegar**
      if (currentAbortController.signal.aborted) {
        console.log("Processamento de certificado cancelado.");
        setShowLoadingModal(false); // Garante que o modal seja fechado
        setAbortController(null); // Limpa o controller
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

      setShowLoadingModal(false);
      navigate("/registrar-atividade", {
        state: { prefilledData: mockActivityData },
      });
    }, 1000);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCancelUpload = () => {
    if (abortController) {
      abortController.abort(); // Sinaliza o cancelamento
      console.log("Upload de certificado cancelado pelo usuário.");
    }
    setShowLoadingModal(false); // Esconde o modal imediatamente
    setAbortController(null); // Limpa o controller
  };

  const handleQRCodeRegistration = () => {
    setShowQRCodeModal(true); // Mostra o modal do QR Code
    const currentAbortController = new AbortController();
    setAbortController(currentAbortController);

    // Simula o tempo de leitura do QR Code
    setTimeout(() => {
      // **Verifica se a operação não foi cancelada antes de navegar**
      if (currentAbortController.signal.aborted) {
        console.log("Leitura de QR Code cancelada.");
        setShowQRCodeModal(false); // Garante que o modal seja fechado
        setAbortController(null); // Limpa o controller
        return;
      }

      const mockFile = new File(
        ["dummy content"],
        "certificado_workshop_react.pdf",
        {
          type: "application/pdf",
        }
      );
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(mockFile);
      const mockCertificado = dataTransfer.files;

      // Dados mockados para preenchimento via QR Code
      const mockActivityData: ActivityFormInputs = {
        nome: "Simpósio de Desenvolvimento Web",
        descricao: "Workshop prático sobre React e Node.js.",
        inicio: "2024-06-15",
        fim: "2024-06-16",
        responsavel: "Empresa XPTO Tech",
        duracao: 4,
        categoriaNome:
          "Participação em cursos e treinamentos presenciais ou não, na área de Computação",
        certificado: mockCertificado, // QR Code não gera um arquivo de certificado
      };

      setShowQRCodeModal(false);
      navigate("/registrar-atividade", {
        state: { prefilledData: mockActivityData },
      });
    }, 3000); // Simula 2 segundos para leitura do QR Code
  };

  const handleCancelQRCodeScan = () => {
    if (abortController) {
      abortController.abort(); // Sinaliza o cancelamento
      console.log("Leitura de QR Code cancelada pelo usuário.");
    }
    setShowQRCodeModal(false); // Esconde o modal imediatamente
    setAbortController(null); // Limpa o controller
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center ">
        <h1>Registrar Atividade Complementar</h1>
        <button onClick={handleGoBack} className="btn btn-outline-light btn-sm">
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
              <i className="bi bi-upload me-2"></i> Enviar Certificado
            </button>
          </div>
        </div>
      </div>

      <div className="card text-dark bg-light mb-4 shadow-sm">
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

      <div className="card text-dark bg-light shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Opção 3: Usar o QR Code</h5>
          <p className="card-text">
            Cada palestra, workshop, curso e demais atividades de eventos
            registrados no site possui um QR Code exclusivo. Ao final de cada
            atividade, você pode escaneá-lo para gerar seu certificado
            automaticamente e registrar a participação no nosso organizador de
            atividades complementares.
          </p>
          <div className="d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-custom-navy-white btn-lg"
              onClick={handleQRCodeRegistration}
            >
              <i className="bi bi-qr-code me-2"></i> Ler QR Code
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 p-3 border rounded bg-dark text-white-50">
        <h4 className="text-white">
          <span className="text-warning">Importante:</span> Regras de Atividades
          Complementares
        </h4>
        <ul className="list-unstyled">
          <li>
            • Atividades Complementares são componentes curriculares{" "}
            <strong>obrigatórios</strong>.
          </li>
          <li>
            • Para o currículo <strong>31.02.003</strong>, são necessárias no
            mínimo <strong>148h</strong>. Para o <strong>31.02.002</strong>, são
            necessárias no mínimo <strong>162h</strong>
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
            • Voce pode preencher solicitação de registro (SRAC) na nossa
            plataforma{" "}
            <Link to="/dashboard/pre-registro" className="comece-agora-link">
              Preencher formulário
            </Link>
          </li>
          <li>
            • A Coordenação de Curso avisará sobre o resultado da análise.
          </li>
        </ul>
        <p className="text-center mt-3">
          Para mais detalhes, consulte a{" "}
          <Link
            to="/atividades#tabela-atividades"
            className="comece-agora-link"
          >
            Tabela de Pontuação para Atividades Complementares
          </Link>{" "}
          e o{" "}
          <Link to="/formulario-solicitacao" className="comece-agora-link">
            Formulário de Solicitação de Atividade Complementar
          </Link>
          .
        </p>
      </div>

      {/* Modal de Carregamento (para upload de certificado) */}
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
                <h5 className="modal-title" id="loadingModalLabel">
                  Processando Certificado
                </h5>
              </div>
              <div className="modal-body text-center">
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  size="3x"
                  className="mb-3 text-info"
                />
                <p>
                  Aguarde enquanto estamos recuperando as informações do seu
                  certificado...
                </p>
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

      {/* Novo Modal de Leitura de QR Code */}
      {showQRCodeModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.7)", display: "block" }}
          aria-labelledby="qrCodeModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-0">
                <h5 className="modal-title" id="qrCodeModalLabel">
                  Escaneando QR Code
                </h5>
              </div>
              <div className="modal-body text-center">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "75%", // Aspect ratio 4:3 for the image
                    overflow: "hidden",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={qrCodeCameraImage}
                    alt="Câmera escaneando QR Code"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                      filter: "brightness(0.8)", // Slightly dim the background image
                    }}
                  />
                  {/* Overlay para simular a área de leitura */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20%",
                      left: "20%",
                      width: "60%",
                      height: "60%",
                      border: "3px solid #00ff00", // Green border for scanner
                      boxShadow: "0 0 15px rgba(0,255,0,0.5)", // Glowing effect
                      animation: "scan-animation 2s infinite alternate", // Animation
                    }}
                  ></div>
                  {/* Linha de leitura animada */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20%",
                      left: "20%",
                      width: "60%",
                      height: "2px",
                      backgroundColor: "#00ff00",
                      boxShadow: "0 0 10px #00ff00",
                      animation: "scan-line-animation 2s infinite",
                    }}
                  ></div>
                </div>
                <p>
                  Aproxime o QR Code da câmera para que possamos preencher
                  automaticamente.
                </p>
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  size="2x"
                  className="mt-3 text-info"
                />{" "}
                Lendo QR Code...
              </div>
              <div className="modal-footer border-0 d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleCancelQRCodeScan}
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
