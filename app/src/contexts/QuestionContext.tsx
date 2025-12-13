import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import firestoreService from '../services/firestoreService';
import { Template, UserQuestion } from '../types';

interface QuestionContextData {
  userQuestions: UserQuestion[];
  publicQuestions: UserQuestion[];
  predefinedTemplates: Template[];
  loading: boolean;
  error: string | null;
  createQuestion: (text: string, category: string, isPublic: boolean) => Promise<string>;
  deleteQuestion: (id: string) => Promise<void>;
  toggleQuestionVisibility: (id: string, isPublic: boolean) => Promise<void>;
  loadQuestions: () => Promise<void>;
  clearError: () => void;
}

const QuestionContext = createContext<QuestionContextData | undefined>(undefined);

export const useQuestion = (): QuestionContextData => {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error('useQuestion deve ser usado dentro de QuestionProvider');
  }
  return context;
};

interface QuestionProviderProps {
  children: React.ReactNode;
}

export const QuestionProvider: React.FC<QuestionProviderProps> = ({ children }) => {
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>([]);
  const [publicQuestions, setPublicQuestions] = useState<UserQuestion[]>([]);
  const [predefinedTemplates, setPredefinedTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const createQuestion = async (text: string, category: string, isPublic: boolean): Promise<string> => {
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const questionId = await firestoreService.createUserQuestion({
        text,
        category,
        createdBy: currentUser.uid,
        isPublic
      });

      // Recarrega perguntas
      await loadQuestions();

      return questionId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pergunta';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Implementar delete no service
      // await firestoreService.deleteQuestion(id);

      // Atualiza localmente
      setUserQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar pergunta';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionVisibility = async (id: string, isPublic: boolean): Promise<void> => {
    // Implementar toggle
  };

  const loadQuestions = async (): Promise<void> => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      console.log("🔄 Carregando perguntas...");

      // Carrega perguntas do usuário
      const userQuestions = await firestoreService.getUserQuestions(currentUser.uid);
      console.log("📋 Perguntas do usuário:", userQuestions.length);

      // Carrega perguntas públicas
      const publicQuestions = await firestoreService.getPublicQuestions();
      console.log("🌐 Perguntas públicas:", publicQuestions.length);

      setUserQuestions(userQuestions);
      setPublicQuestions(publicQuestions);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar perguntas';
      setError(errorMessage);
      console.error("❌ Erro ao carregar perguntas:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  useEffect(() => {
    if (currentUser) {
      loadQuestions();
    } else {
      setUserQuestions([]);
      setPublicQuestions([]);
    }
  }, [currentUser]);

  const contextValue: QuestionContextData = {
    userQuestions,
    publicQuestions,
    predefinedTemplates,
    loading,
    error,
    createQuestion,
    deleteQuestion,
    toggleQuestionVisibility,
    loadQuestions,
    clearError
  };

  return (
    <QuestionContext.Provider value={contextValue}>
      {children}
    </QuestionContext.Provider>
  );
};