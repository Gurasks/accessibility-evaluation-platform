import { FirestoreQuestion, StoredQuestion } from "../types";

export interface AIValidationResult {
  score: 1 | 2 | 3 | 4 | 5; // Escala Likert de 1 a 5
  feedback: string;
  validatedAt: Date;
  strengths: string[];
  improvements: string[];
}

/**
 * Serviço de simulação de validação por IA
 * Analisa questões de avaliação e retorna um feedback estruturado
 */
class AIValidationService {
  // Palavras-chave relacionadas a acessibilidade cognitiva e neurodivergência
  private readonly accessibilityKeywords = [
    'cognitiv',
    'neurodivergên',
    'memória',
    'atenção',
    'concentração',
    'compreensão',
    'linguagem simples',
    'clareza',
    'consistência',
    'previsibilidade',
    'orientação',
    'navegação',
    'foco',
    'distração',
    'sobrecarga',
    'autismo',
    'tdah',
    'dislexia',
    'aprend',
    'processamento',
    'visual',
    'auditiv',
    'motor',
    'tempo',
    'erro',
    'feedback',
    'ajuda',
    'suporte',
    'instrução',
    'simplicidade',
    'organização'
  ];

  // Categorias esperadas em uma avaliação de acessibilidade cognitiva
  private readonly expectedCategories = [
    'Navegação',
    'Compreensão',
    'Memória',
    'Atenção',
    'Linguagem',
    'Visual',
    'Interação',
    'Feedback',
    'Orientação',
    'Geral'
  ];

