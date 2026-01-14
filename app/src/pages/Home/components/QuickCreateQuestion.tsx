import { getCogaCategories } from '@/services/globalServices';
import { Plus, Save, X } from 'lucide-react';
import React, { useState } from 'react';
import { useQuestion } from '../../../contexts/QuestionContext';

interface QuickCreateQuestionProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const QuickCreateQuestion: React.FC<QuickCreateQuestionProps> = ({ onSuccess, onClose }) => {
  const { createQuestion, loading } = useQuestion();
  const [newQuestion, setNewQuestion] = useState('');
  const [category, setCategory] = useState('Geral');
  const [weight, setWeight] = useState(1);
  const [isPublic, setIsPublic] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const cogaCategories = getCogaCategories();
  const categoryList = Object.values(cogaCategories).map(cat => cat.label);

  const handleCreateAndAdd = async () => {
    if (!newQuestion.trim()) {
      setSaveStatus('error');
      setSaveMessage('Por favor, escreva uma questão');
      return;
    }

    try {
      setSaveStatus('saving');
      setSaveMessage('Salvando questão...');

      await createQuestion(
        newQuestion.trim(),
        category,
        weight,
        isPublic
      );

      // Emitir evento para adicionar a questão ao formulário
      const event = new CustomEvent('useQuestion', { 
        detail: { 
          text: newQuestion.trim(), 
          category, 
          weight,
          isPublic 
        } 
      });
      window.dispatchEvent(event);

      setSaveStatus('success');
      setSaveMessage('Questão criada e adicionada com sucesso!');

      // Limpar formulário e fechar após 1 segundo
      setTimeout(() => {
        setNewQuestion('');
        setCategory('Geral');
        setWeight(1);
        setIsPublic(false);
        setSaveStatus('idle');
        setSaveMessage('');
        if (onSuccess) onSuccess();
        if (onClose) onClose(); // Fecha o formulário automaticamente
      }, 1000);

    } catch (error) {
      console.error('Erro ao criar questão:', error);
      setSaveStatus('error');
      setSaveMessage('Erro ao criar questão. Tente novamente.');
      
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Criar Nova Questão</span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            A questão será automaticamente salva no seu banco pessoal e adicionada ao cenário
          </p>
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

      <div className="space-y-4">
        {/* Texto da Questão */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto da Questão *
          </label>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ex: A navegação do aplicativo é clara e fácil de entender?"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Categoria e Peso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Geral">Geral</option>
              {categoryList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tornar Pública */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="isPublic" className="text-sm text-gray-700">
            Tornar esta questão pública (outros usuários poderão utilizá-la)
          </label>
        </div>

        {/* Status Message */}
        {saveStatus !== 'idle' && (
          <div className={`p-3 rounded-lg text-sm ${
            saveStatus === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : saveStatus === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Botão de Criar */}
        <button
          onClick={handleCreateAndAdd}
          disabled={loading || saveStatus === 'saving' || !newQuestion.trim()}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || saveStatus === 'saving' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Criar e Adicionar Questão</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuickCreateQuestion;
