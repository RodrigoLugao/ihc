import { faArrowLeft, faDownload, faUpload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import type { SRACFormInputs } from "../components/SRACForm";
import SRACForm from "../components/SRACForm";
import { useDashboardData } from "../context/DashboardContext";
import { useAtividadesConcluidasStore } from "../store/atividadesConcluidasStore";
import { useAtividadeStore } from "../store/atividadeStore";
import type { SRACActivityInput } from "../components/SRACActivitySection";
import React, { useRef, useState } from "react";
import type { Atividade } from "../interfaces/Atividade";
import { atividadesNovasData } from '../data/atividadesNovasData';
import ListaAtividades from "../components/ListaDeAtividades"; // Mantém o nome do import
import { useSRACFormStore } from "../store/sracFormStore";

const PreFormularioPage = () => {
  const navigate = useNavigate();
  const { usuario, loading, error, horasFaltando, totalHorasNecessarias } = useDashboardData();
  const getAtividadesConcluidasByUsuario = useAtividadesConcluidasStore(
    (state) => state.getAtividadesConcluidasByUsuario
  );
  const getAtividadeById = useAtividadeStore((state) => state.getAtividadeById);

  const addAtividade = useAtividadeStore((state) => state.addAtividade);
  const addAtividadeConcluida = useAtividadesConcluidasStore((state) => state.addAtividadeConcluida);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showConfirmActivitiesModal, setShowConfirmActivitiesModal] = useState(false);
  const [mockedActivitiesFromUpload, setMockedActivitiesFromUpload] = useState<Atividade[]>([]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Use o store do SRACForm para salvar os dados
  const { setFormData: setSracFormData } = useSRACFormStore();

  const handleSubmitSRAC = (data: SRACFormInputs) => {
    console.log("Dados do Formulário SRAC Enviados:", data);
    // Salvar os dados do formulário SRAC no Zstand store
    setSracFormData(data);
    alert("Formulário SRAC salvo com sucesso!");
    // Aqui você pode adicionar lógica para enviar os dados para um backend real
  };

  const handleCancelSRAC = () => {
    console.log("Formulário SRAC cancelado/limpo.");
    // O reset do formulário para os dados iniciais já será tratado dentro do SRACForm
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const prefilledData: SRACFormInputs | undefined = React.useMemo(() => {
    let atividadesFormatadas: SRACActivityInput[] = [];
    let usuarioDataPrefilled = {
      nomeAluno: "",
      matriculaAluno: "",
      telefoneContato: "",
      emailContato: "",
    };

    const idUsuarioParaAtividades = usuario?.id === 999 ? 1 : usuario?.id;

    if (idUsuarioParaAtividades) {
      const atividadesConcluidasParaPreencher = getAtividadesConcluidasByUsuario(
        idUsuarioParaAtividades
      );

      if (atividadesConcluidasParaPreencher.length > 0) {
        atividadesFormatadas = atividadesConcluidasParaPreencher
          .map((ac, index) => {
            const atividadeDetalhes = getAtividadeById(ac.idAtividade);
            return {
              numeroPedido: index + 1,
              categoriaNome: atividadeDetalhes?.categoria?.nome || "",
              horasDiasMeses: atividadeDetalhes?.duracao || 0,
              comprovantes: ac.comprovante || "",
            };
          })
          .filter(
            (atividade) =>
              atividade.categoriaNome !== "" && atividade.horasDiasMeses > 0
          );
      }
    }

    if (atividadesFormatadas.length === 0) {
      atividadesFormatadas = [{
        numeroPedido: 1,
        categoriaNome: "",
        horasDiasMeses: 0,
        comprovantes: "",
      }];
    }

    if (usuario && usuario.id !== 999) {
      usuarioDataPrefilled = {
        nomeAluno: usuario.nome,
        matriculaAluno: usuario.matricula,
        telefoneContato: usuario.telefone,
        emailContato: usuario.email,
      };
    }

    const paginasPedidoCalculadas = Math.max(1, Math.ceil(atividadesFormatadas.length / 3));

    return {
      ...usuarioDataPrefilled,
      paginasPedido: paginasPedidoCalculadas,
      paginasComprovantes: 0,
      atividades: atividadesFormatadas,
    };
  }, [usuario, getAtividadesConcluidasByUsuario, getAtividadeById]);

  const showPrefillMessage = usuario && usuario.id !== 999;
  const showVisitorMessage = usuario && usuario.id === 999;

  const handleDownloadSRAC = async () => {
    // Aqui você pode adicionar lógica para diferenciar o download (modelo ou pré-preenchido)
    // Por simplicidade, continua baixando o modelo em branco.
    window.open("/Formulário_de_SRAC_-_versão_2014.12.01.pdf", "_blank");
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setShowLoadingModal(true);
    const currentAbortController = new AbortController();
    setAbortController(currentAbortController);

    setTimeout(() => {
      if (currentAbortController.signal.aborted) {
        console.log("Processamento de certificado cancelado.");
        return;
      }

      setMockedActivitiesFromUpload(atividadesNovasData || []);
      setShowLoadingModal(false);
      setShowConfirmActivitiesModal(true);
    }, 1500);
  };

  const handleCancelUpload = () => {
    if (abortController) {
      abortController.abort();
    }
    setShowLoadingModal(false);
    setAbortController(null);
  };

  const handleConfirmActivities = async () => {
    if (!usuario) {
      alert("Erro: Usuário não logado. Não é possível adicionar atividades.");
      setShowConfirmActivitiesModal(false);
      return;
    }

    for (const activity of mockedActivitiesFromUpload) {
      const addedActivity = addAtividade(activity);

      const newAtividadeConcluida = {
        idAtividade: addedActivity.id,
        idUsuario: usuario.id,
        comprovante: activity.categoria?.nome === "Cursos de extensão" ? "/uploads/certificado_mock1.pdf" : "/uploads/certificado_mock2.pdf",
        dataConclusao: new Date().toISOString().split('T')[0],
      };
      addAtividadeConcluida(newAtividadeConcluida);
    }
    alert("Atividades adicionadas com sucesso ao seu registro!");
    setMockedActivitiesFromUpload([]);
    setShowConfirmActivitiesModal(false);
    navigate(0);
  };

  const handleCancelConfirmActivities = () => {
    setMockedActivitiesFromUpload([]);
    setShowConfirmActivitiesModal(false);
  };

  if (loading) {
    return (
      <div className="text-center text-light mt-5">
        Carregando informações do usuário e atividades...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger mt-5">
        Erro ao carregar dados: {error}
      </div>
    );
  }

  const renderHorasFaltandoMessage = () => {
    if (usuario && usuario.id !== 999) {
      if (horasFaltando > 0) {
        return (
          <div className="alert alert-warning mb-4" role="alert">
            <p className="mb-0">
              Você ainda precisa registrar **{horasFaltando.toFixed(1)} horas** de Atividades Complementares para atingir o total necessário de {totalHorasNecessarias} horas.
            </p>
            <p className="mb-0 mt-2">
              Continue adicionando suas atividades para completar seus requisitos!
            </p>
          </div>
        );
      } else {
        return (
          <div className="alert alert-success mb-4" role="alert">
            <p className="mb-0">
              Parabéns! Você já atingiu (ou excedeu) o total de {totalHorasNecessarias} horas de Atividades Complementares necessárias.
            </p>
            <p className="mb-0 mt-2">
              Você pode enviar seu formulário SRAC a qualquer momento.
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Preencher Formulário SRAC</h1>
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

      {renderHorasFaltandoMessage()}

      {showPrefillMessage && (
        <div className="alert alert-info" role="alert">
          <p className="mb-0">
            **Informações Pré-Preenchidas:**
            <br /> Detectamos que você possui atividades complementares registradas e dados de usuário em nosso sistema.
            Para sua conveniência, já preenchemos automaticamente o formulário SRAC com:
          </p>
          <ul>
            <li>Seu nome, matrícula, telefone e e-mail.</li>
            <li>As atividades complementares que você já concluiu e registrou.</li>
          </ul>
          <p className="mb-0">
            Você pode revisar, editar e adicionar mais atividades antes de enviar sua solicitação.
          </p>
        </div>
      )}

      {showVisitorMessage && (
        <div className="alert alert-warning" role="alert">
          <p className="mb-0">
            **Modo Visitante:**
            <br /> Como visitante, seus dados pessoais (nome, matrícula, etc.) não foram preenchidos. No entanto,
            preenchemos as seções de atividades com exemplos de atividades registradas para que você possa explorar
            a funcionalidade do formulário.
          </p>
          <p className="mb-0">
            Sinta-se à vontade para editar os campos e testar o envio do formulário.
          </p>
        </div>
      )}

      {/* Card para a opção de Upload de Certificados */}
      {horasFaltando > 0 && <div className="card text-dark bg-light mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Preencher Atividades com Certificados</h5>
          <p className="card-text">
            Envie seu certificado (ou vários!) e nossa inteligência artificial irá extrair as informações relevantes para
            pré-preencher as seções de atividades do formulário. Você poderá revisar e confirmar antes de adicionar.
          </p>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
            />
            <button
              type="button"
              className="btn btn-outline-success btn-lg"
              onClick={handleFileUploadClick}
            >
              <FontAwesomeIcon icon={faUpload} className="me-2" /> Enviar Certificado(s)
            </button>
          </div>
        </div>
      </div>}

      {/* Card para o botão de Baixar Formulário SRAC */}
      <div className="card text-dark bg-light mb-4 shadow-sm">
        <div className="card-body text-center">
          <h5 className="card-title">Baixar Formulário SRAC (PDF)</h5>
          <p className="card-text">
            Clique no botão abaixo para baixar o formulário SRAC com as informações preenchidas abaixo.
          </p>
          <button
            type="button"
            onClick={handleDownloadSRAC}
            className="btn btn-primary btn-lg mb-5"
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" /> Baixar Formulário SRAC Preenchido
          </button>
          <p className="card-text">
            Ou clique no botão abaixo para baixar o formulário SRAC em branco para ser preenchido manualmente.
          </p>
          <button
            type="button"
            onClick={handleDownloadSRAC}
            className="btn  btn-custom-navy-white"
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" /> Baixar Formulário SRAC em branco
          </button>
        </div>
      </div>

      {/* Card para o Formulário SRAC */}
      <div className="card text-dark bg-light mb-4 shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Ver ou Editar Informações do Formulário SRAC</h5>
        </div>
        <div className="card-body">
          <SRACForm
            onSubmit={handleSubmitSRAC}
            onCancel={handleCancelSRAC}
            prefilledData={prefilledData}
            usuario={usuario as any}
          />
        </div>
      </div>

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
                <h5 className="modal-title" id="loadingModalLabel">Processando Certificado(s)</h5>
              </div>
              <div className="modal-body text-center">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" className="mb-3 text-info" />
                <p>Aguarde enquanto estamos recuperando as informações do(s) seu(s) certificado(s)...</p>
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

      {showConfirmActivitiesModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)", display: "block" }}
          aria-labelledby="confirmActivitiesModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-light text-dark">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmActivitiesModalLabel">Atividades Sugeridas pelo Certificado</h5>
                <button type="button" className="btn-close" onClick={handleCancelConfirmActivities}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <p>
                  A inteligência artificial identificou as seguintes atividades no(s) certificado(s) que você enviou.
                  Por favor, revise-as e confirme se deseja adicioná-las ao seu registro:
                </p>
                {mockedActivitiesFromUpload.length > 0 ? (
                  <ListaAtividades
                    activities={mockedActivitiesFromUpload}
                    showEdit={false}
                    usuario={usuario}
                    showPendingStatus={false}
                    showRegisterButton={false}
                  />
                ) : (
                  <p className="text-center text-muted">Nenhuma atividade detectada para confirmação.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelConfirmActivities}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleConfirmActivities}
                  disabled={mockedActivitiesFromUpload.length === 0 || !usuario || usuario.id === 999}
                >
                  Confirmar e Adicionar Atividades
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreFormularioPage;