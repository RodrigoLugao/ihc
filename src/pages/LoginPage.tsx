import { useState } from 'react'; // Importe useState
import { useForm, type FieldError } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para controlar a exibição do spinner
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from || '/dashboard';

  const onSubmit = async (data: any) => { // Tornar a função assíncrona
    setIsLoading(true); // Ativa o spinner

    console.log("Dados do formulário de login:", data);

    // Simula uma requisição de rede de 1 segundo
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- Lógica de Autenticação (Exemplo) ---
    // Em um cenário real, você faria uma chamada de API aqui.
    // Ex: const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify(data) });
    //     const result = await response.json();
    //     const authenticationSuccessful = result.success;

    const authenticationSuccessful = true; // Simule o sucesso do login para o exemplo

    setIsLoading(false); // Desativa o spinner após a "resposta"

    if (authenticationSuccessful) {
      alert(`Login bem-sucedido para: ${data.email}`);
      navigate(from, { replace: true });
    } else {
      alert("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="login-page-container d-flex justify-content-center align-items-center vh-100 background-div">
      <div className="login-card p-4 p-md-5 rounded shadow-lg text-center">
        <h2 className="mb-4" style={{ color: '#001f3f', fontWeight: 'bold' }}>Login SOAC</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-muted">E-mail @id.uff.br</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              placeholder="seu.email@id.uff.br"
              {...register('email', {
                required: 'E-mail é obrigatório.',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@id\.uff\.br$/,
                  message: 'Por favor, insira um e-mail válido @id.uff.br',
                },
              })}
              disabled={isLoading} // Desabilita o campo enquanto carrega
            />
            {errors.email && <div className="invalid-feedback">{(errors.email as FieldError).message}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-muted">Senha</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              placeholder="Sua senha"
              {...register('password', {
                required: 'Senha é obrigatória.',
              })}
              disabled={isLoading} // Desabilita o campo enquanto carrega
            />
            {errors.password && <div className="invalid-feedback">{(errors.password as FieldError).message}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-outline-success w-100 mb-3"
            disabled={isLoading} // Desabilita o botão enquanto carrega
          >
            {isLoading ? (
              // Exibe o spinner se isLoading for true
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Carregando...</span>
              </>
            ) : (
              // Exibe o texto normal do botão
              'Entrar'
            )}
          </button>

          <p className="mb-0">
            <Link
              to="/forgot-password"
              className="nav-custom-link"
              style={{color: "navy"}}
              aria-disabled={isLoading} // Desabilita o link visualmente
              onClick={(e) => isLoading && e.preventDefault()} // Impede clique se estiver carregando
            >
              Esqueceu sua senha ou usuário?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;