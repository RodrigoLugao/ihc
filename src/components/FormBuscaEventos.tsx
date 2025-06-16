// src/components/FormBuscaEventos.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react'; // Adicionado useMemo
import { useForm } from 'react-hook-form';
import type { CurriculoTipo } from '../utils/acutils'; // Certifique-se de que este caminho está correto
import { categoriasData } from '../interfaces/Categoria';


// Interface para os dados do formulário de busca
export interface EventSearchForm {
  searchTerm: string;
  startDate: string;
  endDate: string;
  location: string;
  minHours: number | '';
  maxHours: number | '';
  categories: string[];
  curriculoType: CurriculoTipo;
  excludeCategories: string[];
}

interface FormBuscaEventosProps {
  onSearch: (data: EventSearchForm) => void;
  onClear: () => void;
  initialFormData: EventSearchForm | null;
}

// Componente Badge para reutilização
interface BadgeProps {
  text: string;
  onRemove: () => void;
  maxLength?: number;
  red?: boolean;
}

const CategoryBadge: React.FC<BadgeProps> = ({ text, onRemove, maxLength = 25, red = false }) => {
  const truncatedText = text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  return (
    <span
      className={`badge bg-${red? "danger": "primary"} text-white d-inline-flex align-items-center me-2 mb-2 p-2`}
      title={text} // Tooltip com o nome completo
      style={{ cursor: 'pointer' }}
    >
      {truncatedText}
      <button
        type="button"
        className="btn-close btn-close-white ms-2"
        aria-label="Remover"
        onClick={onRemove}
      ></button>
    </span>
  );
};

