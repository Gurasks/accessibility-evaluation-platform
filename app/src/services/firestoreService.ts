import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  Evaluation,
  EvaluationFormData,
  FirestoreQuestion,
  StoredQuestion,
  UserQuestion,
} from "../types";
// Olhar com mais calma
class FirestoreService {
  // Coleções
  private get evaluationsCollection() {
    return collection(db, "evaluations");
  }

  private get userQuestionsCollection() {
    return collection(db, "userQuestions");
  }

  private get questionTemplatesCollection() {
    return collection(db, "questionTemplates");
  }

  // ========== AVALIAÇÕES ==========

  async createEvaluation(
    data: EvaluationFormData,
    userId: string,
    userEmail: string
  ): Promise<string> {
    try {
      // Já recebemos questões sem IDs, não precisamos remover
      const evaluationData = {
        appName: data.appName,
        description: data.description || "",
        questions: data.questions, // Já são StoredQuestion (sem IDs)
        evaluatorId: userId,
        evaluatorEmail: userEmail,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        totalScore: this.calculateTotalScore(data.questions),
        averageScore: this.calculateAverageScore(data.questions),
        isTemplate: data.isTemplate || false,
        templateName: data.templateName || "",
        sharedWith: [],
        isPublic: false,
      };

      const docRef = await addDoc(this.evaluationsCollection, evaluationData);

      // Incrementa contador de uso das perguntas personalizadas
      if (data.isTemplate) {
        await this.incrementQuestionUsage(data.questions, userId);
      }

      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
      throw new Error("Falha ao salvar avaliação no banco de dados");
    }
  }

  async getEvaluationById(evaluationId: string): Promise<Evaluation | null> {
    try {
      console.log(`🔍 Buscando avaliação ${evaluationId}...`);

      const docRef = doc(db, "evaluations", evaluationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const evaluation = this.mapFirestoreToEvaluation(
          docSnap.id,
          docSnap.data()
        );
        console.log(
          `✅ Avaliação ${evaluationId} encontrada:`,
          evaluation.appName
        );
        return evaluation;
      }

      console.log(`⚠️  Avaliação ${evaluationId} não encontrada`);
      return null;
    } catch (error) {
      console.error(`❌ Erro ao buscar avaliação ${evaluationId}:`, error);
      throw error;
    }
  }

  // ========== BUSCAR AVALIAÇÕES DO USUÁRIO ==========

  async getUserEvaluations(userId: string): Promise<Evaluation[]> {
    try {
      console.log(`🔍 Buscando avaliações do usuário ${userId}...`);

      // Query simplificada para evitar necessidade de índice
      const snapshot = await getDocs(collection(db, "evaluations"));

      const allEvaluations = snapshot.docs.map((doc) =>
        this.mapFirestoreToEvaluation(doc.id, doc.data())
      );

      // Filtra no JavaScript (não precisa de índice)
      const userEvaluations = allEvaluations.filter(
        (evalItem) => evalItem.evaluatorId === userId && !evalItem.isResponse
      );

      // Ordena por data (mais recente primeiro)
      userEvaluations.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      console.log(
        `✅ ${userEvaluations.length} avaliações encontradas para o usuário`
      );
      return userEvaluations;
    } catch (error) {
      console.error("❌ Erro ao buscar avaliações do usuário:", error);
      throw error;
    }
  }

  // ========== BUSCAR TODAS AS AVALIAÇÕES ==========

  async getAllEvaluations(): Promise<Evaluation[]> {
    try {
      console.log(`🔍 Buscando todas as avaliações...`);

      const snapshot = await getDocs(collection(db, "evaluations"));

      const allEvaluations = snapshot.docs.map((doc) =>
        this.mapFirestoreToEvaluation(doc.id, doc.data())
      );

      // Filtra apenas avaliações (não respostas)
      const evaluations = allEvaluations.filter(
        (evalItem) => !evalItem.isResponse
      );

      // Ordena por data (mais recente primeiro)
      evaluations.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      console.log(
        `✅ ${evaluations.length} avaliações encontradas`
      );
      return evaluations;
    } catch (error) {
      console.error("❌ Erro ao buscar todas as avaliações:", error);
      throw error;
    }
  }

  // ========== PERGUNTAS DO USUÁRIO ==========

  async createUserQuestion(
    questionData: Omit<UserQuestion, "id" | "createdAt" | "usedCount">
  ): Promise<string> {
    try {
      const question = {
        ...questionData,
        createdAt: Timestamp.now(),
        usedCount: 0,
      };

      const docRef = await addDoc(this.userQuestionsCollection, question);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar pergunta do usuário:", error);
      throw error;
    }
  }