  /**
   * Simula a validação por IA de um conjunto de questões
   * @param questions Lista de questões a serem validadas
   * @param appContext Contexto da aplicação (nome, descrição, objetivos)
   * @returns Resultado da validação com score e feedback
   */
  validateQuestions(
    questions: (StoredQuestion | FirestoreQuestion)[],
    appContext?: {
      appName: string;
      description?: string;
      objectives?: string;
      targetAudience?: string;
    }
  ): AIValidationResult {
    // Análise das questões
    const totalQuestions = questions.length;
    const relevanceScores: number[] = [];
    const strengthsList: string[] = [];
    const improvementsList: string[] = [];

    // 1. Verificar se há questões suficientes
    if (totalQuestions === 0) {
      return {
        score: 1,
        feedback: "Nenhuma questão foi adicionada. É necessário incluir questões para realizar uma avaliação significativa de acessibilidade cognitiva.",
        validatedAt: new Date(),
        strengths: [],
        improvements: ["Adicionar questões relacionadas à acessibilidade cognitiva"]
      };
    }

    if (totalQuestions < 5) {
      improvementsList.push("Adicionar mais questões para uma avaliação mais abrangente (recomendado: mínimo 10 questões)");
    } else if (totalQuestions >= 10) {
      strengthsList.push(`Quantidade adequada de questões (${totalQuestions})`);
    }

    // 2. Analisar relevância de cada questão
    questions.forEach((q, index) => {
      const questionText = q.text.toLowerCase();
      const categoryText = q.category?.toLowerCase() || '';
      
      // Contar palavras-chave de acessibilidade
      const keywordMatches = this.accessibilityKeywords.filter(keyword => 
        questionText.includes(keyword) || categoryText.includes(keyword)
      ).length;

      // Calcular score de relevância (0-5)
      const relevanceScore = Math.min(5, keywordMatches * 1.5);
      relevanceScores.push(relevanceScore);
    });

    // 3. Analisar diversidade de categorias
    const uniqueCategories = new Set(
      questions.map(q => q.category).filter(Boolean)
    );
    
    const categoryDiversity = uniqueCategories.size;
    
    if (categoryDiversity >= 4) {
      strengthsList.push(`Boa diversidade de categorias (${categoryDiversity} categorias diferentes)`);
    } else if (categoryDiversity < 2) {
      improvementsList.push("Incluir questões de diferentes categorias para uma avaliação mais completa");
    }

    // 4. Verificar cobertura de aspectos importantes
    const hasNavigationQuestions = questions.some(q => 
      q.category?.toLowerCase().includes('navega') || 
      q.text.toLowerCase().includes('navega')
    );
    
    const hasComprehensionQuestions = questions.some(q => 
      q.category?.toLowerCase().includes('compreens') || 
      q.text.toLowerCase().includes('compreens') ||
      q.text.toLowerCase().includes('entend')
    );
    
    const hasMemoryQuestions = questions.some(q => 
      q.category?.toLowerCase().includes('memória') || 
      q.text.toLowerCase().includes('memória') ||
      q.text.toLowerCase().includes('lembr')
    );

    if (hasNavigationQuestions) {
      strengthsList.push("Inclui questões sobre navegação e orientação");
    } else {
      improvementsList.push("Considerar adicionar questões sobre facilidade de navegação");
    }

    if (hasComprehensionQuestions) {
      strengthsList.push("Inclui questões sobre compreensão e clareza");
    } else {
      improvementsList.push("Considerar adicionar questões sobre clareza e compreensão do conteúdo");
    }

    if (hasMemoryQuestions) {
      strengthsList.push("Inclui questões sobre carga cognitiva e memória");
    }

    // 5. Calcular score final (1-5)
    const avgRelevance = relevanceScores.reduce((a, b) => a + b, 0) / relevanceScores.length;
    const diversityBonus = Math.min(1, categoryDiversity / 4);
    const quantityBonus = Math.min(1, totalQuestions / 15);
    
    let finalScore = (avgRelevance * 0.5) + (diversityBonus * 2) + (quantityBonus * 1.5);
    finalScore = Math.max(1, Math.min(5, Math.round(finalScore)));

    // 6. Gerar feedback baseado no score
    const feedbackMessages: Record<number, string> = {
      5: "Excelente! Este cenário de avaliação demonstra forte alinhamento com os princípios de acessibilidade cognitiva para pessoas neurodivergentes. As questões são abrangentes, bem categorizadas e cobrem aspectos essenciais da experiência do usuário.",
      4: "Muito Bom! O cenário de avaliação está bem estruturado e aborda aspectos importantes de acessibilidade cognitiva. Com pequenos ajustes, pode se tornar ainda mais completo.",
      3: "Bom! O cenário possui uma base sólida, mas há espaço para melhorias na cobertura de aspectos específicos de acessibilidade cognitiva para usuários neurodivergentes.",
      2: "Adequado, mas necessita de melhorias significativas. Considere adicionar mais questões específicas sobre acessibilidade cognitiva e diversificar as categorias abordadas.",
      1: "Necessita de revisão substancial. O cenário atual não aborda adequadamente os aspectos críticos de acessibilidade para pessoas neurodivergentes."
    };

    const feedback = feedbackMessages[finalScore as keyof typeof feedbackMessages];

    // 7. Adicionar recomendações gerais
    if (improvementsList.length === 0 && finalScore >= 4) {
      improvementsList.push("Continuar monitorando e atualizando as questões conforme novas diretrizes surgirem");
    }

    return {
      score: finalScore as 1 | 2 | 3 | 4 | 5,
      feedback,
      validatedAt: new Date(),
      strengths: strengthsList.slice(0, 5), // Limitar a 5 pontos fortes
      improvements: improvementsList.slice(0, 5) // Limitar a 5 melhorias
    };
  }

  /**
   * Retorna uma descrição textual do score
   */
  getScoreLabel(score: 1 | 2 | 3 | 4 | 5): string {
    const labels: Record<number, string> = {
      1: "Necessita Revisão",
      2: "Adequado",
      3: "Bom",
      4: "Muito Bom",
      5: "Excelente"
    };
    return labels[score];
  }

  /**
   * Retorna uma cor associada ao score (para UI)
   */
  getScoreColor(score: 1 | 2 | 3 | 4 | 5): string {
    const colors: Record<number, string> = {
      1: "red",
      2: "orange",
      3: "yellow",
      4: "lime",
      5: "green"
    };
    return colors[score];
  }
}

export const aiValidationService = new AIValidationService();
