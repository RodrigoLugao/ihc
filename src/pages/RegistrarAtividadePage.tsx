import { useForm, type SubmitHandler } from "react-hook-form";
// import type { Atividade } from "../interfaces/Atividade"; // Removido, não usado diretamente aqui para evitar conflito de nome
import { categoriasData, type CategoriaAtividade } from "../interfaces/Categoria";

interface ActivityFormInputs {
  nome: string;
  descricao: string;
  inicio: string;
  fim: string;
  responsavel: string;
  cargaHoraria: number;
  categoriaTipo: string;
  certificado?: FileList;
}

const RegistrarAtividadePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // <-- Adicionado: Desestrutura a função reset do useForm
  } = useForm<ActivityFormInputs>();

  // NOTE: Assuming categoriasData is an array of CategoriaAtividade objects
  // If categoriasData is not available, you might need to import `atividadesData`
  // and then extract unique categories from it, as in the previous example.
  // const allCategories = Array.from(new Set(atividadesData.map(atividade => JSON.stringify(atividade.categoria)))).map(str => JSON.parse(str as string));


  const onSubmit: SubmitHandler<ActivityFormInputs> = (data) => {
    const selectedCategory = categoriasData.find( // Use categoriasData diretamente
      (cat: CategoriaAtividade) => cat.tipo === data.categoriaTipo
    );

    if (!selectedCategory) {
      alert("Por favor, selecione uma categoria válida.");
      return;
    }

    const newId = Date.now();

    const novaAtividade = { // type Atividade
      id: newId,
      nome: data.nome,
      descricao: data.descricao,
      inicio: new Date(data.inicio),
      fim: new Date(data.fim),
      responsavel: data.responsavel,
      cargaHoraria: Number(data.cargaHoraria),
      categoria: selectedCategory,
    };

    console.log("Dados da Nova Atividade (pronto para enviar):", novaAtividade);
    console.log(
      "Certificado (se selecionado):",
      data.certificado ? data.certificado[0] : "Nenhum"
    );

    alert("Formulário preenchido e dados logados no console!");
    reset(); // <-- Chamada simples para resetar todos os campos para os valores padrão (vazios neste caso)
             // Ou resetar para valores específicos, como mostrado abaixo.
  };

  // --- Função handleClear corrigida ---
  const handleClear = () => {
    reset({ // Reseta o formulário com valores vazios para todos os campos relevantes
      nome: '',
      descricao: '',
      inicio: '',
      fim: '',
      responsavel: '',
      cargaHoraria: 0, // Ou '' se preferir que o campo numérico comece vazio
      categoriaTipo: '',
      certificado: undefined, // Para limpar o input de arquivo
    });
    // Se você tinha uma função 'onClear' externa que precisava ser chamada, adicione-a aqui.
    // Caso contrário, remova a linha 'onClear();'
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
              rows={3}
              {...register("descricao")} // Adicione validação 'required' se necessário
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
                  required: "Data de fim é obrigatória.",
                  validate: (value, formValues) =>
                    value >= formValues.inicio ||
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

          <div className="mb-3">
            <label htmlFor="cargaHoraria" className="form-label">
              Carga Horária Total da Atividade (horas)
            </label>
            <input
              type="number"
              className={`form-control ${
                errors.cargaHoraria ? "is-invalid" : ""
              }`}
              id="cargaHoraria"
              {...register("cargaHoraria", {
                required: "Carga horária é obrigatória.",
                min: { value: 1, message: "Carga horária deve ser positiva." },
                valueAsNumber: true,
              })}
              min="1"
            />
            {errors.cargaHoraria && (
              <div className="invalid-feedback">
                {errors.cargaHoraria.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="categoriaTipo" className="form-label">
              Categoria da Atividade
            </label>
            <select
              className={`form-select ${
                errors.categoriaTipo ? "is-invalid" : ""
              }`}
              id="categoriaTipo"
              {...register("categoriaTipo", {
                required: "Categoria é obrigatória.",
              })}
            >
              <option value="">Selecione uma categoria...</option>
              {categoriasData.map((cat: CategoriaAtividade, index: number) => ( // Usando categoriasData
                <option key={index} value={cat.tipo}>
                  {cat.tipo}
                </option>
              ))}
            </select>
            {errors.categoriaTipo && (
              <div className="invalid-feedback">
                {errors.categoriaTipo.message}
              </div>
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
          <div className="d-flex justify-content-between mt-4"> {/* Ajuste aqui para posicionar os botões */}
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