const FormBuscaEventos: React.FC<FormBuscaEventosProps> = ({ onSearch, onClear, initialFormData }) => {
  const [selectedIncludeCategories, setSelectedIncludeCategories] = useState<string[]>([]);
  const [selectedExcludeCategories, setSelectedExcludeCategories] = useState<string[]>([]);

  const { register, handleSubmit, reset } = useForm<Omit<EventSearchForm, 'categories' | 'excludeCategories'>>({
    defaultValues: {
      searchTerm: '',
      startDate: '',
      endDate: '',
      location: '',
      minHours: '',
      maxHours: '',
      curriculoType: 'curriculoNovo',
    }
  });

  // Usa useMemo para extrair e ordenar os nomes das categorias apenas uma vez
  // ou quando categoriasData mudar (o que é improvável em um array estático).
  const availableCategoryNames = useMemo(() => {
    return categoriasData.map(cat => cat.nome).sort();
  }, []);

  useEffect(() => {
    if (initialFormData) {
      reset(initialFormData);
      // Garante que as categorias iniciais sejam convertidas para minúsculas para consistência
      setSelectedIncludeCategories(initialFormData.categories?.map(c => c.toLowerCase()) || []);
      setSelectedExcludeCategories(initialFormData.excludeCategories?.map(c => c.toLowerCase()) || []);
    } else {
      reset({
        searchTerm: '',
        startDate: '',
        endDate: '',
        location: '',
        minHours: '',
        maxHours: '',
        curriculoType: 'curriculoNovo',
      });
      setSelectedIncludeCategories([]);
      setSelectedExcludeCategories([]);
    }
  }, [initialFormData, reset]);

  const hideCurriculoTypeSelect = initialFormData !== null && initialFormData.curriculoType !== undefined;

  const handleAddIncludeCategory = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryName = event.target.value; // Já virá em minúsculas se a opção foi gerada com value={category.toLowerCase()}
    if (categoryName && !selectedIncludeCategories.includes(categoryName)) {
      setSelectedIncludeCategories((prev) => [...prev, categoryName]);
      event.target.value = '';
    }
  }, [selectedIncludeCategories]);

  const handleRemoveIncludeCategory = useCallback((categoryToRemove: string) => {
    setSelectedIncludeCategories((prev) =>
      prev.filter((category) => category !== categoryToRemove)
    );
  }, []);

  const handleAddExcludeCategory = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryName = event.target.value; // Já virá em minúsculas
    if (categoryName && !selectedExcludeCategories.includes(categoryName)) {
      setSelectedExcludeCategories((prev) => [...prev, categoryName]);
      event.target.value = '';
    }
  }, [selectedExcludeCategories]);

  const handleRemoveExcludeCategory = useCallback((categoryToRemove: string) => {
    setSelectedExcludeCategories((prev) =>
      prev.filter((category) => category !== categoryToRemove)
    );
  }, []);

  const onSubmit = (data: Omit<EventSearchForm, 'categories' | 'excludeCategories'>) => {
    const fullData: EventSearchForm = {
      ...data,
      categories: selectedIncludeCategories,
      excludeCategories: selectedExcludeCategories,
    };
    onSearch(fullData);
  };

  const handleClear = () => {
    reset({
      searchTerm: '',
      startDate: '',
      endDate: '',
      location: '',
      minHours: '',
      maxHours: '',
      curriculoType: 'curriculoNovo',
    });
    setSelectedIncludeCategories([]);
    setSelectedExcludeCategories([]);
    onClear();
  };

  return (
    <div className="p-4 rounded shadow-sm" style={{ backgroundColor: '#2c3e50' }}>
      <h2 className="mb-4" style={{ fontWeight: 'bold', color: '#ecf0f1' }}>Filtro de Eventos</h2>
      <form className='position-relative' onSubmit={handleSubmit(onSubmit)}>
        <button
          type="button"
          className="btn btn-secondary btn-sm mt-2 position-absolute end-0 top-0"
          onClick={handleClear}
        >
          Limpar Filtros
        </button>
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
          <h4 className="mb-3" style={{ fontWeight: 'bold', color: '#ecf0f1' }}>Atividades Complementares do Evento</h4>

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
              <label htmlFor="minHours" className="form-label text-light">Horas Mínimas:</label>
              <input
                type="number"
                className="form-control"
                id="minHours"
                placeholder="Ex: 5"
                {...register('minHours', { valueAsNumber: true })}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="maxHours" className="form-label text-light">Horas Máximas:</label>
              <input
                type="number"
                className="form-control"
                id="maxHours"
                placeholder="Ex: 20"
                {...register('maxHours', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Seleção de Categorias para INCLUSÃO */}
          <div className="mb-4">
            <label htmlFor="selectIncludeCategories" className="form-label text-light">Mostrar eventos que tenham pelo menos uma atividade dos tipos:</label>
            <select
              className="form-select"
              id="selectIncludeCategories"
              onChange={handleAddIncludeCategory}
              value="" // Garante que o select sempre mostre a opção padrão após a seleção
            >
              <option value="" disabled>Selecione uma categoria...</option>
              {availableCategoryNames.map((category) => (
                <option
                  key={category}
                  value={category.toLowerCase()} // Armazena em minúsculas
                  disabled={selectedIncludeCategories.includes(category.toLowerCase())} // Desabilita opções já selecionadas
                >
                  {category}
                </option>
              ))}
            </select>
            <div className="mt-2 d-flex flex-wrap">
              {selectedIncludeCategories.map((category) => (
                <CategoryBadge
                  
                  key={`include-${category}`}
                  text={category}
                  onRemove={() => handleRemoveIncludeCategory(category)}
                />
              ))}
            </div>
            {selectedIncludeCategories.length === 0 && (
              <small className="form-text text-light opacity-75">
                Nenhuma categoria selecionada.
              </small>
            )}
          </div>

          {/* Seleção de Categorias para EXCLUSÃO */}
          <div className="mb-4">
            <label htmlFor="selectExcludeCategories" className="form-label text-light">Não mostrar Eventos que <b>só</b> tenham atividades dos tipos:</label>
            <select
              className="form-select"
              id="selectExcludeCategories"
              onChange={handleAddExcludeCategory}
              value="" // Garante que o select sempre mostre a opção padrão após a seleção
            >
              <option value="" disabled>Selecione uma categoria...</option>
              {availableCategoryNames.map((category) => (
                <option
                  key={category}
                  value={category.toLowerCase()} // Armazena em minúsculas
                  disabled={selectedExcludeCategories.includes(category.toLowerCase())} // Desabilita opções já selecionadas
                >
                  {category}
                </option>
              ))}
            </select>
            <div className="mt-2 d-flex flex-wrap">
              {selectedExcludeCategories.map((category) => (
                <CategoryBadge
                  key={`exclude-${category}`}
                  text={category}
                  onRemove={() => handleRemoveExcludeCategory(category)}
                  red={true}
                />
              ))}
            </div>
            {selectedExcludeCategories.length === 0 && (
              <small className="form-text text-light opacity-75">
                Nenhuma categoria selecionada.
              </small>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100">Buscar</button>
        
      </form>
    </div>
  );
};

export default FormBuscaEventos;