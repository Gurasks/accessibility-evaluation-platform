import { Plus, Database } from 'lucide-react';
import React from 'react';

interface QuestionActionMenuProps {
  onCreateNew: () => void;
  onUseBank: () => void;
  onClose: () => void;
}

const QuestionActionMenu: React.FC<QuestionActionMenuProps> = ({ onCreateNew, onUseBank, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Adicionar Questão</h3>
        <p className="text-gray-600 mb-6">Escolha como deseja adicionar uma nova questão ao seu cenário de avaliação</p>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="w-full flex items-center space-x-4 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Plus className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <div className="text-left flex-1">
              <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Criar Nova Questão</h4>
              <p className="text-sm text-gray-600">Escreva uma questão personalizada do zero</p>
            </div>
          </button>

          <button
            onClick={() => {
              onUseBank();
              onClose();
            }}
            className="w-full flex items-center space-x-4 p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
              <Database className="w-6 h-6 text-green-600 group-hover:text-white" />
            </div>
            <div className="text-left flex-1">
              <h4 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">Usar Banco de Questões</h4>
              <p className="text-sm text-gray-600">Escolha questões salvas ou templates</p>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default QuestionActionMenu;
