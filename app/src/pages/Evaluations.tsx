import {
  BarChart3,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Search,
  Trash2,
  User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import QuestionManager from './QuestionManager/QuestionManager';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvaluation } from '../contexts/EvaluationContext';
import { Evaluation } from '../types';

// Derive a display name from an email (prefer first name-like token)
const getNameFromEmail = (email?: string | null) => {
  if (!email) return 'Usuário';
  // If email contains a name-like format before @, try to extract first token
  const local = email.split('@')[0];
  // Replace common separators with space
  const cleaned = local.replace(/[._-]+/g, ' ');
  const firstToken = cleaned.split(' ')[0];
  if (!firstToken) return local;
  // Capitalize first letter
  return firstToken.charAt(0).toUpperCase() + firstToken.slice(1);
};

const Evaluations: React.FC = () => {
  const { evaluations, loading, error, getUserEvaluations, deleteEvaluation } = useEvaluation();
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [showQuestionManager, setShowQuestionManager] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    if (currentUser) {
      getUserEvaluations();
    }
  }, [currentUser]);

  useEffect(() => {
    const filtered = evaluations.filter(evalItem =>
      evalItem.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getNameFromEmail(evalItem.evaluatorEmail).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvaluations(filtered);
  }, [searchTerm, evaluations]);

  const handleRespondEvaluation = (id: string) => {
    navigate(`/respond/${id}`);
  };

  const handleViewEvaluation = (id: string) => {
    navigate(`/evaluation/${id}`);
  };

  const handleDeleteEvaluation = async (id: string, appName: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o cenário de avaliação "${appName}"?`)) {
      try {
        await deleteEvaluation(id);
      } catch (error) {
        console.error('Erro ao deletar cenário de avaliação:', error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 4) return 'bg-green-100 text-green-800';
    if (score >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading && evaluations.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando seus Cenários de Avaliação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {role === 'adm' ? 'Resultados dos Cenários de Avaliação' : 'Meus Cenários de Avaliação'}
        </h1>
        <p className="text-gray-600">
          {role === 'adm'
            ? 'Visualize os resultados e médias dos cenários de avaliação realizados'
            : 'Cenários de avaliação disponíveis para responder e já respondidos'
          }
        </p>
        {role === 'adm' && (
          <div className="mt-4 flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
            >
              Criar nova Avaliação
            </button>

            <button
              type="button"
              onClick={() => setShowQuestionManager(!showQuestionManager)}
              className={`px-4 py-2 rounded-lg ${showQuestionManager ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Banco de Perguntas
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin?template=true')}
              className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              Criar Template
            </button>
          </div>
        )}
      </div>

      {showQuestionManager && (
        <div className="mb-8">
          <QuestionManager selectedQuestions={[]} />
        </div>
      )}

      {/* Stats */}
      <div className={`grid grid-cols-1 md:grid-cols-${role === 'evaluator' ? '4' : '3'} gap-6 mb-8`}>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Cenários de Avaliação</p>
              <p className="text-2xl font-bold text-gray-900">{evaluations.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Média Geral</p>
              <p className="text-2xl font-bold text-gray-900">
                {evaluations.length > 0
                  ? (evaluations.reduce((acc, evalItem) => acc + (evalItem.averageScore || 0), 0) / evaluations.length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Último Cenário de Avaliação</p>
              <p className="text-lg font-bold text-gray-900">
                {evaluations.length > 0
                  ? formatDate(evaluations[0]?.createdAt).split(',')[0]
                  : 'Nenhuma'
                }
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {role === 'evaluator' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avaliador</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {currentUser?.displayName ? currentUser.displayName.split(' ')[0] : getNameFromEmail(currentUser?.email)}
                </p>
              </div>
              <User className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome da aplicação ou avaliador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredEvaluations.length} de {evaluations.length} cenários de avaliação
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Evaluations List */}
      {filteredEvaluations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum cenário de avaliação encontrado
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? 'Tente buscar por outro termo'
              : 'Crie seu primeiro cenário de avaliação para começar'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              Criar Primeiro Cenário de Avaliação
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left side - Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {evaluation.appName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(evaluation.averageScore)}`}>
                        Média: {evaluation.averageScore?.toFixed(2) || 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{(evaluation as any).evaluatorName ? (evaluation as any).evaluatorName : getNameFromEmail(evaluation.evaluatorEmail)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(evaluation.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>{evaluation.questions.length} questões</span>
                      </div>
                    </div>

                    {role === 'evaluator' && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Progresso:</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          {(() => {
                            const userResp = (evaluation as any).responses ? (evaluation as any).responses.find((r: any) => r.evaluatorId === currentUser?.uid || r.evaluatorEmail === currentUser?.email) : null;
                            const answered = userResp ? (userResp.questions || []).filter((q: any) => q.likertScore !== null).length : 0;
                            const percent = evaluation.questions.length > 0 ? (answered / evaluation.questions.length) * 100 : 0;
                            return (
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${percent}%` }}
                              />
                            );
                          })()}
                        </div>
                        <span className="text-sm text-gray-600">
                          {(() => {
                            const userResp = (evaluation as any).responses ? (evaluation as any).responses.find((r: any) => r.evaluatorId === currentUser?.uid || r.evaluatorEmail === currentUser?.email) : null;
                            const answered = userResp ? (userResp.questions || []).filter((q: any) => q.likertScore !== null).length : 0;
                            return `${answered}/${evaluation.questions.length}`;
                          })()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex items-center space-x-3">
                    {role === 'evaluator' && (
                      <button
                        onClick={() => evaluation.id && handleRespondEvaluation(evaluation.id)}
                        className="flex items-center space-x-2 px-4 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Responder</span>
                      </button>
                    )}

                    {role === 'adm' && (
                      <button
                        onClick={() => evaluation.id && handleViewEvaluation(evaluation.id)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-primary-600 bg-primary-50 hover:bg-primary-100"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Ver Detalhes</span>
                      </button>
                    )}

                    <button
                      onClick={() => {/* Implement export */ }}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Exportar"
                    >
                      <Download className="w-5 h-5" />
                    </button>

                    {role === 'adm' && (
                      <button
                        onClick={() => evaluation.id && handleDeleteEvaluation(evaluation.id, evaluation.appName)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Deletar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}

                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Evaluations;