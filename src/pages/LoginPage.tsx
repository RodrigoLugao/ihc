// src/pages/LoginPage.tsx
import { useState, useEffect } from 'react';
import { useForm, type FieldError } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { usuarioData, type Usuario } from '../interfaces/Usuario';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success');

  // Obtenha a função de login do seu store
  const login = useUserStore((state) => state.login);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated); // Opcional: redirecionar se já logado

  const from = location.state?.from || '/dashboard';

  // Redireciona se o usuário já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    let timer: number; 
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
        setAlertMessage('');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setShowAlert(false);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = usuarioData.find(
      (user: Usuario) => user.email === data.email && user.senha === data.password
    );

    const authenticationSuccessful = !!foundUser;

    setIsLoading(false);

    if (authenticationSuccessful) {
      // Chame a função de login do store para salvar o usuário
      login(foundUser as Usuario); // 'as Usuario' é seguro aqui pois foundUser é garantido
      
      setAlertMessage(`Login bem-sucedido para: ${foundUser?.nome}! Redirecionando...`);
      setAlertType('success');
      setShowAlert(true);
      
      // O redirecionamento será tratado pelo useEffect de isAuthenticated
      
    } else {
      setAlertMessage("Credenciais inválidas. Verifique seu e-mail e senha e tente novamente.");
      setAlertType('danger');
      setShowAlert(true);
    }
  };

  // Se o usuário já estiver autenticado (e o useEffect ainda não redirecionou),
  // pode-se renderizar algo diferente ou nada, esperando o redirecionamento.
  if (isAuthenticated) {
    return (
      <div className="login-page-container d-flex justify-content-center align-items-center vh-100 background-div">
        <div className="login-card p-4 p-md-5 rounded shadow-lg text-center">
          <h2 style={{ color: '#001f3f' }}>Redirecionando...</h2>
          <p>Você já está logado.</p>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page-container d-flex justify-content-center align-items-center vh-100 background-div">
      <div className="login-card p-4 p-md-5 rounded shadow-lg text-center">
        <h2 className="mb-4" style={{ color: '#001f3f', fontWeight: 'bold' }}>Login SOAC</h2>
        
        {showAlert && (
          <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
            {alertMessage}
            <button type="button" className="btn-close" onClick={() => setShowAlert(false)} aria-label="Close"></button>
          </div>
        )}

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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            {errors.password && <div className="invalid-feedback">{(errors.password as FieldError).message}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-outline-success w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Carregando...</span>
              </>
            ) : (
              'Entrar'
            )}
          </button>

          <p className="mb-0">
            <Link
              to="/esqueci-a-senha"
              className="nav-custom-link"
              style={{color: "navy"}}
              aria-disabled={isLoading}
              onClick={(e) => isLoading && e.preventDefault()}
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