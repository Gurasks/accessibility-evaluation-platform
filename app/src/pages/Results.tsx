import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvaluation } from '../contexts/EvaluationContext';
import { Evaluation } from '../types';
import { ArrowLeft, Download, FileText, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvaluationById } = useEvaluation();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to extract weight from question text
  const extractWeight = (question: Evaluation['questions'][0]): number => {
    return question.weight || 1;
  };

  // Function to calculate averages
  const calculateAverages = (questions: Evaluation['questions']) => {
    const questionAverages: { text: string; average: number; weight: number; count: number }[] = [];
    let totalWeightedScore = 0;
    let totalWeight = 0;

    questions.forEach((question, index) => {
      const weight = extractWeight(question);
      const scores = questions
        .map(q => q.likertScore)
        .filter(score => score !== null) as number[];
      
      if (scores.length > 0) {
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        questionAverages.push({
          text: question.text,
          average: Math.round(average * 100) / 100,
          weight,
          count: scores.length
        });
        
        // For overall average, use this question's average
        totalWeightedScore += average * weight;
        totalWeight += weight;
      }
    });

    const overallAverage = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 2 : 0; // Scale to 0-10
    const normalizedOverall = Math.min(10, Math.max(0, overallAverage)); // Ensure 0-10

    return {
      questionAverages,
      overallAverage: Math.round(normalizedOverall * 100) / 100
    };
  };

  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!id) return;

      try {
        const evalData = await getEvaluationById(id);
        if (evalData) {
          setEvaluation(evalData);
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
  }, [id, getEvaluationById]);

  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return '';
    }
  };

  const handleExport = () => {
    if (!evaluation) return;

    const dataStr = JSON.stringify(evaluation, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `${evaluation.appName}-results.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando resultados...</p>
        </div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
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

  const totalQuestions = evaluation.questions.length;
  const answeredQuestions = evaluation.questions.filter(q => q.likertScore !== null).length;
  const averageScore = evaluation.averageScore || 0;
  const { role } = useAuth();

  const { questionAverages, overallAverage } = calculateAverages(evaluation.questions);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <p className="mt-1 text-sm text-gray-500">Criado em: {formatDate(evaluation.createdAt)}</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className={`grid grid-cols-1 ${role === 'adm' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 mb-6`}>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pontuação Média</p>
                <p className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}</p>
              </div>
            </div>
          </div>
          {role !== 'adm' && (
            <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Questões Respondidas</p>
                <p className="text-2xl font-bold text-gray-900">{answeredQuestions}/{totalQuestions}</p>
              </div>
            </div>
            </div>
          )}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Média Ponderada (0-10)</p>
                <p className="text-2xl font-bold text-gray-900">{overallAverage.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Results */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Respostas Detalhadas</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {evaluation.questions.map((question, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      {question.text}
                    </h3>
                    {question.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                        {question.category}
                      </span>
                    )}
                    <div className="mt-2">
                      {question.likertScore !== null ? (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">Pontuação:</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {question.likertScore}/5
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Não respondida</span>
                      )}
                    </div>
                    {question.comment && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">Comentário:</span>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                          {question.comment}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Averages */}
        <div className="bg-white shadow rounded-lg mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Média por Questão</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {questionAverages.map((item, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.text}</p>
                    <p className="text-sm text-gray-500">Peso: {item.weight} | Respostas: {item.count}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900">{item.average}</span>
                    <span className="text-sm text-gray-500 ml-1">/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;