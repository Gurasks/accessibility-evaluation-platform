import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  // Suas credenciais
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const predefinedTemplates = [
  {
    name: "Acessibilidade Web Básica",
    category: "Acessibilidade",
    description: "Avaliação básica de acessibilidade para aplicações web",
    questions: [
      {
        text: "O contraste de cores é adequado para leitura?",
        category: "Acessibilidade",
      },
      {
        text: "A aplicação é navegável apenas com teclado?",
        category: "Acessibilidade",
      },
      {
        text: "As imagens possuem texto alternativo descritivo?",
        category: "Acessibilidade",
      },
      {
        text: "Os formulários possuem labels associados?",
        category: "Acessibilidade",
      },
      {
        text: "A hierarquia de cabeçalhos é correta?",
        category: "Acessibilidade",
      },
    ],
  },
  {
    name: "Usabilidade Mobile",
    category: "Usabilidade",
    description: "Avaliação de usabilidade para aplicativos móveis",
    questions: [
      {
        text: "Os botões são grandes o suficiente para toque?",
        category: "Usabilidade",
      },
      { text: "A navegação é intuitiva?", category: "Usabilidade" },
      {
        text: "O app funciona bem em diferentes orientações?",
        category: "Usabilidade",
      },
      { text: "O tempo de resposta é aceitável?", category: "Desempenho" },
      {
        text: "Há feedback visual para ações do usuário?",
        category: "Feedback",
      },
    ],
  },
  {
    name: "Cognitive Accessibility",
    category: "Acessibilidade Cognitiva",
    description: "Avaliação focada em deficiências cognitivas",
    questions: [
      {
        text: "O texto é simples e fácil de entender?",
        category: "Compreensão",
      },
      {
        text: "As instruções são claras e passo a passo?",
        category: "Instruções",
      },
      { text: "Há ajuda contextual disponível?", category: "Suporte" },
      {
        text: "A interface evita distrações desnecessárias?",
        category: "Foco",
      },
      {
        text: "O fluxo de trabalho é lógico e previsível?",
        category: "Previsibilidade",
      },
    ],
  },
];

async function seedTemplates() {
  try {
    for (const template of predefinedTemplates) {
      await addDoc(collection(db, "questionTemplates"), template);
      console.log(`Template criado: ${template.name}`);
    }
    console.log("Todos os templates foram criados com sucesso!");
  } catch (error) {
    console.error("Erro ao criar templates:", error);
  }
}

seedTemplates();
