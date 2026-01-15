import { useAuth } from '@/contexts/AuthContext';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { useQuestion } from '@/contexts/QuestionContext';
import { BarChart3, Calendar, Globe } from 'lucide-react';

const ActivitySummary = () => {
  const { evaluations } = useEvaluation();
  const { publicQuestions } = useQuestion();
  const { role } = useAuth();

  const now = new Date();
  const last30Days = new Date();
  last30Days.setDate(now.getDate() - 30);

  const evaluationsThisMonth = evaluations.filter(e =>
    e.createdAt >= last30Days
  ).length;

  const averageResponses =
    evaluations.length === 0
      ? 0
      : Math.round(
        evaluations.reduce(
          (acc, e) => acc + (e.responses?.length ?? 0),
          0
        ) / evaluations.length
      );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Resumo de Atividades
      </h2>

      <ul className="space-y-4">
        <li className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" />
            <span>Avaliações criadas nos últimos 30 dias</span>
          </div>
          <span className="font-semibold">
            {evaluationsThisMonth}
          </span>
        </li>

        {role === 'adm' && (
          <li className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Globe className="text-green-600" />
              <span>Questões públicas</span>
            </div>
            <span className="font-semibold">
              {publicQuestions.length}
            </span>
          </li>)
        }

        <li className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-purple-600" />
            <span>Taxa média de resposta</span>
          </div>
          <span className="font-semibold">
            {averageResponses}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default ActivitySummary;