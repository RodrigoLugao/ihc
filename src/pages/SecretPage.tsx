import { useNavigate } from "react-router-dom";

const SecretPage = () => {
  const navigate = useNavigate(); // Inicializa o hook

  const handleGoBack = () => {
    navigate(-1); // Isso é o equivalente a clicar no botão "Voltar" do navegador
  };
  return (
    <div className="background-div text-white">
      <div className="container pt-5" style={{ height: "724px" }}>
        <h5>?????????</h5>
        <hr className="mt-1 mb-3" />
        <iframe
          src="https://sethclydesdale.github.io/browser-pong/"
          style={{ height: "550px", width: "900px", border: "none" }}
        ></iframe>
        <button type="button" className="btn btn-custom-navy-white" onClick={handleGoBack}>
          Voltar
        </button>
      </div>
    </div>
  );
};
export default SecretPage;
