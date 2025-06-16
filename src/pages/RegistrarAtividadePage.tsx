import { useForm, type SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react"; // Importar useState e useEffect
import { categoriasData, type CategoriaAtividade } from "../interfaces/Categoria";

interface ActivityFormInputs {
  nome: string;
  descricao: string;
  inicio: string;
  fim: string;
  responsavel: string;
  duracao: number;
  categoriaNome: string;
  certificado?: FileList;
}

const RegistrarAtividadePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch, // Importar a função watch
  } = useForm<ActivityFormInputs>();

  // >>> Monitorar a seleção da categoria em tempo real
  const selectedCategoryName = watch("categoriaNome");
  // >>> Estado para armazenar o objeto CategoriaAtividade completo
  const [selectedCategory, setSelectedCategory] = useState<CategoriaAtividade | undefined>(undefined);

  // >>> useEffect para atualizar a categoria selecionada quando selectedCategoryName mudar
  useEffect(() => {
    if (selectedCategoryName) {
      const foundCategory = categoriasData.find(
        (cat) => cat.nome === selectedCategoryName
      );
      setSelectedCategory(foundCategory);
    } else {
      setSelectedCategory(undefined); // Limpar se nenhuma categoria for selecionada
    }
  }, [selectedCategoryName]);

  const onSubmit: SubmitHandler<ActivityFormInputs> = (data) => {
    // A validação se selectedCategory existe já é feita pelo useEffect/estado
    if (!selectedCategory) {
      alert("Por favor, selecione uma categoria válida.");
      return;
    }

    const newId = Date.now();

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
      data.certificado && data.certificado.length > 0 ? data.certificado[0] : "Nenhum"
    );

    alert("Formulário preenchido e dados logados no console!");
    reset(); // Resetar o formulário
    setSelectedCategory(undefined); // Resetar a categoria selecionada também
  };

  const handleClear = () => {
    reset({
      nome: '',
      descricao: '',
      inicio: '',
      fim: '',
      responsavel: '',
      duracao: 0,
      categoriaNome: '',
      certificado: undefined,
    });
    setSelectedCategory(undefined); // Limpar a categoria selecionada ao limpar o formulário
  };

  return (
    <div className="background-div">
      <div className="container pt-5 pb-5">
        <h1>Registrar Nova Atividade Complementar</h1>
        <hr className="my-4" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 border rounded shadow-sm text-dark bg-light"
        >
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">
              Nome da Atividade
            </label>
            <input
              type="text"
              className={`form-control ${errors.nome ? "is-invalid" : ""}`}
              id="nome"
              placeholder="Nome da Atividade realizada. Ex.: Workshop: Redação de Artigos Científicos"
              {...register("nome", { required: "Nome é obrigatório." })}
            />
            {errors.nome && (
              <div className="invalid-feedback">{errors.nome.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="descricao" className="form-label">
              Descrição
            </label>
            <textarea
              className={`form-control ${errors.descricao ? "is-invalid" : ""}`}
              id="descricao"
              placeholder="Descrição das atividades realizadas. Ex: Orientações práticas para a escrita e formatação de artigos científicos. "
              rows={3}
              {...register("descricao")}
            ></textarea>
            {errors.descricao && (
              <div className="invalid-feedback">{errors.descricao.message}</div>
            )}
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="inicio" className="form-label">
                Data de Início
              </label>
              <input
                type="date"
                className={`form-control ${errors.inicio ? "is-invalid" : ""}`}
                id="inicio"
                {...register("inicio", {
                  required: "Data de início é obrigatória.",
                })}
              />
              {errors.inicio && (
                <div className="invalid-feedback">{errors.inicio.message}</div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="fim" className="form-label">
                Data de Fim
              </label>
              <input
                type="date"
                className={`form-control ${errors.fim ? "is-invalid" : ""}`}
                id="fim"
                {...register("fim", {
                  validate: (value, formValues) =>
                    !value || value >= formValues.inicio ||
                    "Data de fim deve ser igual ou posterior à data de início.",
                })}
              />
              {errors.fim && (
                <div className="invalid-feedback">{errors.fim.message}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="responsavel" className="form-label">
              Responsável/Instituição
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.responsavel ? "is-invalid" : ""
              }`}
              placeholder="Indivíduo ou instituição responsável pela atividade."
              id="responsavel"
              {...register("responsavel", {
                required: "Responsável é obrigatório.",
              })}
            />
            {errors.responsavel && (
              <div className="invalid-feedback">
                {errors.responsavel.message}
              </div>
            )}
          </div>

          {/* >>> Categoria antes da Duração */}
          <div className="mb-3">
            <label htmlFor="categoriaNome" className="form-label">
              Categoria da Atividade
            </label>
            <select
              className={`form-select ${
                errors.categoriaNome ? "is-invalid" : ""
              }`}
              id="categoriaNome"
              {...register("categoriaNome", {
                required: "Categoria é obrigatória.",
              })}
            >
              <option value="">Selecione uma categoria...</option>
              {categoriasData.map((cat: CategoriaAtividade, index: number) => (
                <option key={index} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
            {errors.categoriaNome && (
              <div className="invalid-feedback">
                {errors.categoriaNome.message}
              </div>
            )}
          </div>

          {/* >>> Campo de duração condicional e dinâmico */}
          <div className="mb-3">
            <label htmlFor="duracao" className="form-label">
              {selectedCategory
                ? `Duração da Atividade (em ${selectedCategory.unidadeDeTempo})`
                : "Duração da Atividade"}
            </label>
            <input
              type="number"
              className={`form-control ${
                errors.duracao ? "is-invalid" : ""
              }`}
              id="duracao"
              {...register("duracao", {
                required: selectedCategory ? "Duração é obrigatória." : false, // Torna obrigatório apenas se a categoria for selecionada
                min: { value: 1, message: "Duração deve ser positiva." },
                valueAsNumber: true,
              })}
              min="1"
              disabled={!selectedCategory} // Desabilita se nenhuma categoria for selecionada
              placeholder={
                !selectedCategory ? "Escolha a categoria primeiro" : ""
              }
            />
            {errors.duracao && (
              <div className="invalid-feedback">
                {errors.duracao.message}
              </div>
            )}
            {!selectedCategory && (
              <small className="form-text text-muted">
                Por favor, selecione uma categoria para habilitar este campo.
              </small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="certificado" className="form-label">
              Upload do Certificado (Opcional)
            </label>
            <input
              type="file"
              className={`form-control ${
                errors.certificado ? "is-invalid" : ""
              }`}
              id="certificado"
              {...register("certificado")}
            />
            {errors.certificado && (
              <div className="invalid-feedback">
                {errors.certificado.message}
              </div>
            )}
          </div>
          <div className="d-flex justify-content-between mt-4">
            <button type="button" onClick={handleClear} className="btn btn-danger">
              Limpar Formulário
            </button>
            <button type="submit" className="btn btn-success">
              Registrar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarAtividadePage;