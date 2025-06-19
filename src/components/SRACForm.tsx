import {
  useForm,
  useFieldArray,
  FormProvider,
  type SubmitHandler,
} from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import SRACActivitySection, {
  type SRACActivityInput,
} from "./SRACActivitySection";
import React, { useEffect, useRef } from "react";
import type { Usuario } from "../interfaces/Usuario";
import { useSRACFormStore } from "../store/sracFormStore";

// Definir a interface completa do formulário SRAC
export interface SRACFormInputs {
  nomeAluno: string; // Eu, [nome]
  matriculaAluno: string; // matrícula [numero]
  telefoneContato: string; // telefone ( )
  emailContato: string; // e-mail
  paginasPedido: number; // página(s) de pedido(s)
  paginasComprovantes: number; // página(s) de comprovante(s)
  atividades: SRACActivityInput[]; // Array de atividades
}

interface SRACFormProps {
  onSubmit: SubmitHandler<SRACFormInputs>;
  onCancel?: () => void;
  prefilledData?: SRACFormInputs; // Para edição ou pré-preenchimento pelo pai
  usuario?: Usuario; // Adicionando a prop de usuário - pode ser útil para outras lógicas, mas o preenchimento inicial vem de prefilledData
}

const SRACForm: React.FC<SRACFormProps> = ({
  onSubmit,
  onCancel,
  prefilledData, // Agora é a principal fonte de dados iniciais do pai
  usuario, // Mantido para futuras referências ou lógicas internas do form
}) => {
  // Use o SRACFormStore
  const { formData: storedFormData, clearFormData } = useSRACFormStore();

  // Use useRef para armazenar os defaultValues para evitar recálculos excessivos
  const defaultValuesRef = useRef<SRACFormInputs | null>(null);

  // Calcule os defaultValues apenas uma vez ou quando prefilledData/storedFormData mudar
  // Prioridade: prefilledData (props) > storedFormData (Zustand) > dados do usuário > valores padrão
  if (defaultValuesRef.current === null || prefilledData !== undefined || storedFormData !== null) {
    defaultValuesRef.current = prefilledData || storedFormData || {
      nomeAluno: usuario?.nome || "", // Fallback para usuário se nada mais for fornecido
      matriculaAluno: usuario?.matricula || "",
      telefoneContato: usuario?.telefone || "",
      emailContato: usuario?.email || "",
      paginasPedido: 1, // Padrão se não houver dados iniciais
      paginasComprovantes: 0,
      atividades: [
        {
          numeroPedido: 1,
          categoriaNome: "",
          horasDiasMeses: 0,
          comprovantes: "",
        },
      ],
    };
  }

  const methods = useForm<SRACFormInputs>({
    defaultValues: defaultValuesRef.current || { // Garante um objeto fallback se defaultValuesRef.current for null
      nomeAluno: "",
      matriculaAluno: "",
      telefoneContato: "",
      emailContato: "",
      paginasPedido: 1,
      paginasComprovantes: 0,
      atividades: [
        {
          numeroPedido: 1,
          categoriaNome: "",
          horasDiasMeses: 0,
          comprovantes: "",
        },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "atividades",
  });

  const watchedAtividades = watch("atividades");

  // Não salva mais no store ao desmontar.
  // Apenas a chamada handleSubmit(onSubmit) vai acionar o onSubmit da prop,
  // que por sua vez chama setSracFormData em PreFormularioPage.tsx

  useEffect(() => {
    // Re-indexar numeroPedido: Garante que os números das atividades estejam sequenciais
    fields.forEach((_, idx) => {
      if (getValues(`atividades.${idx}.numeroPedido`) !== idx + 1) {
        setValue(`atividades.${idx}.numeroPedido`, idx + 1);
      }
    });

    // Atualizar paginasPedido com base no número de atividades
    const numAtividades = watchedAtividades.length;
    const paginasCalculadas = Math.max(1, Math.ceil(numAtividades / 3));

    if (getValues("paginasPedido") !== paginasCalculadas) {
      setValue("paginasPedido", paginasCalculadas, { shouldValidate: true });
    }
  }, [fields, watchedAtividades, setValue, getValues]);

  const handleAddActivity = () => {
    append({
      numeroPedido: fields.length + 1,
      categoriaNome: "",
      horasDiasMeses: 0,
      comprovantes: "",
    });
  };

  const handleRemoveActivity = (indexToRemove: number) => {
    remove(indexToRemove);
  };

  const handleClearForm = () => {
    // Resetar para os defaultValues iniciais
    // Forneça um objeto fallback vazio se defaultValuesRef.current for null
    reset(defaultValuesRef.current || {
      nomeAluno: "",
      matriculaAluno: "",
      telefoneContato: "",
      emailContato: "",
      paginasPedido: 1,
      paginasComprovantes: 0,
      atividades: [
        {
          numeroPedido: 1,
          categoriaNome: "",
          horasDiasMeses: 0,
          comprovantes: "",
        },
      ],
    });
    clearFormData(); // Limpa os dados do store Zustand
    if (onCancel) {
      onCancel(); // Chama a função onCancel da prop, se houver
    }
  };

  return (
    <FormProvider {...methods}>
      {/* Fornece o contexto do formulário para os filhos */}
      <form
        onSubmit={handleSubmit(onSubmit)} // O onSubmit da prop será chamado apenas ao clicar no botão de submit
        className="p-4 border rounded shadow-sm text-dark bg-light"
      >
        <h2 className="mb-4 text-center">
          SOLICITAÇÃO DE REGISTRO DE ATIVIDADE COMPLEMENTAR (SRAC)
        </h2>

        <div className="text-center mb-4">
          <p>
            <strong>Universidade Federal Fluminense</strong>
          </p>
          <p>
            <strong>Instituto de Computação</strong>
          </p>
          <p>
            <strong>Bacharelado em Ciência da Computação</strong>
          </p>
        </div>

        <div className="mb-4 p-3 border rounded bg-white">
          <h4 className="mb-3">Dados do Discente</h4>
          <div className="row mb-3">
            <div className="col-md-8">
              <label htmlFor="nomeAluno" className="form-label">
                Eu,
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.nomeAluno ? "is-invalid" : ""
                }`}
                id="nomeAluno"
                placeholder="Seu nome completo"
                {...methods.register("nomeAluno", {
                  required: "Nome é obrigatório.",
                })}
              />
              {errors.nomeAluno && (
                <div className="invalid-feedback">
                  {errors.nomeAluno.message}
                </div>
              )}
            </div>
            <div className="col-md-4">
              <label htmlFor="matriculaAluno" className="form-label">
                Matrícula
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.matriculaAluno ? "is-invalid" : ""
                }`}
                id="matriculaAluno"
                placeholder="Ex: 123456789"
                {...methods.register("matriculaAluno", {
                  required: "Matrícula é obrigatória.",
                })}
              />
              {errors.matriculaAluno && (
                <div className="invalid-feedback">
                  {errors.matriculaAluno.message}
                </div>
              )}
            </div>
          </div>

          <p className="mb-3">
            solicito à Comissão de Análise de SRAC a aprovação das atividades
            descritas neste pedido.
          </p>

          <h5 className="mb-3 mt-4">Informações de Contato</h5>
          <p className="mb-1">
            Para esclarecer qualquer dúvida que possa vir a surgir, deixo:
          </p>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="telefoneContato" className="form-label">
                Telefone
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.telefoneContato ? "is-invalid" : ""
                }`}
                id="telefoneContato"
                placeholder="(DDD) XXXXX-XXXX"
                {...methods.register("telefoneContato", {
                  required: "Telefone é obrigatório.",
                })}
              />
              {errors.telefoneContato && (
                <div className="invalid-feedback">
                  {errors.telefoneContato.message}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="emailContato" className="form-label">
                E-mail
              </label>
              <input
                type="email"
                className={`form-control ${
                  errors.emailContato ? "is-invalid" : ""
                }`}
                id="emailContato"
                placeholder="seu.email@exemplo.com"
                {...methods.register("emailContato", {
                  required: "E-mail é obrigatório.",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Formato de e-mail inválido.",
                  },
                })}
              />
              {errors.emailContato && (
                <div className="invalid-feedback">
                  {errors.emailContato.message}
                </div>
              )}
            </div>
          </div>

          <h5 className="mb-3 mt-4">Páginas da Solicitação</h5>
          <p className="mb-1">Declaro que esta solicitação contém:</p>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="paginasPedido" className="form-label">
                Página(s) de Pedido(s)
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.paginasPedido ? "is-invalid" : ""
                }`}
                id="paginasPedido"
                min="1"
                // O campo agora é controlado pelo useEffect, mas ainda precisa do register para validação e submissão
                {...methods.register("paginasPedido", {
                  required: "Número de páginas de pedido é obrigatório.",
                  min: {
                    value: 1,
                    message: "Deve haver pelo menos 1 página de pedido.",
                  },
                  valueAsNumber: true,
                })}
                readOnly
              />
              {errors.paginasPedido && (
                <div className="invalid-feedback">
                  {errors.paginasPedido.message}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="paginasComprovantes" className="form-label">
                Página(s) de Comprovante(s)
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.paginasComprovantes ? "is-invalid" : ""
                }`}
                id="paginasComprovantes"
                min="0"
                {...methods.register("paginasComprovantes", {
                  required: "Número de páginas de comprovantes é obrigatório.",
                  min: { value: 0, message: "Não pode ser negativo." },
                  valueAsNumber: true,
                })}
              />
              {errors.paginasComprovantes && (
                <div className="invalid-feedback">
                  {errors.paginasComprovantes.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 className="mb-3 mt-5 text-center">
          Relação de Pedidos de Atividades
        </h3>
        <p className="text-center text-muted mb-4">
          Inclua todas as atividades complementares que deseja registrar. Cada
          atividade deve ter seus próprios detalhes e comprovantes.
        </p>

        {fields.map((field, index) => (
          <SRACActivitySection
            key={field.id}
            index={index}
            onRemove={handleRemoveActivity}
            fieldPrefix={`atividades.${index}`}
            // initialData={field as SRACActivityInput} // Remova esta linha se não precisar de re-inicialização
          />
        ))}

        <button
          type="button"
          onClick={handleAddActivity}
          className="btn btn-outline-primary w-100 mb-4 d-flex align-items-center justify-content-center"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="me-2" /> Adicionar
          Outra Atividade
        </button>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            onClick={handleClearForm}
            className="btn btn-danger"
          >
            Limpar Formulário
          </button>
          <button type="submit" className="btn btn-success">
            Salvar formulário
          </button>
        </div>

        <div className="mt-5 p-3 border rounded bg-light text-muted small">
          <h5 className="mb-2">Instruções Gerais:</h5>
          <ul>
            <li>
              Apenas a versão vigente do formulário será aceita para análise. É
              obrigação do discente obter a versão correta na página do curso.{" "}
            </li>
            <li>
              O discente deve preencher todos os campos indicados como de sua
              responsabilidade.{" "}
            </li>
            <li>
              O discente deve anexar todos os comprovantes das atividades
              indicadas.{" "}
            </li>
            <li>
              As categorias de atividades complementares correspondem à primeira
              coluna do Anexo I da resolução que regulamenta Atividades
              Complementares.{" "}
            </li>
            <li>
              Horas/dias/meses cursados correspondem ao tempo comprovado de
              dedicação à atividade.{" "}
            </li>
            <li>
              O formulário deve ser preenchido com a unidade de tempo que consta
              na segunda coluna do Anexo I supracitado.{" "}
            </li>
          </ul>
        </div>
      </form>
    </FormProvider>
  );
};

export default SRACForm;