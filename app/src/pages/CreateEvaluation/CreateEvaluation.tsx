import AIValidationBadge from '@/components/AIValidationBadge';
import QuestionItem from '@/components/QuestionItem';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Database,
  Save,
  Sparkles
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvaluation } from '../../contexts/EvaluationContext';
import { useQuestion } from '../../contexts/QuestionContext';
import { aiValidationService } from '../../services/aiValidationService';
import { EvaluationFormData, FormQuestion, SavingStatus } from '../../types';
import QuestionActionMenu from '../Home/components/QuestionActionMenu';
import QuestionBankViewer from '../Home/components/QuestionBankViewer';
import QuickCreateQuestion from '../Home/components/QuickCreateQuestion';
import AppInfoForm from './components/AppInfoForm';

const CreateEvaluation: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { createEvaluation, loading: saving } = useEvaluation();
  const { loadQuestions } = useQuestion();

  const [appName, setAppName] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [questionMode, setQuestionMode] = useState<'none' | 'create' | 'bank'>('none');
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showAIValidation, setShowAIValidation] = useState(false);
  const [aiValidationResult, setAiValidationResult] = useState<{
    score: 1 | 2 | 3 | 4 | 5;
    feedback: string;
    strengths: string[];
    improvements: string[];
    validatedAt: Date;
  } | null>(null);

  useEffect(() => {
    if (role && role !== 'adm') {
      navigate('/evaluations');
    }
  }, [role, navigate]);

  // If navigated with ?template=true, open the template creation mode
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      if (params.get('template') === 'true' || params.get('isTemplate') === 'true') {
        setIsCreatingTemplate(true);
      }
    } catch (e) {
      // ignore
    }
  }, [location.search]);

  useEffect(() => {
    const handleUseQuestion = (event: any) => {
      const question = event.detail;
      const newQuestion: FormQuestion = {
        id: Date.now().toString(),
        text: question.text,
        likertScore: null,
        comment: '',
        category: question.category,
        weight: question.weight,
        isCustom: false
      };
      setQuestions(prev => {
        console.log('[Home] useQuestion received:', question, 'prevCount=', prev.length);
        return [...prev, newQuestion];
      });
    };

    const handleUseTemplate = (event: any) => {
      const templateQuestions = event.detail.map((q: any, index: number) => ({
        id: (Date.now() + index).toString(),
        text: q.text,
        likertScore: null,
        comment: '',
        category: q.category || 'Geral',
        isCustom: false
      }));
      setQuestions(prev => {
        return [...prev, ...templateQuestions];
      });
    };

    window.addEventListener('useQuestion', handleUseQuestion);
    window.addEventListener('useTemplate', handleUseTemplate);

    return () => {
      console.log('[Home] unmounting: removing listeners');
      window.removeEventListener('useQuestion', handleUseQuestion);
      window.removeEventListener('useTemplate', handleUseTemplate);
    };
  }, []);

  // Recarregar questões apenas quando abrir o banco pela primeira vez
  useEffect(() => {
    if (questionMode === 'bank') {
      loadQuestions();
    }
  }, [questionMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setSavingStatus('error');
      setSaveMessage('Você precisa estar logado para salvar um Cenário de Avaliação');
      return;
    }

    // Prevent creating a non-template evaluation without any questions
    if (!isCreatingTemplate && questions.length === 0) {
      setSavingStatus('error');
      setSaveMessage('Adicione pelo menos uma pergunta antes de salvar.');
      return;
    }

    // Remover IDs das questões antes de enviar
    const questionsWithoutIds = questions.map(({ id, ...rest }) => {
      // Filtrar apenas campos definidos para evitar undefined no Firestore
      const filteredQuestion: any = {};
      Object.keys(rest).forEach(key => {
        if (rest[key as keyof typeof rest] !== undefined) {
          filteredQuestion[key] = rest[key as keyof typeof rest];
        }
      });
      return filteredQuestion;
    });

    const evaluationData: Partial<EvaluationFormData> = {
      appName: appName.trim(),
      description: description.trim(),
      questions: questionsWithoutIds,
      isTemplate: isCreatingTemplate,
    };

    if (isCreatingTemplate) {
      evaluationData.templateName = templateName;
    }
    if (appUrl && appUrl.trim()) {
      evaluationData.appUrl = appUrl.trim();
    }
    if (objectives && objectives.trim()) {
      evaluationData.objectives = objectives.trim();
    }
    if (targetAudience && targetAudience.trim()) {
      evaluationData.targetAudience = targetAudience.trim();
    }
    if (dueDate && dueDate.trim()) {
      evaluationData.dueDate = dueDate.trim();
    }

    try {
      setSavingStatus('saving');
      setSaveMessage(isCreatingTemplate ? 'Salvando template...' : 'Validando com IA e salvando Cenário de Avaliação...');

      // Simular validação por IA (com um pequeno delay para realismo)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const validation = aiValidationService.validateQuestions(
        questionsWithoutIds,
        {
          appName: appName.trim(),
          description: description.trim(),
          objectives: objectives.trim(),
          targetAudience: targetAudience.trim()
        }
      );

      setAiValidationResult(validation);
      setShowAIValidation(true);

      await createEvaluation(evaluationData as EvaluationFormData);

      setSavingStatus('success');
      setSaveMessage(
        isCreatingTemplate
          ? 'Template salvo com sucesso!'
          : 'Cenário de Avaliação validado e salvo com sucesso!'
      );

      // Limpar formulário após 2 segundos
      setTimeout(() => {
        if (!isCreatingTemplate) {
          setAppName('');
          setDescription('');
          // Clear questions after successful save
          setQuestions([]);
        }
        // clear newly added optional fields
        setAppUrl('');
        setObjectives('');
        setTargetAudience('');
        setDueDate('');
        setIsCreatingTemplate(false);
        setTemplateName('');
        setSavingStatus('idle');
      }, 2000);

    } catch (error) {
      setSavingStatus('error');
      // Mostrar mensagem curta e segura para o usuário
      let userMessage = 'Erro ao salvar. Tente novamente.';
      try {
        if (error instanceof Error && error.message) {
          const raw = error.message.trim();
          // limitar comprimento para evitar exposição excessiva
          userMessage = raw.length > 140 ? raw.slice(0, 140) + '...' : raw;
        }
      } catch (e) {
        // fallback silencioso
      }
      setSaveMessage(userMessage);
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 bg-white rounded-xl shadow-md p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isCreatingTemplate ? 'Criar Template de Cenário de Avaliação' : 'Novo Cenário de Avaliação'}
            </h1>
            <p className="text-gray-600">
              {isCreatingTemplate
                ? 'Crie um template reutilizável com suas perguntas'
                : 'Avalie aplicações baseado em padrões de acessibilidade'
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/evaluations')}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-primary-600 hover:bg-gray-50"
            >
              Ver minhas Avaliações
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingTemplate(!isCreatingTemplate)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isCreatingTemplate
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
            >
              <Copy className="w-4 h-4" />
              <span>{isCreatingTemplate ? 'Criar Cenário de Avaliação' : 'Criar Template'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário Principal */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* App Info */}
            <AppInfoForm
              isCreatingTemplate={isCreatingTemplate}
              appName={appName}
              setAppName={setAppName}
              appUrl={appUrl}
              setAppUrl={setAppUrl}
              objectives={objectives}
              setObjectives={setObjectives}
              targetAudience={targetAudience}
              setTargetAudience={setTargetAudience}
              dueDate={dueDate}
              setDueDate={setDueDate}
              description={description}
              setDescription={setDescription}
              templateName={templateName}
              setTemplateName={setTemplateName}
            />

            {/* Questions */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Questões ({questions.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowActionMenu(true);
                      setQuestionMode('none');
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <Database className="w-4 h-4" />
                    <span>Adicionar questão</span>
                  </button>
                </div>
              </div>

              {/* Question Mode: Create or Bank */}
              {questionMode === 'create' && (
                <div className="mt-6">
                  <QuickCreateQuestion
                    onSuccess={() => {
                      // Opcional: fechar após adicionar
                      // setQuestionMode('none');
                    }}
                    onClose={() => setQuestionMode('none')}
                  />
                </div>
              )}

              {questionMode === 'bank' && (
                <div className="mt-6">
                  <QuestionBankViewer
                    selectedQuestions={questions.map(q => q.text.trim())}
                    onClose={() => setQuestionMode('none')}
                  />
                </div>
              )}

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <QuestionItem
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={(updated) => {
                      const newQuestions = [...questions];
                      newQuestions[index] = updated;
                      setQuestions(newQuestions);
                    }}
                    onRemove={() => {
                      if (questions.length > 1) {
                        setQuestions(questions.filter((_, i) => i !== index));
                      }
                    }}
                    showResponseControls={role === 'evaluator'}
                  />
                ))}
              </div>
            </div>

            {/* Action Menu Modal */}
            {showActionMenu && (
              <QuestionActionMenu
                onCreateNew={() => setQuestionMode('create')}
                onUseBank={() => setQuestionMode('bank')}
                onClose={() => setShowActionMenu(false)}
              />
            )}

            {/* Save status (moved from sidebar) */}
            {savingStatus !== 'idle' && (
              <div className={`mb-6 p-4 rounded-lg ${savingStatus === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : savingStatus === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
                }`}>
                <div className="flex items-center space-x-3">
                  {savingStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : savingStatus === 'error' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  )}
                  <span>{saveMessage}</span>
                </div>
              </div>
            )}

            {/* AI Validation Result */}
            {showAIValidation && aiValidationResult && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Resultado da Validação por IA
                  </h3>
                </div>
                <AIValidationBadge
                  score={aiValidationResult.score}
                  feedback={aiValidationResult.feedback}
                  strengths={aiValidationResult.strengths}
                  improvements={aiValidationResult.improvements}
                  validatedAt={aiValidationResult.validatedAt}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  {isCreatingTemplate ? (
                    <p>Este template ficará disponível para você reutilizar</p>
                  ) : (
                    <p>Avaliação será salva na sua conta</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAppName('');
                      setDescription('');
                      setQuestions([]);
                      setTemplateName('');
                      setAppUrl('');
                      setObjectives('');
                      setTargetAudience('');
                      setDueDate('');
                    }}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Limpar Tudo
                  </button>

                  <button
                    type="submit"
                    disabled={saving || savingStatus === 'saving' || !currentUser || !appName.trim() || (!isCreatingTemplate && questions.length === 0)}
                    className="flex items-center space-x-2 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving || savingStatus === 'saving' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{isCreatingTemplate ? 'Salvar Template' : 'Criar Cenário de Avaliação'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CreateEvaluation;