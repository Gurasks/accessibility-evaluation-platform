export type CogaCategoryKey =
  | "MEMORIA"
  | "ATENCAO"
  | "FUNCAO_EXECUTIVA"
  | "LINGUAGEM"
  | "ALFABETIZACAO"
  | "CALCULO_RACIOCINIO"
  | "PROCESSAMENTO_SENSORIAL"
  | "SAUDE_MENTAL_NEURODIVERGENCIA"
  | "ENTENDER_COISAS_USO"
  | "ENCONTRAR_CONTEUDO"
  | "CONTEUDO_COMPREENSIVEL"
  | "EVITAR_ERROS"
  | "MANTER_FOCO"
  | "PROCESSOS_SEM_MEMORIA"
  | "AJUDA_SUPORTE"
  | "ADAPTACAO_PERSONALIZACAO";

export interface CogaCategory {
  key: CogaCategoryKey;
  label: string;
  description: string;
}

export type CogaOptions = Record<CogaCategoryKey, CogaCategory>;
