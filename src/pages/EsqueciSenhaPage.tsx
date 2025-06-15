import {
  useNavigate,
} from "react-router-dom";
import { usuarioData, type Usuario } from "../interfaces/Usuario";

const EsqueciSenhaPage = () => {

  const navigate = useNavigate(); // Inicializa o hook

  const handleGoBack = () => {
    navigate(-1); // Isso é o equivalente a clicar no botão "Voltar" do navegador
  };
  return (
    <div className="background-div text-white">
      <div className="container pt-5" style={{ height: "724px" }}>
        <h5>Esqueceu Login ou Senha?</h5>
        <hr className="mt-1 mb-3" />
        <p>Entre em contato com o STI para recuperar suas credenciais</p>
        <div className="w-100 mb-3"></div>

        <p>Para esse protótipo, temos os seguintes usuários, baseados nas Personas:</p>

         {usuarioData.map((usuario: Usuario) => (
          <div>
            <b>{usuario.nome}</b>
            <p>email:{usuario.email}</p>
            <p>senha:{usuario.senha}</p>
          </div>
         ))}

        <button type="button" className="btn btn-custom-navy-white" onClick={handleGoBack}>
          Voltar
        </button>
      </div>
    </div>
  );
};
export default EsqueciSenhaPage;
