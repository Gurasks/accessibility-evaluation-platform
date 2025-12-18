import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import firestoreService from '../services/firestoreService';
import { Evaluation, EvaluationFormData } from '../types';

interface EvaluationContextData {
  evaluations: Evaluation[];
  loading: boolean;
  error: string | null;
  createEvaluation: (data: EvaluationFormData) => Promise<string>;
  getUserEvaluations: () => Promise<void>;
  getEvaluationById: (id: string) => Promise<Evaluation | null>;
  updateEvaluation: (id: string, data: Partial<EvaluationFormData>) => Promise<void>;
  deleteEvaluation: (id: string) => Promise<void>;
  clearError: () => void;
}

const EvaluationContext = createContext<EvaluationContextData | undefined>(undefined);

export const useEvaluation = (): EvaluationContextData => {
  const context = useContext(EvaluationContext);
  if (context === undefined) {
    throw new Error('useEvaluation deve ser usado dentro de EvaluationProvider');
  }
  return context;
};

interface EvaluationProviderProps {
  children: React.ReactNode;
}

export const EvaluationProvider: React.FC<EvaluationProviderProps> = ({ children }) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, role } = useAuth();

  // ========== CRIAR AVALIAÇÃO ==========
  const createEvaluation = async (data: EvaluationFormData): Promise<string> => {
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const evaluationId = await firestoreService.createEvaluation(
        data,
        currentUser.uid,
        currentUser.email || ''
      );

      // Recarrega a lista de avaliações
      await getUserEvaluations();

      return evaluationId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar avaliação';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== BUSCAR AVALIAÇÕES DO USUÁRIO ==========
  const getUserEvaluations = async (): Promise<void> => {
    if (!currentUser) {
      setEvaluations([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let userEvals: Evaluation[];
      if (role === 'evaluator') {
        // Evaluators see all available evaluations
        userEvals = await firestoreService.getAllEvaluations();
      } else {
        // ADM see evaluations they created
        userEvals = await firestoreService.getUserEvaluations(currentUser.uid);
      }
      setEvaluations(userEvals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar avaliações';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ========== BUSCAR AVALIAÇÃO POR ID ==========
  const getEvaluationById = async (id: string): Promise<Evaluation | null> => {
    setLoading(true);
    setError(null);

    try {
      const evaluation = await firestoreService.getEvaluationById(id);
      return evaluation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar avaliação';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== ATUALIZAR AVALIAÇÃO ==========
  const updateEvaluation = async (id: string, data: Partial<EvaluationFormData>): Promise<void> => {
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      // If the current user is an evaluator submitting answers, pass responder info
      if (role === 'evaluator' && data.questions) {
        await firestoreService.updateEvaluation(id, data, { id: currentUser.uid, email: currentUser.email || '' });
      } else {
        await firestoreService.updateEvaluation(id, data);
      }

      // Atualiza a lista local
      await getUserEvaluations();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar avaliação';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== DELETAR AVALIAÇÃO ==========
  const deleteEvaluation = async (id: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    // Prevent evaluators from deleting evaluations
    if (role === 'evaluator') {
      throw new Error('Permissão negada: avaliadores não podem deletar avaliações');
    }

    setLoading(true);
    setError(null);

    try {
      await firestoreService.deleteEvaluation(id);

      // Remove da lista local
      setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar avaliação';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== LIMPAR ERRO ==========
  const clearError = (): void => {
    setError(null);
  };

  // ========== CARREGAR AVALIAÇÕES AO INICIAR ==========
  useEffect(() => {
    if (currentUser) {
      getUserEvaluations();
    } else {
      setEvaluations([]);
    }
  }, [currentUser]);

  const contextValue: EvaluationContextData = {
    evaluations,
    loading,
    error,
    createEvaluation,
    getUserEvaluations,
    getEvaluationById,
    updateEvaluation,
    deleteEvaluation,
    clearError
  };

  return (
    <EvaluationContext.Provider value={contextValue}>
      {children}
    </EvaluationContext.Provider>
  );
};