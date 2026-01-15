import { QuestionFiltersTabs, UserQuestion } from '@/types';
import React, { useState, useEffect } from 'react';
import { useQuestion } from '../../../contexts/QuestionContext';
import MyQuestions from '../../QuestionManager/components/MyQuestions';
import PublicQuestions from '../../QuestionManager/components/PublicQuestions';
import QuestionFilters from '../../QuestionManager/components/QuestionFilters';
import TemplateList from '../../QuestionManager/components/TemplatesList';
import { getCogaCategories } from '@/services/globalServices';
import { X } from 'lucide-react';

interface QuestionBankViewerProps {
  selectedQuestions: string[];
  onClose?: () => void;
}

const QuestionBankViewer: React.FC<QuestionBankViewerProps> = ({ selectedQuestions, onClose }) => {
  const {
    userQuestions,
    publicQuestions,
    predefinedTemplates,
    loading
  } = useQuestion();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<QuestionFiltersTabs>('mine');

  const cogaCategories = getCogaCategories();

  const handleUseQuestion = (question: UserQuestion) => {
    console.log('[QuestionBankViewer] dispatching useQuestion:', question.text);
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

  // Listener para fechar quando template for usado
  useEffect(() => {
    const handleTemplateUse = () => {
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 300);
      }
    };

    window.addEventListener('useTemplate', handleTemplateUse);
    return () => {
      window.removeEventListener('useTemplate', handleTemplateUse);
    };
  }, [onClose]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Banco de Perguntas</h2>
            <p className="text-gray-600 text-sm mt-1">
              Selecione questões salvas ou templates
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-primary-600">{userQuestions.length}</span> suas perguntas
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-green-600">{publicQuestions.length}</span> públicas
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <QuestionFilters
        cogaCategories={cogaCategories}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Lista de Perguntas */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Carregando...</p>
          </div>
        ) : (
          <>
            {activeTab === 'mine' && (
              <MyQuestions
                filteredUserQuestions={filteredUserQuestions}
                handleUseQuestion={handleUseQuestion}
              />
            )}
            {activeTab === 'public' && (
              <PublicQuestions
                filteredPublicQuestions={filteredPublicQuestions}
                handleUseQuestion={handleUseQuestion}
              />
            )}
            {activeTab === 'templates' && (
              <TemplateList
                predefinedTemplates={predefinedTemplates}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionBankViewer;
