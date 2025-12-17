import QuestionItem from '@/components/QuestionItem';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Database,
  Save
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvaluation } from '../../contexts/EvaluationContext';
import { useQuestion } from '../../contexts/QuestionContext';
import { EvaluationFormData, FormQuestion, SavingStatus } from '../../types';
import QuestionManager from '../QuestionManager/QuestionManager';
import AppInfoForm from './components/AppInfoForm';
import QuickActionsMenu from './components/QuickActionsMenu';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const { createEvaluation, loading: saving } = useEvaluation();
  const { loadQuestions } = useQuestion();
  const navigate = useNavigate();

  const [appName, setAppName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadQuestions();
    }
  }, [currentUser]);

  useEffect(() => {
    const handleUseQuestion = (event: any) => {
      const newQuestion: FormQuestion = {
        id: Date.now().toString(),
        text: event.detail.trim(),
        likertScore: null,
        comment: '',
        category: 'Geral',
        isCustom: true
      };
      setQuestions([...questions, newQuestion]);
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
      setQuestions([...questions, ...templateQuestions]);
    };

    window.addEventListener('useQuestion', handleUseQuestion);
    window.addEventListener('useTemplate', handleUseTemplate);

    return () => {
      window.removeEventListener('useQuestion', handleUseQuestion);
      window.removeEventListener('useTemplate', handleUseTemplate);
    };
  }, [questions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setSavingStatus('error');
      setSaveMessage('Você precisa estar logado para salvar avaliações');
      return;
    }

    // Remover IDs das questões antes de enviar
    const questionsWithoutIds = questions.map(({ id, ...rest }) => rest); // Validar necessidade disso depois

    const evaluationData: EvaluationFormData = {
      appName: appName.trim(),
      description: description.trim(),
      questions: questionsWithoutIds,
      isTemplate: isCreatingTemplate,
      templateName: isCreatingTemplate ? templateName : undefined
    };

    try {
      setSavingStatus('saving');
      setSaveMessage(isCreatingTemplate ? 'Salvando template...' : 'Salvando avaliação...');

      await createEvaluation(evaluationData);

      setSavingStatus('success');
      setSaveMessage(
        isCreatingTemplate
          ? 'Template salvo com sucesso!'
          : 'Avaliação salva com sucesso!'
      );

      // Limpar formulário após 2 segundos
      setTimeout(() => {
        if (!isCreatingTemplate) {
          setAppName('');
          setDescription('');
          setQuestions(questions.map(q => ({ ...q, likertScore: null, comment: '' })));
        }
        setIsCreatingTemplate(false);
        setTemplateName('');
        setSavingStatus('idle');
      }, 2000);

    } catch (error) {
      setSavingStatus('error');
      setSaveMessage('Erro ao salvar. Tente novamente.');
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isCreatingTemplate ? 'Criar Template de Avaliação' : 'Nova Avaliação'}
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
              onClick={() => setShowQuestionManager(!showQuestionManager)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${showQuestionManager
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Database className="w-4 h-4" />
              <span>Banco de Perguntas</span>
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
              <span>{isCreatingTemplate ? 'Criar Avaliação' : 'Criar Template'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Banco de Perguntas */}
      {showQuestionManager && (
        <div className="mb-8">
          <QuestionManager selectedQuestions={questions.map(q => q.text.trim())} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário Principal */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* App Info */}
            <AppInfoForm
              isCreatingTemplate={isCreatingTemplate}
              appName={appName}
              setAppName={setAppName}
              description={description}
              setDescription={setDescription}
              templateName={templateName}
              setTemplateName={setTemplateName}
            />

            {/* Questions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Questões ({questions.length})
                </h2>
              </div>

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
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-md p-6">
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
                      setQuestions(questions.map(q => ({ ...q, likertScore: null, comment: '' })));
                      setTemplateName('');
                    }}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Limpar Tudo
                  </button>

                  <button
                    type="submit"
                    disabled={saving || savingStatus === 'saving' || !currentUser || !appName.trim()}
                    className="flex items-center space-x-2 px-6 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving || savingStatus === 'saving' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{isCreatingTemplate ? 'Salvar Template' : 'Salvar Avaliação'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          {savingStatus !== 'idle' && (
            <div className={`p-4 rounded-lg ${savingStatus === 'success'
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

          {/* Quick Actions */}
          <QuickActionsMenu
            navigate={navigate}
            setShowQuestionManager={setShowQuestionManager}
            isCreatingTemplate={isCreatingTemplate}
            setIsCreatingTemplate={setIsCreatingTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;