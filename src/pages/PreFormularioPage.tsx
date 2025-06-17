import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const PreFormularioPage = () => {
  const navigate = useNavigate(); // Inicializa o hook

  const handleGoBack = () => {
    navigate(-1); // Isso é o equivalente a clicar no botão "Voltar" do navegador
  };
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Preencher Formulário SRAC</h1>
        <button
          onClick={handleGoBack}
          className="btn btn-outline-light btn-sm" // Botão claro, pequeno e com outline
        >
          <span className="d-none d-md-block">Voltar</span>
          <span className="d-block d-md-none">
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
        </button>
      </div>
      <hr className="my-4" />
    </>
  );
};
export default PreFormularioPage;
