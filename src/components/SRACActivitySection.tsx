// src/components/SRACActivitySection.tsx
import React, { useEffect, useState } from "react";
import { useFormContext, type FieldErrors } from "react-hook-form";
import { useCategoriaStore } from "../store/categoriaStore";
import type { CategoriaAtividade } from "../interfaces/Categoria";

export interface SRACActivityInput {
  numeroPedido: number;
  categoriaNome: string;
  horasDiasMeses: number;
  comprovantes: string;
}

interface SRACActivitySectionProps {
  index: number;
  onRemove: (index: number) => void;
  fieldPrefix: string;
  initialData?: SRACActivityInput;
}

const SRACActivitySection: React.FC<SRACActivitySectionProps> = ({
  index,
  onRemove,
  fieldPrefix,
  initialData,
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<any>(); // <--- Usando o tipo correto agora para SRACFormInputs

  const { getCategorias, getCategoriaByName } = useCategoriaStore();
  const categoriasDisponiveis = getCategorias();

  const selectedCategoryName = watch(`${fieldPrefix}.categoriaNome`) as string | undefined;
  const currentComprovantesWatch = watch(`${fieldPrefix}.comprovantes`) as string | undefined;

  const [selectedCategory, setSelectedCategory] = useState<
    CategoriaAtividade | undefined
  >(undefined);

  useEffect(() => {
    if (selectedCategoryName) {
      const foundCategory = getCategoriaByName(selectedCategoryName);
      setSelectedCategory(foundCategory);
    } else {
      setSelectedCategory(undefined);
    }
  }, [selectedCategoryName, getCategoriaByName]);

  useEffect(() => {
    // Note: initialData é usado apenas para valores iniciais quando o componente é montado.
    // As atualizações subsequentes vêm via watch do react-hook-form.
    // Não é necessário preencher initialData aqui se o formulário principal já estiver sendo inicializado
    // com os dados do store ou prefilledData.
    if (initialData) {
        // Isso garante que, se o initialData for fornecido (ex: ao carregar de atividades concluídas),
        // ele seja corretamente aplicado aos campos.
        setValue(`${fieldPrefix}.numeroPedido`, initialData.numeroPedido);
        setValue(`${fieldPrefix}.categoriaNome`, initialData.categoriaNome);
        setValue(`${fieldPrefix}.horasDiasMeses`, initialData.horasDiasMeses);
        setValue(`${fieldPrefix}.comprovantes`, initialData.comprovantes);
    }
  }, [initialData, fieldPrefix, setValue]);

  const hasComprovante = !!currentComprovantesWatch;
  const comprovanteFileName = currentComprovantesWatch || "";

  // A validação muda: agora verifica se o campo de texto está preenchido
  const validateComprovante = (value: string) => {
    if (!value || value.trim() === "") {
      return "É obrigatório informar o comprovante para esta atividade.";
    }
    return true;
  };

  // Correção aqui: a tipagem do errors precisa ser mais específica para o array
  const activityErrors = (errors.atividades || {}) as FieldErrors<SRACActivityInput>;


  return (
    <div className="p-4 border rounded shadow-sm bg-light text-dark mb-4 position-relative">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="btn-close position-absolute top-0 end-0 m-2"
        aria-label="Remover atividade"
      >
      </button>

      {/* Campo: Número do Pedido */}
      <div className="mb-3">
        <label htmlFor={`${fieldPrefix}.numeroPedido`} className="form-label">
          Número do Pedido
        </label>
        <input
          type="text"
          className="form-control"
          id={`${fieldPrefix}.numeroPedido`}
          // O valor é sempre `index + 1` para manter a numeração sequencial na UI
          value={index + 1}
          readOnly
          // Registrar para que o valor seja incluído na submissão, mas readOnly impede edição
          {...register(`${fieldPrefix}.numeroPedido`)}
        />
        <small className="form-text text-muted">
          (numerar sequencialmente)
        </small>
      </div>

      <div className="mb-3">
        <label htmlFor={`${fieldPrefix}.categoriaNome`} className="form-label">
          Categoria de Atividade <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${
            activityErrors?.categoriaNome ? "is-invalid" : ""
          }`}
          id={`${fieldPrefix}.categoriaNome`}
          {...register(`${fieldPrefix}.categoriaNome`, {
            required: "Categoria é obrigatória.",
          })}
        >
          <option value="">Selecione uma categoria...</option>
          {categoriasDisponiveis.map((cat: CategoriaAtividade, idx: number) => (
            <option key={idx} value={cat.nome}>
              {cat.nome}
            </option>
          ))}
        </select>
        {activityErrors?.categoriaNome && (
          <div className="invalid-feedback">
            {activityErrors.categoriaNome.message}
          </div>
        )}
      </div>

      {/* Campo: Comprovante(s) Anexado(s) */}
      <div className="mb-3">
        <label htmlFor={`${fieldPrefix}.comprovantes`} className="form-label">
          Comprovante(s) Anexado(s) <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${
            activityErrors?.comprovantes ? "is-invalid" : ""
          }`}
          id={`${fieldPrefix}.comprovantes`}
          placeholder="Ex: Certificado do Workshop X, ou URL do comprovante"
          {...register(`${fieldPrefix}.comprovantes`, {
            required: "É obrigatório informar o comprovante para esta atividade.",
            validate: validateComprovante,
          })}
        />
        {activityErrors?.comprovantes && (
          <div className="invalid-feedback d-block">
            {activityErrors.comprovantes.message}
          </div>
        )}
        {hasComprovante && (
          <div className="form-text text-success mt-2">
            Comprovante informado: <strong>{comprovanteFileName}</strong>
          </div>
        )}
        {!hasComprovante && (
          <div className="form-text text-muted mt-2">
            Informe o nome do comprovante (ex: certificado, declaração, etc.) ou uma URL.
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor={`${fieldPrefix}.horasDiasMeses`} className="form-label">
          {selectedCategory
            ? `Duração da Atividade (em ${selectedCategory.unidadeDeTempo})`
            : "Duração da Atividade (Horas/Dias/Meses cursados)"}{" "}
          <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          className={`form-control ${
            activityErrors?.horasDiasMeses ? "is-invalid" : ""
          }`}
          id={`${fieldPrefix}.horasDiasMeses`}
          {...register(`${fieldPrefix}.horasDiasMeses`, {
            required: "Duração é obrigatória.",
            min: { value: 0.1, message: "Duração deve ser positiva." },
            valueAsNumber: true,
          })}
          min="0.1"
          step="0.1"
          disabled={!selectedCategory}
          placeholder={!selectedCategory ? "Escolha a categoria primeiro" : ""}
        />
        {activityErrors?.horasDiasMeses && (
          <div className="invalid-feedback">
            {activityErrors.horasDiasMeses.message}
          </div>
        )}
        {!selectedCategory && (
          <small className="form-text text-muted">
            Por favor, selecione uma categoria para habilitar este campo.
          </small>
        )}
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default SRACActivitySection;