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

  // ========== CENÁRIOS DE AVALIAÇÃO ==========

  async createEvaluation(
    data: EvaluationFormData,
    userId: string,
    userEmail: string
  ): Promise<string> {
    try {
      // Já recebemos questões sem IDs, não precisamos remover
      const evaluationData: any = {
        appName: data.appName,
        appUrl: data.appUrl || undefined,
        objectives: data.objectives || undefined,
        targetAudience: data.targetAudience || undefined,
        description: data.description || "",
        questions: data.questions, // Já são StoredQuestion (sem IDs)
        evaluatorId: userId,
        evaluatorEmail: userEmail,
        responses: [],
        responsesCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        totalScore: this.calculateTotalScore(data.questions),
        averageScore: this.calculateAverageScore(data.questions),
        isTemplate: data.isTemplate || false,
        templateName: data.templateName || "",
        sharedWith: [],
        isPublic: false,
      };

      // Remove any keys with `undefined` values to avoid Firestore rejecting the document
      Object.keys(evaluationData).forEach((k) => {
        if (evaluationData[k] === undefined) {
          delete evaluationData[k];
        }
      });

      const docRef = await addDoc(this.evaluationsCollection, evaluationData);

      // Incrementa contador de uso das perguntas personalizadas
      if (data.isTemplate) {
        await this.incrementQuestionUsage(data.questions, userId);
      }

      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar cenário de avaliação:", error);
      throw new Error("Falha ao salvar cenário de avaliação no banco de dados");
    }
  }

  async getEvaluationById(evaluationId: string): Promise<Evaluation | null> {
    try {
      console.log(`🔍 Buscando cenário de avaliação ${evaluationId}...`);

      const docRef = doc(db, "evaluations", evaluationId);
      let docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const initialData = docSnap.data();

        // If the requested doc is itself a response document, load the original evaluation instead
        if (initialData && initialData.isResponse && initialData.originalEvaluationId) {
          const parentRef = doc(db, "evaluations", initialData.originalEvaluationId);
          const parentSnap = await getDoc(parentRef);
          if (parentSnap.exists()) {
            docSnap = parentSnap;
          }
        }

          const data = docSnap.data() as DocumentData;
          let evaluation = this.mapFirestoreToEvaluation(docSnap.id, data);

        // Also fetch individual response documents (isResponse === true) linked to this evaluation
        try {
          const snapshot = await getDocs(collection(db, "evaluations"));
          const responseDocs = snapshot.docs
            .map(d => ({ id: d.id, data: d.data() }))
            .filter(d => d.data && d.data.isResponse === true && d.data.originalEvaluationId === docSnap.id);

          const mappedResponses = responseDocs.map(d => ({
            evaluatorId: d.data.evaluatorId,
            evaluatorEmail: d.data.evaluatorEmail,
            createdAt: d.data.createdAt?.toDate ? d.data.createdAt.toDate() : new Date(d.data.createdAt),
            questions: (d.data.questions || []).map((q: any, index: number) => ({ ...q, id: `r-${index}` })) as FirestoreQuestion[]
          }));

          evaluation = {
            ...evaluation,
            responses: mappedResponses,
            responsesCount: mappedResponses.length
          };
        } catch (e) {
          console.error('Erro ao buscar documentos de resposta relacionados:', e);
        }

        console.log(`✅ Cenário de avaliação ${evaluationId} encontrado:`, evaluation.appName);
        return evaluation;
      }

      console.log(`⚠️  Cenário de avaliação ${evaluationId} não encontrado`);
      return null;
    } catch (error) {
      console.error(`❌ Erro ao buscar cenário de avaliação ${evaluationId}:`, error);
      throw error;
    }
  }

  // ========== BUSCAR CENÁRIOS DE AVALIAÇÃO DO USUÁRIO ==========

  async getUserEvaluations(userId: string): Promise<Evaluation[]> {
    try {
      console.log(`🔍 Buscando cenários de avaliação do usuário ${userId}...`);

      // Query simplificada: buscar todos os documentos e agregar respostas
      const snapshot = await getDocs(collection(db, "evaluations"));

      const docs = snapshot.docs.map(d => ({ id: d.id, data: d.data() })) as { id: string; data: any }[];

      // Map all docs to evaluations
      const allEvaluations = docs.map(d => this.mapFirestoreToEvaluation(d.id, d.data));

      // Filter only parent evaluations created by this user
      const userEvaluations = allEvaluations.filter(e => e.evaluatorId === userId && !e.isResponse);

      // For each parent evaluation, compute aggregated responses from response docs
      const responseDocs = docs.filter(d => d.data && d.data.isResponse === true);

      userEvaluations.forEach(ev => {
        const responsesFor = responseDocs.filter(d => d.data.originalEvaluationId === ev.id);
        const mapped = responsesFor.map(d => ({
          evaluatorId: d.data.evaluatorId,
          evaluatorEmail: d.data.evaluatorEmail,
          createdAt: d.data.createdAt?.toDate ? d.data.createdAt.toDate() : new Date(d.data.createdAt),
          questions: (d.data.questions || []).map((q: any, idx: number) => ({ ...q, id: `r-${idx}` })) as FirestoreQuestion[],
          averageScore: d.data.averageScore,
          totalScore: d.data.totalScore
        }));

        ev.responses = mapped as any;
        ev.responsesCount = mapped.length;

        // Recompute parent average based on responses if present
        if (mapped.length > 0) {
          // average of response.averageScore values (0-5)
          const avg = mapped.reduce((s, r) => s + (typeof r.averageScore === 'number' ? r.averageScore : this.calculateAverageScore(r.questions)), 0) / mapped.length;
          ev.averageScore = parseFloat(avg.toFixed(2));
        }
      });

      // Ordena por data (mais recente primeiro)
      userEvaluations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      console.log(`✅ ${userEvaluations.length} cenários de avaliação encontrados para o usuário`);
      return userEvaluations;
    } catch (error) {
      console.error("❌ Erro ao buscar cenários de avaliação do usuário:", error);
      throw error;
    }
  }

  // ========== BUSCAR TODOS OS CENÁRIOS DE AVALIAÇÃO ==========

  async getAllEvaluations(): Promise<Evaluation[]> {
    try {
      console.log(`🔍 Buscando todos os cenários de avaliação...`);

      const snapshot = await getDocs(collection(db, "evaluations"));
      const docs = snapshot.docs.map(d => ({ id: d.id, data: d.data() })) as { id: string; data: any }[];

      const allEvaluations = docs.map(d => this.mapFirestoreToEvaluation(d.id, d.data));

      // Filtra apenas cenários de avaliação (não respostas)
      const evaluations = allEvaluations.filter(evalItem => !evalItem.isResponse);

      // Build map of response docs by originalEvaluationId
      const responseDocs = docs.filter(d => d.data && d.data.isResponse === true);

      evaluations.forEach(ev => {
        const responsesFor = responseDocs.filter(d => d.data.originalEvaluationId === ev.id);
        const mapped = responsesFor.map(d => ({
          evaluatorId: d.data.evaluatorId,
          evaluatorEmail: d.data.evaluatorEmail,
          createdAt: d.data.createdAt?.toDate ? d.data.createdAt.toDate() : new Date(d.data.createdAt),
          questions: (d.data.questions || []).map((q: any, idx: number) => ({ ...q, id: `r-${idx}` })) as FirestoreQuestion[],
          averageScore: d.data.averageScore,
          totalScore: d.data.totalScore
        }));

        ev.responses = mapped as any;
        ev.responsesCount = mapped.length;

        if (mapped.length > 0) {
          const avg = mapped.reduce((s, r) => s + (typeof r.averageScore === 'number' ? r.averageScore : this.calculateAverageScore(r.questions)), 0) / mapped.length;
          ev.averageScore = parseFloat(avg.toFixed(2));
        }
      });

      // Ordena por data (mais recente primeiro)
      evaluations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      console.log(`✅ ${evaluations.length} cenários de avaliação encontrados`);
      return evaluations;
    } catch (error) {
      console.error("❌ Erro ao buscar todos os cenários de avaliação:", error);
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
    data: Partial<EvaluationFormData>,
    responder?: { id: string; email: string }
  ): Promise<void> {
    try {
      console.log(`🔄 Atualizando cenário de avaliação ${evaluationId}...`);

      const docRef = doc(db, "evaluations", evaluationId);
      // If this update is a responder submitting answers, store them under `responses` instead of overwriting top-level questions
      if (responder && data.questions) {
        // For evaluator responses, create/update a separate response document
        // Search for an existing response doc for this evaluation by this responder
        const snapshot = await getDocs(collection(db, "evaluations"));
        const allEvals = snapshot.docs.map((d) => ({ id: d.id, data: d.data() }));

        const existingResponse = allEvals.find((d: any) => {
          const dd = d.data;
          return dd && dd.isResponse === true && dd.originalEvaluationId === evaluationId && dd.evaluatorId === responder.id;
        });

        const totalScore = this.calculateTotalScore(data.questions as StoredQuestion[]);
        const averageScore = this.calculateAverageScore(data.questions as StoredQuestion[]);

        if (existingResponse) {
          // Update the existing response document
          const respDocRef = doc(db, "evaluations", existingResponse.id);
          const updateData: any = {
            questions: data.questions,
            updatedAt: Timestamp.now(),
            totalScore,
            averageScore,
          };
          await updateDoc(respDocRef, updateData);
        } else {
          // Create a new response document linked to the original evaluation
          const responseDoc = {
            appName: data.appName || "",
            description: data.description || "",
            questions: data.questions,
            evaluatorId: responder.id,
            evaluatorEmail: responder.email,
            isResponse: true,
            originalEvaluationId: evaluationId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            totalScore,
            averageScore,
          };

          await addDoc(this.evaluationsCollection, responseDoc as any);

          // Increment responsesCount on the parent evaluation
          try {
            const parentSnap = await getDoc(docRef);
            if (parentSnap.exists()) {
              const parentData = parentSnap.data() as any;
              const newCount = (parentData.responsesCount || 0) + 1;
              await updateDoc(docRef, { responsesCount: newCount, updatedAt: Timestamp.now() });
            }
          } catch (e) {
            console.error('Erro ao atualizar contador de respostas do documento pai:', e);
          }
        }
      } else {
        const updateData: any = {
          updatedAt: Timestamp.now(),
          ...data,
        };

        // Remove undefined fields before calling updateDoc to avoid Firestore errors
        Object.keys(updateData).forEach((k) => {
          if (updateData[k] === undefined) {
            delete updateData[k];
          }
        });

        // If there are top-level questions being updated by author/admin, recalc scores as before
        if (data.questions) {
          updateData.totalScore = this.calculateTotalScore(data.questions);
          updateData.averageScore = this.calculateAverageScore(data.questions);
        }

        await updateDoc(docRef, updateData);
      }
      console.log(`✅ Cenário de avaliação ${evaluationId} atualizado com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar cenário de avaliação ${evaluationId}:`, error);
      throw new Error(`Falha ao atualizar cenário de avaliação: ${error}`);
    }
  }

  // ========== DELETAR CENÁRIO DE AVALIAÇÃO ==========

  async deleteEvaluation(evaluationId: string): Promise<void> {
    try {
      console.log(`🗑️  Deletando cenário de avaliação ${evaluationId}...`);

      const docRef = doc(db, "evaluations", evaluationId);
      await deleteDoc(docRef);

      console.log(`✅ Cenário de avaliação ${evaluationId} deletado com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao deletar cenário de avaliação ${evaluationId}:`, error);
      throw new Error(`Falha ao deletar cenário de avaliação: ${error}`);
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
    const responses = (data.responses || []).map((r: any) => ({
      evaluatorId: r.evaluatorId,
      evaluatorEmail: r.evaluatorEmail,
      createdAt: r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt),
      questions: (r.questions || []).map((q: any, index: number) => ({
        ...q,
        id: `r-${index}`,
      })) as FirestoreQuestion[],
    }));

    const originalQuestions = (data.questions || []).map((q: any, index: number) => ({
      ...q,
      id: `q-${index}`, // Adiciona ID para as questões
    })) as FirestoreQuestion[];

    // Calculate average scores if there are responses
    let calculatedQuestions = originalQuestions;
    let totalScore = data.totalScore || 0;
    let averageScore = data.averageScore || 0;

    if (responses.length > 0) {
      calculatedQuestions = originalQuestions.map((q, index) => {
        const scores = responses
          .map((r: any) => r.questions[index]?.likertScore)
          .filter((score: any) => score !== null && score !== undefined);

        const averageScoreForQuestion = scores.length > 0
          ? parseFloat((scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length).toFixed(2))
          : q.likertScore || 0;

        return {
          ...q,
          likertScore: averageScoreForQuestion,
        };
      });

      // Calculate weighted average score
      let totalWeightedScore = 0;
      let totalWeight = 0;
      calculatedQuestions.forEach(q => {
        const weight = q.weight || 1;
        totalWeightedScore += (q.likertScore || 0) * weight;
        totalWeight += weight;
      });
      averageScore = totalWeight > 0 ? parseFloat((totalWeightedScore / totalWeight).toFixed(2)) : 0;

      totalScore = this.calculateTotalScore(calculatedQuestions);
    }

    return {
      id,
      appName: data.appName,
      appUrl: data.appUrl || undefined,
      objectives: data.objectives || undefined,
      targetAudience: data.targetAudience || undefined,
      description: data.description,
      questions: calculatedQuestions,
      evaluatorId: data.evaluatorId,
      evaluatorEmail: data.evaluatorEmail,
      responses,
      responsesCount: data.responsesCount || responses.length,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      totalScore,
      averageScore,
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
      weight: data.weight || 1,
    };
  }

  private calculateTotalScore(questions: StoredQuestion[]): number {
    // Total ponderado: soma(score * weight) , tratando valores indefinidos
    return questions.reduce((total, question) => {
      const score = typeof question.likertScore === 'number' ? question.likertScore : 0;
      const weight = typeof question.weight === 'number' && question.weight > 0 ? question.weight : 1;
      return total + score * weight;
    }, 0);
  }

  private calculateAverageScore(questions: StoredQuestion[]): number {
    // Consider only answered questions (numeric scores)
    const answered = questions.filter((q) => typeof q.likertScore === 'number');
    if (answered.length === 0) return 0;

    // Weighted average: sum(score * weight) / sum(weights)
    const weightedSum = answered.reduce((sum, q) => {
      const weight = typeof q.weight === 'number' && q.weight > 0 ? q.weight : 1;
      return sum + (q.likertScore as number) * weight;
    }, 0);

    const totalWeight = answered.reduce((sum, q) => {
      return sum + (typeof q.weight === 'number' && q.weight > 0 ? q.weight : 1);
    }, 0);

    return parseFloat((weightedSum / totalWeight).toFixed(2));
  }
}

export default new FirestoreService();
