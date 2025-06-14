import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  const navigate = useNavigate(); // Inicializa o hook

  const handleGoBack = () => {
    navigate(-1); // Isso é o equivalente a clicar no botão "Voltar" do navegador
  };
  return (
    <div className="background-div text-white">
      <div className="container pt-5" style={{ height: "724px" }}>
        <h5>Houve um Problema</h5>
        <hr className="mt-1 mb-3" />
        {isRouteErrorResponse(error)
          ? "Não encontramos o endereço que você procura"
          : error instanceof Error
          ? error.message
          : "Erro desconhecido. Msg: " + error}
        <div className="w-100 mb-3"></div>
        <button type="button" className="btn btn-custom-navy-white" onClick={handleGoBack}>
          Voltar
        </button>
      </div>
    </div>
  );
};
export default ErrorPage;
