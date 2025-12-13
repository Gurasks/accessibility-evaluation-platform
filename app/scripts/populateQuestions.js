import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';

// Carrega variáveis do .env.local
dotenv.config({ path: '.env' });

// ⚠️ SUBSTITUA COM SUAS CREDENCIAIS REAIS do Firebase Console
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Pegue essas credenciais do seu .env.local ou Firebase Console
console.log("🔧 Inicializando Firebase...");
console.log("📁 Projeto:", firebaseConfig.projectId);

// Verifica se as credenciais foram carregadas
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("AIzaSyB")) {
  console.error("❌ ERRO: Credenciais do Firebase não encontradas ou inválidas!");
  console.log("💡 Verifique seu arquivo .env.local");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultQuestions = [
  {
    text: "A aplicação fornece instruções claras e simples?",
    category: "Compreensão",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "Os elementos de interface são consistentes e previsíveis?",
    category: "Consistência",
    order: 2,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "Há suporte para diferentes formas de entrada (voz, toque, teclado)?",
    category: "Flexibilidade",
    order: 3,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "As cores têm contraste adequado para leitura?",
    category: "Visibilidade",
    order: 4,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A navegação é intuitiva e fácil de aprender?",
    category: "Navegação",
    order: 5,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "Há feedback claro para ações do usuário?",
    category: "Feedback",
    order: 6,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A aplicação previne e corrige erros do usuário?",
    category: "Prevenção de Erros",
    order: 7,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O tempo de resposta é adequado?",
    category: "Performance",
    order: 8,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O conteúdo é apresentado de forma lógica e hierárquica?",
    category: "Estrutura",
    order: 9,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "Há opções de personalização para diferentes necessidades?",
    category: "Personalização",
    order: 10,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
];

async function populateQuestions() {
  try {
    console.log("🚀 Iniciando população do banco de dados...");
    console.log(`📁 Coleção: userQuestions`);
    console.log(`📊 Total de perguntas: ${defaultQuestions.length}`);

    let successCount = 0;

    for (const question of defaultQuestions) {
      try {
        const questionWithDate = {
          ...question,
          createdAt: new Date()
        };

        await addDoc(collection(db, "userQuestions"), questionWithDate);
        successCount++;
        console.log(`✅ ${successCount}. ${question.text.substring(0, 50)}...`);
      } catch (error) {
        console.log(
          `❌ Erro na pergunta "${question.text.substring(0, 30)}...":`,
          error.message
        );
      }
    }

    console.log("\n🎉 CONCLUÍDO!");
    console.log(
      `✅ ${successCount} de ${defaultQuestions.length} perguntas adicionadas com sucesso!`
    );

    if (successCount < defaultQuestions.length) {
      console.log(
        `⚠️  ${defaultQuestions.length - successCount} perguntas falharam`
      );
    }

    console.log("\n📋 Para verificar, acesse o Firebase Console:");
    console.log("   https://console.firebase.google.com");
    console.log("   → Firestore Database → Coleção 'userQuestions'");
  } catch (error) {
    console.error("💥 ERRO CRÍTICO:", error.message);
    console.log("\n🔧 Solução de problemas:");
    console.log("   1. Verifique se as credenciais do Firebase estão corretas");
    console.log("   2. Verifique se o Firestore está habilitado no Console");
    console.log("   3. Verifique as regras de segurança do Firestore");
  }
}

// Executar
populateQuestions();