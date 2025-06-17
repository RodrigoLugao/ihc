// src/pages/RegistrarAtividadePage.tsx
import React, { useEffect } from "react"; // Adicionei useEffect
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActivityForm, {
  type ActivityFormInputs,
} from "../components/ActivityForm"; // Importar o novo componente e a interface
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom"; // Adicionei useLocation
import { useForm, type SubmitHandler } from "react-hook-form"; // Adicionei useForm e SubmitHandler
import { useCategoriaStore } from "../store/categoriaStore"; // Importe o hook do seu store

const RegistrarAtividadePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acessar o objeto location
  // Pega os dados do estado de navegação, tipando-os como ActivityFormInputs ou undefined
  const prefilledData = location.state?.prefilledData as
    | ActivityFormInputs
    | undefined;

  // Utilize useForm para ter acesso ao método reset, que será passado ao ActivityForm
  // O ActivityForm já gerencia o register e handleSubmit internamente.
  // Aqui, configuramos os valores default com os dados pré-preenchidos, se existirem.
  const { reset } = useForm<ActivityFormInputs>({
    defaultValues: prefilledData, // Define os valores iniciais do formulário
  });

  // Acessar o store de categorias para garantir que as categorias estejam carregadas e para buscar pelo nome
  const { getCategoriaByName } = useCategoriaStore();

  // useEffect para garantir que o formulário seja resetado se os dados pré-preenchidos mudarem
  // ou se o componente for montado com novos dados de navegação.
  useEffect(() => {
    if (prefilledData) {
      reset(prefilledData);
    } else {
      // Se não há dados pré-preenchidos (ex: acesso direto à página), reseta para valores vazios
      reset({
        nome: "",
        descricao: "",
        inicio: "",
        fim: "",
        responsavel: "",
        duracao: 0,
        categoriaNome: "",
        certificado: undefined,
      });
    }
  }, [prefilledData, reset]); // 'reset' é uma função estável do react-hook-form, mas adicioná-la é boa prática.

  const onSubmit: SubmitHandler<ActivityFormInputs> = (data) => {
    // Buscar a categoria pelo nome usando o store
    const selectedCategory = getCategoriaByName(data.categoriaNome);

    if (!selectedCategory) {
      alert(
        "Erro interno: Categoria não encontrada no store. Por favor, selecione uma categoria válida."
      );
      return;
    }

    const newId = Date.now(); // ID temporário, idealmente viria de um backend

    const novaAtividade = {
      id: newId,
      nome: data.nome,
      descricao: data.descricao,
      inicio: new Date(data.inicio),
      fim: data.fim ? new Date(data.fim) : undefined,
      responsavel: data.responsavel,
      duracao: Number(data.duracao),
      categoria: selectedCategory, // Passar o objeto completo da categoria
    };

    console.log("Dados da Nova Atividade (pronto para enviar):", novaAtividade);
    console.log(
      "Certificado (se selecionado):",
      data.certificado && data.certificado.length > 0
        ? data.certificado[0]
        : "Nenhum"
    );

    alert("Formulário preenchido e dados logados no console!");
    // Aqui você faria a chamada para a API para registrar a atividade
    // Por exemplo: useAtividadeStore().addAtividade(novaAtividade);
  };

  const handleClear = () => {
    console.log("Formulário limpo pela página pai (RegistrarAtividadePage)");
    // Ao chamar o reset do formulário interno, ele será re-renderizado com os valores padrão.
    // Se prefilledData existir, ele voltará aos preenchidos. Se não, ficará vazio.
    reset({
      nome: "",
      descricao: "",
      inicio: "",
      fim: "",
      responsavel: "",
      duracao: 0,
      categoriaNome: "",
      certificado: undefined,
    });
  };

  // Função para lidar com o clique do botão Voltar
  const handleGoBack = () => {
    navigate(-1); // Volta uma entrada no histórico do navegador
  };

  return (
    <div className="background-div">
      <div className="container pt-5 pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0" style={{ fontWeight: "bold" }}>
            Registrar Atividade Complementar
          </h1>
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

        {/* Renderiza o componente ActivityForm, passando as funções de callback
            E, mais importante, passando a função reset do useForm para o ActivityForm
            para que ele possa ser controlado externamente.
        */}
        <ActivityForm onSubmit={onSubmit} onClear={handleClear} prefilledData={prefilledData} />
      </div>
    </div>
  );
};

export default RegistrarAtividadePage;