// src/components/ActivityForm.tsx
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { useCategoriaStore } from "../store/categoriaStore";
import type { CategoriaAtividade } from "../interfaces/Categoria";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Função auxiliar para obter a data de hoje no formato YYYY-MM-DD
// ESSENCIAL para input type="date"
const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado, então adicionamos 1
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // Formato corrigido para YYYY-MM-DD
};

// Definir as interfaces de input fora do componente para reutilização
export interface ActivityFormInputs {
  nome: string;
  descricao: string;
  inicio: string;
  fim: string;
  responsavel: string;
  duracao: number;
  categoriaNome: string;
  certificado?: FileList | null;
}

// Props que o componente ActivityForm vai receber
interface ActivityFormProps {
  onSubmit: SubmitHandler<ActivityFormInputs>;
  onClear: () => void;
  precisaCertificado?: boolean;
  prefilledData?: ActivityFormInputs;
  isEditing?: boolean;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  onSubmit,
  onClear,
  precisaCertificado = true,
  prefilledData,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ActivityFormInputs>({
    // Define os valores padrão iniciais do formulário
    defaultValues: prefilledData
      ? prefilledData
      : {
          nome: "",
          descricao: "",
          inicio: getTodayDate(), // Padrão: data de hoje (formato YYYY-MM-DD)
          fim: "", // Adicionado campo 'fim'
          responsavel: "",
          duracao: 1, // Padrão: 1
          categoriaNome: "", // Adicionado campo 'categoriaNome'
          certificado: null, // Adicionado campo 'certificado'
        },
  });

  const { getCategorias, getCategoriaByName } = useCategoriaStore();
  const categoriasDisponiveis = getCategorias();

  const selectedCategoryName = watch("categoriaNome");
  const currentCertificadoWatch = watch("certificado");

  const [selectedCategory, setSelectedCategory] = useState<
    CategoriaAtividade | undefined
  >(undefined);

  const [showCertificadoUpload, setShowCertificadoUpload] = useState(
    (prefilledData?.certificado instanceof FileList && prefilledData.certificado.length > 0) || false
  );

  useEffect(() => {
    if (selectedCategoryName) {
      const foundCategory = getCategoriaByName(selectedCategoryName);
      setSelectedCategory(foundCategory);
    } else {
      setSelectedCategory(undefined);
    }
  }, [selectedCategoryName, getCategoriaByName]);

  // useEffect para lidar com a prop prefilledData e resetar o formulário.
  useEffect(() => {
    if (prefilledData) {
      reset(prefilledData);
      if (prefilledData.certificado instanceof FileList && prefilledData.certificado.length > 0) {
        setShowCertificadoUpload(true);
      }
    } else if (!isEditing) {
      // Reseta para os valores padrão customizados (para um novo formulário)
      reset({
        nome: "",
        descricao: "",
        inicio: getTodayDate(), // Define para hoje ao resetar
        fim: "", // Incluído
        responsavel: "",
        duracao: 1, // Define para 1 ao resetar
        categoriaNome: "", // Incluído
        certificado: null, // Incluído
      });
      setShowCertificadoUpload(false);
    }
  }, [prefilledData, reset, isEditing]);

  // Função interna para lidar com o reset do formulário e da categoria selecionada
  const handleInternalClear = () => {
    reset({
      nome: "",
      descricao: "",
      inicio: getTodayDate(), // Define para hoje ao limpar
      fim: "", // Incluído
      responsavel: "",
      duracao: 1, // Define para 1 ao limpar
      categoriaNome: "", // Incluído
      certificado: null, // Incluído
    });
    setSelectedCategory(undefined);
    setShowCertificadoUpload(false);
    onClear();
  };

  const prefilledCertificado =
    prefilledData?.certificado instanceof FileList &&
    prefilledData.certificado.length > 0
      ? prefilledData.certificado
      : null;

  const newCertificadoSelected =
    currentCertificadoWatch && currentCertificadoWatch.length > 0;

  const hasCertificado = !!prefilledCertificado || newCertificadoSelected;

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
      {/* Seção 1: Informações Essenciais da Atividade */}
      <fieldset className="mb-4 p-3 border rounded bg-white">
        <legend className="h5 fw-bold mb-3">
          1. Detalhes da Atividade
        </legend>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome da Atividade
          </label>
          <input
            type="text"
            className={`form-control ${errors.nome ? "is-invalid" : ""}`}
            id="nome"
            placeholder="Ex.: Workshop: Redação de Artigos Científicos"
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
            placeholder="Ex: Orientações práticas para a escrita e formatação de artigos científicos."
            rows={3}
            {...register("descricao")}
          ></textarea>
          {errors.descricao && (
            <div className="invalid-feedback">{errors.descricao.message}</div>
          )}
        </div>
      </fieldset>

      {/* Seção 2: Período e Responsável */}
      <fieldset className="mb-4 p-3 border rounded bg-white">
        <legend className="h5 fw-bold mb-3">
          2. Período e Responsável
        </legend>
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
      </fieldset>

      {/* Seção 3: Categorização e Duração */}
      <fieldset className="mb-4 p-3 border rounded bg-white">
        <legend className="h5 fw-bold mb-3">
          3. Classificação e Duração
        </legend>
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
      </fieldset>

      {/* Seção 4: Upload de Certificado (colapsável para reduzir a complexidade visual inicial) */}
      {precisaCertificado && (
        <fieldset className="mb-4 p-3 border rounded bg-white">
          <legend
            className="h5 fw-bold mb-3 cursor-pointer"
            onClick={() => setShowCertificadoUpload(!showCertificadoUpload)}
            style={{ cursor: "pointer" }}
          >
            4. Certificado (Opcional)
            <span className="ms-2">
              <FontAwesomeIcon icon={showCertificadoUpload ? faChevronUp : faChevronDown} />
            </span>
          </legend>

          {showCertificadoUpload && (
            <>
              <div className="mb-3">
                <label htmlFor="certificado" className="form-label">
                  Upload do Certificado (PDF, Imagem)
                </label>
                <input
                  type="file"
                  className={`form-control ${
                    errors.certificado ? "is-invalid" : ""
                  }`}
                  id="certificado"
                  {...register("certificado")}
                  accept=".pdf, .jpg, .jpeg, .png"
                />
                {errors.certificado && (
                  <div className="invalid-feedback">
                    {errors.certificado.message}
                  </div>
                )}
                {hasCertificado && (
                  <div className="form-text text-success mt-2">
                    Certificado anexado:{" "}
                    <strong>{certificadoFileName}</strong> (Você pode enviar um
                    novo para substituir)
                  </div>
                )}
                {!hasCertificado && (
                  <div className="form-text text-muted mt-2">
                    Nenhum arquivo selecionado.
                  </div>
                )}
              </div>
              <small className="form-text text-muted">
                Anexe o comprovante da atividade (ex: certificado, declaração)
                para validar as horas. Formatos aceitos: PDF, JPG, PNG.
              </small>
            </>
          )}
        </fieldset>
      )}

      {/* Botões de Ação */}
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