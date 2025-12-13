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
  } as CogaOptions;
};
