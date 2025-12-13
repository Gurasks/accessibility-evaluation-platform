import { FormQuestion } from "@/types";

type EvaluationProgressProps = {
  completed: number;
  total: number;
  questions: FormQuestion[];
};

const EvaluationProgress: React.FC<EvaluationProgressProps> = ({ completed, total, questions }) => {
  const progressPercentage = Math.round((
    questions.filter(q => q.likertScore !== null).length / questions.length
  ) * 100)

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Estatísticas</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progresso</span>
            <span className="font-semibold">
              {progressPercentage}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{
                width: `${progressPercentage}%`
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total de Questões</p>
            <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600">Respondidas</p>
            <p className="text-2xl font-bold text-blue-900">
              {questions.filter(q => q.likertScore !== null).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationProgress;