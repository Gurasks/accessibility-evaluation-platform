import { useQuestion } from "@/contexts/QuestionContext";
import { getCogaCategories } from "@/services/globalServices";
import { CogaOptions } from "@/types/coga";
import { Plus } from "lucide-react";
import { useState } from "react";

type CreateFormFormProps = {
  cogaCategories: CogaOptions;
  newQuestion: string;
  setNewQuestion: (text: string) => void;
  category: string;
  setCategory: (category: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
};

const CreateFormForm: React.FC<CreateFormFormProps> = ({
  cogaCategories,
  newQuestion,
  setNewQuestion,
  category,
  setCategory,
  isPublic,
  setIsPublic
}) => {

  const {
    createQuestion,
    loading
  } = useQuestion();



  const handleCreateQuestion = async () => {
    if (!newQuestion.trim()) return;

    try {
      await createQuestion(newQuestion.trim(), category, isPublic);
      setNewQuestion('');
      setCategory('Geral');
      setIsPublic(false);
    } catch (error) {
      console.error('Erro ao criar pergunta:', error);
    }
  };

  return (<div className="p-6 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Criar Nova Pergunta</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pergunta *
        </label>
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Digite sua pergunta aqui..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {Object.values(cogaCategories).map(cat => (
              <option key={cat.key} value={cat.label}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <div className="mt-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="sr-only"
                />
                <div className={`block w-14 h-8 rounded-full ${isPublic ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isPublic ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Tornar pública</span>
                <p className="text-xs text-gray-500">Outros usuários poderão usar</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleCreateQuestion}
            disabled={!newQuestion.trim() || loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Pergunta</span>
          </button>
        </div>
      </div>
    </div>
  </div>);
};

export default CreateFormForm;