  async getPublicQuestions(): Promise<UserQuestion[]> {
    try {
      console.log("🔍 Buscando perguntas públicas (método simplificado)...");

      // MÉTODO 1: Busca TUDO e filtra no JavaScript (não precisa de índice)
      const querySnapshot = await getDocs(this.userQuestionsCollection);

      const allQuestions = querySnapshot.docs.map((doc) =>
        this.mapFirestoreToUserQuestion(doc.id, doc.data())
      );

      // Filtra as públicas
      const publicQuestions = allQuestions.filter((q) => q.isPublic === true);

      console.log(
        `📊 Total: ${allQuestions.length}, Públicas: ${publicQuestions.length}`
      );

      // Ordena manualmente
      return publicQuestions.sort((a, b) => {
        // 1. Ordena por usedCount (maior primeiro)
        if (b.usedCount !== a.usedCount) {
          return b.usedCount - a.usedCount;
        }
        // 2. Ordena por data (mais recente primeiro)
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    } catch (error) {
      console.error("❌ Erro crítico ao buscar perguntas:", error);
      return []; // Retorna vazio para não quebrar a aplicação
    }
  }

  async updateEvaluation(
    evaluationId: string,
    data: Partial<EvaluationFormData>
  ): Promise<void> {
    try {
      console.log(`🔄 Atualizando avaliação ${evaluationId}...`);

      const docRef = doc(db, "evaluations", evaluationId);
      const updateData: any = {
        updatedAt: Timestamp.now(),
        ...data,
      };

      // Se houver questões, recalcula os scores
      if (data.questions) {
        updateData.totalScore = this.calculateTotalScore(data.questions);
        updateData.averageScore = this.calculateAverageScore(data.questions);
      }

      await updateDoc(docRef, updateData);
      console.log(`✅ Avaliação ${evaluationId} atualizada com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar avaliação ${evaluationId}:`, error);
      throw new Error(`Falha ao atualizar avaliação: ${error}`);
    }
  }

  // ========== DELETAR AVALIAÇÃO ==========

  async deleteEvaluation(evaluationId: string): Promise<void> {
    try {
      console.log(`🗑️  Deletando avaliação ${evaluationId}...`);

      const docRef = doc(db, "evaluations", evaluationId);
      await deleteDoc(docRef);

      console.log(`✅ Avaliação ${evaluationId} deletada com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao deletar avaliação ${evaluationId}:`, error);
      throw new Error(`Falha ao deletar avaliação: ${error}`);
    }
  }

  async getUserQuestions(userId: string): Promise<UserQuestion[]> {
    try {
      console.log(`🔍 Buscando perguntas do usuário ${userId}...`);

      // Método simplificado também
      const querySnapshot = await getDocs(this.userQuestionsCollection);

      const allQuestions = querySnapshot.docs.map((doc) =>
        this.mapFirestoreToUserQuestion(doc.id, doc.data())
      );

      // Filtra do usuário
      const userQuestions = allQuestions.filter((q) => q.createdBy === userId);

      console.log(
        `📊 Total: ${allQuestions.length}, Do usuário: ${userQuestions.length}`
      );

      // Ordena por data (mais recente primeiro)
      return userQuestions.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    } catch (error) {
      console.error("❌ Erro ao buscar perguntas do usuário:", error);
      return [];
    }
  }

  async incrementQuestionUsage(
    questions: StoredQuestion[],
    userId: string
  ): Promise<void> {
    try {
      const userQuestions = await this.getUserQuestions(userId);

      for (const question of questions) {
        const userQuestion = userQuestions.find(
          (q) => q.text === question.text
        );
        if (userQuestion && userQuestion.id) {
          const docRef = doc(db, "userQuestions", userQuestion.id);
          await updateDoc(docRef, {
            usedCount: userQuestion.usedCount + 1,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao incrementar uso de perguntas:", error);
    }
  }

  // ========== TEMPLATES PRÉ-DEFINIDOS ==========

  async getPredefinedTemplates(): Promise<
    {
      id: string;
      name: string;
      questions: StoredQuestion[];
      category: string;
      description?: string;
    }[]
  > {
    try {
      const querySnapshot = await getDocs(this.questionTemplatesCollection);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as any)
      );
    } catch (error) {
      console.error("Erro ao buscar templates pré-definidos:", error);
      return [];
    }
  }

  // ========== MÉTODOS PRIVADOS ==========

  private mapFirestoreToEvaluation(id: string, data: DocumentData): Evaluation {
    return {
      id,
      appName: data.appName,
      description: data.description,
      questions: (data.questions || []).map((q: any, index: number) => ({
        ...q,
        id: `q-${index}`, // Adiciona ID para as questões
      })) as FirestoreQuestion[],
      evaluatorId: data.evaluatorId,
      evaluatorEmail: data.evaluatorEmail,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      totalScore: data.totalScore,
      averageScore: data.averageScore,
      isTemplate: data.isTemplate || false,
      templateName: data.templateName,
      sharedWith: data.sharedWith || [],
      isPublic: data.isPublic || false,
      isResponse: data.isResponse || false,
      respondedTo: data.respondedTo,
      originalEvaluationId: data.originalEvaluationId,
    };
  }

  private mapFirestoreToUserQuestion(
    id: string,
    data: DocumentData
  ): UserQuestion {
    return {
      id,
      text: data.text,
      category: data.category,
      createdBy: data.createdBy,
      createdAt: data.createdAt?.toDate() || new Date(),
      isPublic: data.isPublic || false,
      usedCount: data.usedCount || 0,
    };
  }

  private calculateTotalScore(questions: StoredQuestion[]): number {
    return questions.reduce((total, question) => {
      return total + (question.likertScore || 0);
    }, 0);
  }

  private calculateAverageScore(questions: StoredQuestion[]): number {
    const validScores = questions.filter((q) => q.likertScore !== null);
    if (validScores.length === 0) return 0;

    const total = this.calculateTotalScore(validScores);
    return parseFloat((total / validScores.length).toFixed(2));
  }
}

export default new FirestoreService();
