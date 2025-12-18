import { getCogaCategories } from '@/services/globalServices';
import { QuestionFiltersTabs, UserQuestion } from '@/types';
import React, { useState } from 'react';
import { useQuestion } from '../../contexts/QuestionContext';
import CreateQuestionForm from './components/CreateQuestionForm';
import MyQuestions from './components/MyQuestions';
import PublicQuestions from './components/PublicQuestions';
import QuestionFilters from './components/QuestionFilters';
import TemplateList from './components/TemplatesList';

const QuestionManager: React.FC<{ selectedQuestions: string[] }> = ({ selectedQuestions }) => {
  const {
    userQuestions,
    publicQuestions,
    predefinedTemplates,
    loading
  } = useQuestion();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<QuestionFiltersTabs>('mine');
  const [newQuestion, setNewQuestion] = useState('');
  const [category, setCategory] = useState('Geral');
  const [weight, setWeight] = useState(1);
  const [isPublic, setIsPublic] = useState(false);

  const cogaCategories = getCogaCategories();

  const handleUseQuestion = (question: UserQuestion) => {
    // Emitir evento para o formulário pai
    const event = new CustomEvent('useQuestion', { detail: question });
    window.dispatchEvent(event);
  };

  const filteredUserQuestions = userQuestions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const notSelected = !selectedQuestions.includes(q.text.trim());
    return matchesSearch && matchesCategory && notSelected;
  });

  const filteredPublicQuestions = publicQuestions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const notSelected = !selectedQuestions.includes(q.text.trim());
    return matchesSearch && matchesCategory && notSelected;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Banco de Perguntas</h2>
            <p className="text-gray-600 text-sm mt-1">
              Crie e gerencie suas perguntas personalizadas
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">
              <span className="font-semibold text-primary-600">{userQuestions.length}</span> suas perguntas
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-semibold text-green-600">{publicQuestions.length}</span> públicas
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Criação */}
      <CreateQuestionForm
        cogaCategories={cogaCategories}
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        category={category}
        setCategory={setCategory}
        weight={weight}
        setWeight={setWeight}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
      />

      {/* Filtros */}
      <QuestionFilters
        cogaCategories={cogaCategories}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory} />

      {/* Lista de Perguntas */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando perguntas...</p>
          </div>
        ) : (
          <>
            {/* Minhas Perguntas */}
            {activeTab === 'mine' && <MyQuestions
              filteredUserQuestions={filteredUserQuestions}
              handleUseQuestion={handleUseQuestion}
            />
            }

            {/* Perguntas Públicas */}
            {activeTab === 'public' && <PublicQuestions
              filteredPublicQuestions={filteredPublicQuestions}
              handleUseQuestion={handleUseQuestion}
            />
            }

            {/* Templates Pré-definidos */}
            {activeTab === 'templates' && <TemplateList predefinedTemplates={predefinedTemplates} />}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionManager;