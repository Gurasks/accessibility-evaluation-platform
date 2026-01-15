import { useNavigate } from 'react-router-dom';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { FileText } from 'lucide-react';

const RecentEvaluations = () => {
  const { evaluations, loading } = useEvaluation();
  const navigate = useNavigate();

  const recent = [...evaluations]
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Avaliações Recentes
        </h2>

        <button
          onClick={() => navigate('/evaluations')}
          className="text-sm text-primary-600 hover:underline"
        >
          Ver todas
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : recent.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <FileText className="mx-auto mb-2" />
          Nenhuma avaliação encontrada
        </div>
      ) : (
        <ul className="space-y-3">
          {recent.map(evaluation => (
            <li
              key={evaluation.id}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/evaluation/${evaluation.id}`)}
            >
              <div>
                <p className="font-medium text-gray-800">
                  {evaluation.appName}
                </p>
                <p className="text-sm text-gray-500">
                  {evaluation.questions?.length ?? 0} perguntas
                </p>
              </div>

              <span className="text-xs text-gray-400">
                {evaluation.createdAt.toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentEvaluations;