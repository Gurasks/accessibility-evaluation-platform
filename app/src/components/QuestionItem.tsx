import { getCogaCategories } from "@/services/globalServices";
import { FormQuestion } from "@/types";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import LikertScale from "./LikertScale";
import { useAuth } from "@/contexts/AuthContext";

const QuestionItem: React.FC<{
  question: FormQuestion;
  index: number;
  onUpdate: (question: FormQuestion) => void;
  onRemove: () => void;
  showResponseControls?: boolean;
}> = ({ question, index, onUpdate, onRemove, showResponseControls = true }) => {
  const { role } = useAuth();
  const [likertScore, setLikertScore] = useState(question.likertScore);
  const [comment, setComment] = useState(question.comment);

  useEffect(() => {
    onUpdate({
      ...question,
      likertScore,
      comment
    });
  }, [likertScore, comment]);

  const isAdm = role === 'adm';
  const shouldShowControls = showResponseControls && !isAdm;

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:border-primary-300 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-semibold">
              {index + 1}
            </span>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Questão {index + 1} *
              </label>
              {question.isCustom && (
                <span className="text-xs text-primary-600 font-medium">Personalizada</span>
              )}
            </div>
            {/* Ajeitar posicionamento do botão */}
            <div className="flex float-end space-x-2">
              <button
                onClick={onRemove}
                className="text-red-600 hover:text-red-800 focus:outline-none"
                aria-label="Remover questão"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {question.text}

            <div className="flex items-center space-x-3">
              {question.category}
            </div>
          </div>
        </div>
      </div>

      {shouldShowControls && (
        <>
          <div className="mb-6">
            <LikertScale
              value={likertScore}
              onChange={(score) => setLikertScore(score)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentários (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={2}
              placeholder="Adicione observações..."
            />
          </div>
        </>
      )}

      {isAdm && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            Como administrador, você pode visualizar e editar as questões, mas não pode respondê-las.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionItem;