import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Database } from 'lucide-react';

const QuickActions = ({ questionManager }: { questionManager: () => void }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => navigate('/evaluations/new')}
        className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        <PlusCircle className="w-5 h-5" aria-hidden="true" />
        <span>Nova Avaliação</span>
      </button>

      <button
        onClick={() => navigate('/evaluations')}
        className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors"
      >
        <FileText className="w-5 h-5" aria-hidden="true" />
        <span>Ver Avaliações</span>
      </button>

      <button
        onClick={() => questionManager()}
        className="flex-1 flex items-center justify-center gap-3 bg-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-colors"
      >
        <Database className="w-5 h-5" aria-hidden="true" />
        <span>Banco de Perguntas</span>
      </button>
    </div>
  );
};

export default QuickActions;