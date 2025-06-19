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
  certificado?: FileList | null; // Alterado para FileList | null
}

// Props que o componente ActivityForm vai receber
interface ActivityFormProps {
  onSubmit: SubmitHandler<ActivityFormInputs>; // Função de submissão do formulário
  onClear: () => void; // Função para limpar o formulário
  precisaCertificado?: boolean;
  prefilledData?: ActivityFormInputs; // NOVA PROP: dados para pré-preencher
  isEditing?: boolean; // NOVO: Flag para indicar modo de edição
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  onSubmit,
  onClear,
  precisaCertificado = true,
  prefilledData, // Recebendo a nova prop
  isEditing = false, // Default false
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
  const currentCertificadoWatch = watch("certificado"); // Observar o campo de certificado

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
  // IMPORTANTE: Adicionei a verificação de `isEditing` para garantir que o reset não zere acidentalmente ao mudar de rota sem `prefilledData` no modo de edição.
  useEffect(() => {
    if (prefilledData) {
      reset(prefilledData);
    } else if (!isEditing) { // Só reseta para vazio se não for edição e não houver prefilledData
      reset({
        nome: "",
        descricao: "",
        inicio: "",
        fim: "",
        responsavel: "",
        duracao: 0,
        categoriaNome: "",
        certificado: null, // Limpa o certificado explicitamente para null
      });
    }
  }, [prefilledData, reset, isEditing]); // Adicionado isEditing como dependência

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
      certificado: null, // Limpa o certificado explicitamente para null
    });
    setSelectedCategory(undefined);
    onClear(); // Chamar a função onClear passada via props (se houver lógica adicional na página pai)
  };

  // Lógica para determinar se há um certificado e qual o seu nome
  // Se estiver no modo de edição, `prefilledData.certificado` pode ser uma string ou FileList.
  // Precisamos verificar o tipo ou como ele é passado.
  // Assumindo que `prefilledData.certificado` é uma FileList se for pré-preenchido do store (já que `ActivityFormInputs` espera FileList)
  // Ou que `prefilledData` pode vir com o `comprovante` como string na `EditarAtividadePage`.
  // Para simplificar, vamos considerar que `prefilledData.certificado` é FileList ou null/undefined.
  // Se você for passar o nome do comprovante como uma string de `/uploads/nome.pdf`, precisaremos adaptar essa lógica.
  // Por enquanto, vou manter a lógica que espera `FileList`. Se vier uma string, precisaremos criar um `FileList` mock ou ajustar a prop.

  // Reavaliando a lógica do certificado:
  // Se prefilledData existe e tem certificado (FileList):
  const prefilledCertificado = prefilledData?.certificado instanceof FileList && prefilledData.certificado.length > 0
    ? prefilledData.certificado
    : null;

  // Se o usuário selecionou um NOVO certificado no formulário:
  const newCertificadoSelected = currentCertificadoWatch && currentCertificadoWatch.length > 0;

  // Determina se há um certificado atual (pré-preenchido ou recém-selecionado)
  const hasCertificado = !!prefilledCertificado || newCertificadoSelected;

  // Determina o nome do arquivo do certificado para exibição
  const certificadoFileName = newCertificadoSelected
    ? currentCertificadoWatch![0].name
    : prefilledCertificado
    ? prefilledCertificado[0].name
    : "";


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
          Descrição (Opcional)
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
            Data de Fim (Opcional)
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
              Certificado anexado: <strong>{certificadoFileName}</strong> (Você pode enviar um novo para substituir)
            </div>
          )}
          {!hasCertificado && ( // Simplificado: se não tem certificado (nem pre-existente, nem novo selecionado)
            <div className="form-text text-muted mt-2">
              Nenhum arquivo selecionado.
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
          {isEditing ? "Salvar Alterações" : "Registrar Atividade"}
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;