import { List, Database, Copy } from "lucide-react";

type QuickActionsMenuProps = {
  navigate: (path: string) => void;
  setShowQuestionManager: (show: boolean) => void;
  isCreatingTemplate: boolean;
  setIsCreatingTemplate: (isCreating: boolean) => void;
};

const QuickActionsMenu: React.FC<QuickActionsMenuProps> = (
  { navigate, setShowQuestionManager, isCreatingTemplate, setIsCreatingTemplate }
) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
      <div className="space-y-3">
        <button
          onClick={() => navigate('/evaluations')}
          className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <List className="w-5 h-5 text-gray-600" />
            <span>Ver Minhas Avaliações</span>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        <button
          onClick={() => setShowQuestionManager(true)}
          className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Banco de Perguntas</span>
          </div>
          <span className="text-blue-400">→</span>
        </button>

        <button
          onClick={() => setIsCreatingTemplate(!isCreatingTemplate)}
          className="w-full flex items-center justify-between p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Copy className="w-5 h-5 text-purple-600" />
            <span>{isCreatingTemplate ? 'Voltar para Avaliação' : 'Criar Template'}</span>
          </div>
          <span className="text-purple-400">→</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsMenu;