export type CogaCategoryKey =
  | "MEMORIA"
  | "ATENCAO"
  | "FUNCAO_EXECUTIVA"
  | "LINGUAGEM"
  | "ALFABETIZACAO"
  | "CALCULO_RACIOCINIO"
  | "PROCESSAMENTO_SENSORIAL"
  | "SAUDE_MENTAL_NEURODIVERGENCIA";

export interface CogaCategory {
  key: CogaCategoryKey;
  label: string;
  description: string;
}

export type CogaOptions = Record<CogaCategoryKey, CogaCategory>;
