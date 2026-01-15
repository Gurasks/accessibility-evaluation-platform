import { useEvaluation } from "@/contexts/EvaluationContext";
import { useQuestion } from "@/contexts/QuestionContext";
import QuickActions from "../../components/QuickActions";
import ActivitySummary from "./components/ActivitySummary";
import RecentEvaluations from "./components/RecentEvaluation";
import StatCard from "./components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import QuestionManager from "../QuestionManager/QuestionManager";
import { useState } from "react";

const Home: React.FC = () => {
  const { evaluations } = useEvaluation();
  const { publicQuestions } = useQuestion();
  const { role } = useAuth();

  const [showQuestionManager, setShowQuestionManager] = useState(false);


  const totalEvaluations = evaluations.length;
  const totalResponses = evaluations.reduce(
    (acc, e) => acc + (e.responses?.length ?? 0),
    0
  );

  const averageScore =
    totalResponses === 0
      ? 0
      : (
        evaluations.reduce((acc, e) => acc + (e.averageScore ?? 0), 0) /
        totalEvaluations
      ).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {role === 'adm' && (
        <>
          <QuickActions questionManager={() => setShowQuestionManager(!showQuestionManager)} />

          {showQuestionManager && (
            <div className="mb-8">
              <QuestionManager selectedQuestions={[]} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total de Avaliações" value={totalEvaluations} />
            <StatCard title="Total de Respostas" value={totalResponses} />
            <StatCard title="Questões Públicas" value={publicQuestions.length} />
            <StatCard title="Média Geral" value={`${averageScore}/5`} />
          </div>
        </>)
      }

      {
        role !== 'adm' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard title="Total de Avaliações" value={totalEvaluations} />
            <StatCard title="Média Geral" value={`${averageScore}/5`} />
          </div>
        )
      }

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEvaluations />
        <ActivitySummary />
      </div>
    </div>
  );
};

export default Home;