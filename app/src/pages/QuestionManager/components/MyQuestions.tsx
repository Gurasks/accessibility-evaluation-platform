import React from 'react';
import { Eye, EyeOff, Trash2, Users, Copy } from 'lucide-react';
import { useQuestion } from '@/contexts/QuestionContext';
import { UserQuestion } from '@/types';

type MyQuestionsProps = {
  filteredUserQuestions: UserQuestion[];
  handleUseQuestion: (question: string) => void;
};

const MyQuestions: React.FC<MyQuestionsProps> = (
  { filteredUserQuestions, handleUseQuestion }
) => {
  return ((
    <div className="space-y-4">
      {filteredUserQuestions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Você ainda não criou nenhuma pergunta.</p>
          <p className="text-sm mt-1">Crie sua primeira pergunta acima!</p>
        </div>
      ) : (
        filteredUserQuestions.map(question => (
          <div
            key={question.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {question.category}
                  </span>
                  <span className="flex items-center space-x-1 text-sm text-gray-500">
                    {question.isPublic ? (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Pública</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>Privada</span>
                      </>
                    )}
                  </span>
                  <span className="text-sm text-gray-500">
                    Usada {question.usedCount} vezes
                  </span>
                </div>
                <p className="text-gray-800">{question.text}</p>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleUseQuestion(question.text)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Usar pergunta"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {/* Implementar toggle */ }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title={question.isPublic ? 'Tornar privada' : 'Tornar pública'}
                >
                  {question.isPublic ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => {/* Implementar delete */ }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Deletar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
  )
};

export default MyQuestions;