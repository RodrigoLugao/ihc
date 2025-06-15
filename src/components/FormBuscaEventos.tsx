// src/components/FormBuscaEventos.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CurriculoTipo } from '../utils/acutils';

// Interface para os dados do formulário de busca
export interface EventSearchForm {
  searchTerm: string;
  startDate: string;
  endDate: string;
  location: string;
  minHours: number | '';
  maxHours: number | '';
  categoriesInput: string;
  categories: string[];
  curriculoType: CurriculoTipo;
  // NOVO CAMPO: Categorias para EXCLUIR
  excludeCategoriesInput: string; // String bruta do input
  excludeCategories: string[];    // Array processado de categorias a excluir
}

interface FormBuscaEventosProps {
  onSearch: (data: EventSearchForm) => void;
  onClear: () => void;
  initialFormData: EventSearchForm | null;
}

const FormBuscaEventos: React.FC<FormBuscaEventosProps> = ({ onSearch, onClear, initialFormData }) => {
  const { register, handleSubmit, reset } = useForm<EventSearchForm>({
    defaultValues: {
      searchTerm: initialFormData?.searchTerm || '',
      startDate: initialFormData?.startDate || '',
      endDate: initialFormData?.endDate || '',
      location: initialFormData?.location || '',
      minHours: initialFormData?.minHours || '',
      maxHours: initialFormData?.maxHours || '',
      categoriesInput: initialFormData?.categoriesInput || '',
      categories: initialFormData?.categories || [],
      curriculoType: initialFormData?.curriculoType || 'curriculoNovo',
      // NOVO CAMPO: Define o valor padrão para excludeCategoriesInput
      excludeCategoriesInput: initialFormData?.excludeCategoriesInput || '',
      excludeCategories: initialFormData?.excludeCategories || [],
    }
  });

  useEffect(() => {
    if (initialFormData) {
      reset(initialFormData);
    } else {
      reset({
        searchTerm: '',
        startDate: '',
        endDate: '',
        location: '',
        minHours: '',
        maxHours: '',
        categoriesInput: '',
        categories: [],
        curriculoType: 'curriculoNovo',
        // NOVO CAMPO: Resetar excludeCategoriesInput
        excludeCategoriesInput: '',
        excludeCategories: [],
      });
    }
  }, [initialFormData, reset]);

  const hideCurriculoTypeSelect = initialFormData !== null && initialFormData.curriculoType !== undefined;

  const onSubmit = (data: EventSearchForm) => {
    // Processa categoriesInput
    data.categories = data.categoriesInput
      .split(',')
      .map(category => category.trim())
      .filter(category => category.length > 0)
      .map(category => category.toLowerCase());

    // NOVO: Processa excludeCategoriesInput
    data.excludeCategories = data.excludeCategoriesInput
      .split(',')
      .map(category => category.trim())
      .filter(category => category.length > 0)
      .map(category => category.toLowerCase());

    onSearch(data);
  };

  const handleClear = () => {
    reset({
      searchTerm: '',
      startDate: '',
      endDate: '',
      location: '',
      minHours: '',
      maxHours: '',
      categoriesInput: '',
      categories: [],
      curriculoType: 'curriculoNovo',
      // NOVO CAMPO: Limpar excludeCategoriesInput
      excludeCategoriesInput: '',
      excludeCategories: [],
    });
    onClear();
  };

  return (
    <div className="p-4 rounded shadow-sm" style={{ backgroundColor: '#2c3e50' }}>
      <h2 className="mb-4" style={{ fontWeight: 'bold', color: '#ecf0f1' }}>Buscar Eventos</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Seção de Informações do Evento */}
        <div className="mb-5">
          <h4 className="mb-3" style={{ fontWeight: 'bold', color: '#ecf0f1' }}>Informações do Evento</h4>
          <div className="mb-3">
            <label htmlFor="searchTerm" className="form-label text-light">Palavra-chave:</label>
            <input
              type="text"
              className="form-control"
              id="searchTerm"
              placeholder="Nome ou descrição do evento"
              {...register('searchTerm')}
            />
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="startDate" className="form-label text-light">Data de Início (a partir de):</label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                {...register('startDate')}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="endDate" className="form-label text-light">Data de Fim (até):</label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                {...register('endDate')}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label text-light">Local:</label>
            <input
              type="text"
              className="form-control"
              id="location"
              placeholder="Ex: Online, Niterói, UFF"
              {...register('location')}
            />
          </div>
        </div>

        {/* Seção de Atividades Complementares */}
        <div className="mb-4">
          <h4 className="mb-3" style={{ fontWeight: 'bold', color: '#ecf0f1' }}>Filtros de Atividades Complementares</h4>

          {!hideCurriculoTypeSelect && (
            <div className="mb-3">
              <label htmlFor="curriculoType" className="form-label text-light">Tipo de Currículo para AC:</label>
              <select
                className="form-select"
                id="curriculoType"
                {...register('curriculoType')}
              >
                <option value="curriculoNovo">Currículo Novo</option>
                <option value="curriculoAntigo">Currículo Antigo</option>
              </select>
            </div>
          )}

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="minHours" className="form-label text-light">Horas Mínimas (AC Atividade):</label>
              <input
                type="number"
                className="form-control"
                id="minHours"
                placeholder="Ex: 5"
                {...register('minHours', { valueAsNumber: true })}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="maxHours" className="form-label text-light">Horas Máximas (AC Atividade):</label>
              <input
                type="number"
                className="form-control"
                id="maxHours"
                placeholder="Ex: 20"
                {...register('maxHours', { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="categoriesInput" className="form-label text-light">Incluir Categorias de Atividade AC:</label>
            <input
              type="text"
              className="form-control"
              id="categoriesInput"
              placeholder="Ex: Palestra, Workshop, Iniciação Científica"
              {...register('categoriesInput')}
            />
            <small className="form-text text-light opacity-75">
              Separe múltiplas categorias por vírgula. A busca não diferencia maiúsculas de minúsculas e é parcial.
            </small>
          </div>

          {/* NOVO CAMPO: Excluir Categorias */}
          <div className="mb-4">
            <label htmlFor="excludeCategoriesInput" className="form-label text-light">Excluir Categorias de Atividade AC:</label>
            <input
              type="text"
              className="form-control"
              id="excludeCategoriesInput"
              placeholder="Ex: Esporte, Cultura, Voluntariado"
              {...register('excludeCategoriesInput')}
            />
            <small className="form-text text-light opacity-75">
              Separe múltiplas categorias por vírgula para excluí-las dos resultados.
            </small>
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100">Buscar</button>
        <button
          type="button"
          className="btn btn-secondary w-100 mt-2"
          onClick={handleClear}
        >
          Limpar Filtros
        </button>
      </form>
    </div>
  );
};

export default FormBuscaEventos;