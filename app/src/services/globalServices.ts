import { CogaOptions } from "@/types/coga";

export const getLikertOptions = () => {
  return [
    { value: 1, label: "Discordo Totalmente", color: "bg-red-500" },
    { value: 2, label: "Discordo", color: "bg-red-400" },
    { value: 3, label: "Neutro", color: "bg-yellow-400" },
    { value: 4, label: "Concordo", color: "bg-green-400" },
    { value: 5, label: "Concordo Totalmente", color: "bg-green-500" },
  ];
};

export const getCogaCategories = () => {
  return {
    MEMORIA: {
      key: "MEMORIA",
      label: "Memória",
      description:
        "Relacionada à dificuldade de lembrar informações, instruções, etapas de processos ou retomar tarefas interrompidas.",
    },
    ATENCAO: {
      key: "ATENCAO",
      label: "Atenção",
      description:
        "Envolve limitações na manutenção do foco, controle de distrações e processamento simultâneo de informações.",
    },
    FUNCAO_EXECUTIVA: {
      key: "FUNCAO_EXECUTIVA",
      label: "Função executiva",
      description:
        "Dificuldades em planejar, organizar, tomar decisões, resolver problemas e concluir tarefas com múltiplas etapas.",
    },
    LINGUAGEM: {
      key: "LINGUAGEM",
      label: "Linguagem",
      description:
        "Relacionada à compreensão e produção de texto, especialmente quando há uso de linguagem complexa, ambígua ou técnica.",
    },
    ALFABETIZACAO: {
      key: "ALFABETIZACAO",
      label: "Alfabetização (leitura e escrita)",
      description:
        "Dificuldades associadas à leitura de textos extensos, escrita e compreensão de estruturas textuais.",
    },
    CALCULO_RACIOCINIO: {
      key: "CALCULO_RACIOCINIO",
      label: "Cálculo e raciocínio matemático",
      description:
        "Envolve limitações na compreensão de números, porcentagens, estatísticas e na realização de cálculos mentais.",
    },
    PROCESSAMENTO_SENSORIAL: {
      key: "PROCESSAMENTO_SENSORIAL",
      label: "Processamento sensorial",
      description:
        "Dificuldades no processamento de estímulos visuais, sonoros ou táteis, especialmente em ambientes com excesso de estímulos.",
    },
    SAUDE_MENTAL_NEURODIVERGENCIA: {
      key: "SAUDE_MENTAL_NEURODIVERGENCIA",
      label: "Saúde mental e neurodivergência",
      description:
        "Abrange condições como TDAH, autismo, dislexia, ansiedade e outras que podem impactar múltiplas funções cognitivas.",
    },
    ENTENDER_COISAS_USO: {
      key: "ENTENDER_COISAS_USO",
      label: "Ajudar usuários a entender o que são as coisas e como usá-las",
      description:
        "Princípios para ajudar usuários a compreender o propósito de interfaces e como interagir com elementos.",
    },
    ENCONTRAR_CONTEUDO: {
      key: "ENCONTRAR_CONTEUDO",
      label: "Ajudar usuários a encontrar o que precisam",
      description:
        "Diretrizes para facilitar a localização e acesso a conteúdos e funcionalidades importantes.",
    },
    CONTEUDO_COMPREENSIVEL: {
      key: "CONTEUDO_COMPREENSIVEL",
      label: "Usar conteúdo nítido e compreensível",
      description:
        "Recomendações para apresentar informações de forma clara, organizada e fácil de entender.",
    },
    EVITAR_ERROS: {
      key: "EVITAR_ERROS",
      label: "Ajudar usuários a evitar erros e saber como corrigi-los",
      description:
        "Estratégias para prevenir erros e fornecer suporte para correção quando ocorrem.",
    },
    MANTER_FOCO: {
      key: "MANTER_FOCO",
      label: "Ajudar usuários a se concentrarem",
      description:
        "Técnicas para reduzir distrações e ajudar usuários a manterem o foco em tarefas.",
    },
    PROCESSOS_SEM_MEMORIA: {
      key: "PROCESSOS_SEM_MEMORIA",
      label: "Garantir que processos não dependam da memória",
      description:
        "Design de processos que não exigem que usuários lembrem informações entre etapas.",
    },
    AJUDA_SUPORTE: {
      key: "AJUDA_SUPORTE",
      label: "Fornecer ajuda e suporte",
      description:
        "Recursos de ajuda acessíveis e suporte contextual para usuários quando necessário.",
    },
    ADAPTACAO_PERSONALIZACAO: {
      key: "ADAPTACAO_PERSONALIZACAO",
      label: "Permitir adaptação e personalização",
      description:
        "Capacidades para adaptar interfaces e conteúdos às necessidades individuais dos usuários.",
    },
  } as CogaOptions;
};
