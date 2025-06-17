// src/components/ActivityForm.tsx
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { useCategoriaStore } from "../store/categoriaStore";
import type { CategoriaAtividade } from "../interfaces/Categoria";

// Definir as interfaces de input fora do componente para reutilização
export interface ActivityFormInputs {
  nome: string;
  descricao: string;
  inicio: string;
  fim: string;
  responsavel: string;
  duracao: number;
  categoriaNome: string;
  certificado?: FileList; // Alterado para FileList para corresponder ao input type="file"
}

// Props que o componente ActivityForm vai receber
interface ActivityFormProps {
  onSubmit: SubmitHandler<ActivityFormInputs>; // Função de submissão do formulário
  onClear: () => void; // Função para limpar o formulário
  precisaCertificado?: boolean; // Corrigido o erro de digitação para 'precisaCertificado'
  prefilledData?: ActivityFormInputs; // NOVA PROP: dados para pré-preencher
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  onSubmit,
  onClear,
  precisaCertificado = true,
  prefilledData, // Recebendo a nova prop
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ActivityFormInputs>({
    defaultValues: prefilledData, // Inicializa o formulário com os dados pré-preenchidos
  });

  // Acessar o store de categorias
  const { getCategorias, getCategoriaByName } = useCategoriaStore();
  const categoriasDisponiveis = getCategorias(); // Pega as categorias do store

  // Monitorar a seleção da categoria em tempo real
  const selectedCategoryName = watch("categoriaNome");
  const currentCertificado = watch("certificado"); // Observar o campo de certificado

  // Estado para armazenar o objeto CategoriaAtividade completo
  const [selectedCategory, setSelectedCategory] = useState<
    CategoriaAtividade | undefined
  >(undefined);

  // useEffect para atualizar a categoria selecionada quando selectedCategoryName mudar
  useEffect(() => {
    if (selectedCategoryName) {
      const foundCategory = getCategoriaByName(selectedCategoryName);
      setSelectedCategory(foundCategory);
    } else {
      setSelectedCategory(undefined);
    }
  }, [selectedCategoryName, getCategoriaByName]);

  // useEffect para lidar com a prop prefilledData e resetar o formulário.
  // IMPORTANTE: O reset não vai "preencher" o input type="file" visualmente
  // mas garantirá que os outros campos e os dados do certificado no estado do hook-form estejam corretos.
  useEffect(() => {
    if (prefilledData) {
      reset(prefilledData);
    } else {
      // Se não há dados pré-preenchidos, zera o formulário
      reset({
        nome: "",
        descricao: "",
        inicio: "",
        fim: "",
        responsavel: "",
        duracao: 0,
        categoriaNome: "",
        // Não resetar certificado para undefined aqui se já tiver um selecionado manualmente
        // ou se for um reset de "limpar formulário". O handleInternalClear já faz isso.
      });
    }
  }, [prefilledData, reset]);


  // Função interna para lidar com o reset do formulário e da categoria selecionada
  const handleInternalClear = () => {
    reset({
      nome: "",
      descricao: "",
      inicio: "",
      fim: "",
      responsavel: "",
      duracao: 0,
      categoriaNome: "",
      certificado: undefined, // Limpa o certificado explicitamente
    });
    setSelectedCategory(undefined);
    onClear(); // Chamar a função onClear passada via props (se houver lógica adicional na página pai)
  };

  // Determinar se há um certificado pré-preenchido ou selecionado
  const hasCertificado = (prefilledData?.certificado && prefilledData.certificado.length > 0) ||
                         (currentCertificado && currentCertificado.length > 0);
  const certificadoFileName = prefilledData?.certificado?.[0]?.name || currentCertificado?.[0]?.name;


  return (
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
                !value ||
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
          {categoriasDisponiveis.map((cat: CategoriaAtividade, index: number) => (
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
            required: selectedCategory ? "Duração é obrigatória." : false,
            min: { value: 1, message: "Duração deve ser positiva." },
            valueAsNumber: true,
          })}
          min="1"
          disabled={!selectedCategory}
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

      {precisaCertificado && (
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
          {hasCertificado && (
            <div className="form-text text-success mt-2">
              Certificado anexado: **{certificadoFileName}** (Você pode enviar um novo para substituir)
            </div>
          )}
          {!hasCertificado && prefilledData?.certificado && ( // Se houver dados pré-preenchidos mas não visualmente no campo
             <div className="form-text text-info mt-2">
               Certificado pronto para ser anexado após a submissão (detectado via IA).
             </div>
          )}
        </div>
      )}

      <div className="d-flex justify-content-between mt-4">
        <button
          type="button"
          onClick={handleInternalClear}
          className="btn btn-danger"
        >
          Limpar Formulário
        </button>
        <button type="submit" className="btn btn-success">
          Registrar Atividade
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;