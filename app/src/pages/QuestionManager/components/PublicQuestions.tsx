import { UserQuestion } from "@/types";
import { Users, Star } from "lucide-react";

type PublicQuestionsProps = {
  filteredPublicQuestions: UserQuestion[];
  handleUseQuestion: (question: UserQuestion) => void;
};

const PublicQuestions: React.FC<PublicQuestionsProps> = ({
  filteredPublicQuestions,
  handleUseQuestion
}) => {
  return (
    <div className="space-y-4">
      {filteredPublicQuestions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhuma pergunta pública encontrada.</p>
          <p className="text-sm mt-1">Crie uma pergunta pública para compartilhar!</p>
        </div>
      ) : (
        filteredPublicQuestions.map(question => (
          <div
            key={question.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {question.category}
                  </span>
                  <span className="flex items-center space-x-1 text-sm text-green-600">
                    <Users className="w-4 h-4" />
                    <span>Pública</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    <Star className="w-4 h-4 inline mr-1 text-yellow-500" />
                    {question.usedCount} usos
                  </span>
                </div>
                <p className="text-gray-800">{question.text}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Criada por outro usuário
                </p>
              </div>
              <button
                onClick={() => handleUseQuestion(question)}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Usar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PublicQuestions;