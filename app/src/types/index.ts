export interface BaseQuestion {
  text: string;
  likertScore: number | null;
  comment: string;
  category: string;
  weight: number;
  order?: number;
  isCustom?: boolean;
  createdBy?: string;
  isPublic?: boolean;
}

// Tipo para questões no formulário (com ID temporário)
export interface FormQuestion extends BaseQuestion {
  id: string; // ID temporário para React
}

// Tipo para questões salvas no Firestore (sem ID)
export type StoredQuestion = BaseQuestion;

// Tipo para questões recuperadas do Firestore (com ID do documento)
export interface FirestoreQuestion extends BaseQuestion {
  id?: string; // ID do documento Firestore
}

export interface Evaluation {
  id?: string;
  appName: string;
  description?: string;
  questions: FirestoreQuestion[];
  evaluatorId: string;
  evaluatorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  totalScore?: number;
  averageScore?: number;
  isTemplate?: boolean;
  templateName?: string;
  sharedWith?: string[];
  isPublic?: boolean;
  originalEvaluationId?: string;
  isResponse?: boolean;
  respondedTo?: string;
}

export interface EvaluationFormData {
  appName: string;
  description?: string;
  questions: StoredQuestion[]; // Sem IDs
  isTemplate?: boolean;
  templateName?: string;
}

export interface UserQuestion {
  id?: string;
  text: string;
  category: string;
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
  usedCount: number;
}

export type QuestionFiltersTabs = "mine" | "public" | "templates";

export type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  questions: UserQuestion[];
};

export type UserRole = 'adm' | 'evaluator';

export type SavingStatus = "idle" | "saving" | "saved" | "error" | "success";
