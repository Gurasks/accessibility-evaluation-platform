import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvaluation } from '../contexts/EvaluationContext';
import { Evaluation, FirestoreQuestion } from '../types';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import LikertScale from '../components/LikertScale';
import { useAuth } from '../contexts/AuthContext';

const RespondEvaluation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvaluationById, updateEvaluation } = useEvaluation();
  const { role, currentUser } = useAuth();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: { score: number | null; comment: string } }>({});
  const [responsesInitialized, setResponsesInitialized] = useState(false);

  const isAdm = role === 'adm';

  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!id) return;

      try {
        const evalData = await getEvaluationById(id);
        if (evalData) {
          setEvaluation(evalData);
          // Only initialize responses if they haven't been set yet
          if (!responsesInitialized) {
            // Try to find an existing response from the current user
            const userResponse = evalData.responses?.find(r => r.evaluatorId === currentUser?.uid || r.evaluatorEmail === currentUser?.email);
            const initialResponses: { [key: string]: { score: number | null; comment: string } } = {};
            const baseQuestions = userResponse ? userResponse.questions : evalData.questions;
            baseQuestions.forEach((q, index) => {
              initialResponses[index.toString()] = {
                score: q.likertScore ?? null,
                comment: q.comment || ''
              };
            });
            setResponses(initialResponses);
            setResponsesInitialized(true);
          }
        } else {
          setError('Avaliação não encontrada');
        }
      } catch (err) {
        setError('Erro ao carregar avaliação');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [id]); // Remove getEvaluationById from dependencies

  const allQuestionsAnswered = Boolean(evaluation) && Object.keys(responses).length === evaluation!.questions.length &&
    Object.values(responses).every(r => r.score !== null);

  const handleScoreChange = useCallback((questionIndex: number, score: number | null) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex.toString()]: {
        ...prev[questionIndex.toString()],
        score
      }
    }));
  }, []);

  const handleCommentChange = useCallback((questionIndex: number, comment: string) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex.toString()]: {
        ...prev[questionIndex.toString()],
        comment
      }
    }));
  }, []);

  const handleSave = async () => {
    if (!evaluation || !id) return;

    setSaving(true);
    try {
      // Update questions with responses
      const updatedQuestions: FirestoreQuestion[] = evaluation.questions.map((q, index) => ({
        ...q,
        likertScore: responses[index.toString()]?.score || null,
        comment: responses[index.toString()]?.comment || ''
      }));

      await updateEvaluation(id, { questions: updatedQuestions });
      navigate('/evaluations');
    } catch (err) {
      console.error('Erro ao salvar respostas:', err);
      setError('Erro ao salvar respostas');
    } finally {
      setSaving(false);
    }
  };

  const calculateProgress = useMemo(() => {
    const totalQuestions = evaluation?.questions.length || 0;
    const answeredQuestions = Object.values(responses).filter(r => r.score !== null).length;
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  }, [evaluation?.questions.length, responses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando avaliação...</p>
        </div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Erro</h3>
          <p className="mt-1 text-sm text-gray-500">{error || 'Avaliação não encontrada'}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/evaluations')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Avaliações
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/evaluations')}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{evaluation.appName}</h1>
                {evaluation.description && (
                  <p className="mt-1 text-sm text-gray-600">{evaluation.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Progresso</p>
                <p className="text-lg font-semibold text-gray-900">{calculateProgress}%</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {!isAdm && (
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {Object.values(responses).filter(r => r.score !== null).length} de {evaluation.questions.length} perguntas respondidas
              </p>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {evaluation.questions.map((question, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Pergunta {index + 1}
                </h3>
                <p className="text-gray-700">{question.text}</p>
                {question.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    {question.category}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {!isAdm && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avaliação (1-5)
                      </label>
                      <LikertScale
                        value={responses[index.toString()]?.score || null}
                        onChange={(score) => handleScoreChange(index, score)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentários (opcional)
                      </label>
                      <textarea
                        value={responses[index.toString()]?.comment || ''}
                        onChange={(e) => handleCommentChange(index, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Adicione observações ou comentários sobre esta pergunta..."
                      />
                    </div>
                  </>
                )}

                {isAdm && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Como administrador, você pode visualizar as questões, mas não pode respondê-las.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button at Bottom */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          {!allQuestionsAnswered && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Você deve responder todas as perguntas antes de salvar.
              </p>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || !allQuestionsAnswered}
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              {saving ? 'Salvando...' : 'Salvar Todas as Respostas'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RespondEvaluation;