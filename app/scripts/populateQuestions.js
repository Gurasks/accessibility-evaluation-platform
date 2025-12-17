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
  {
    text: "A página ou tela apresenta claramente o propósito principal (por exemplo, título descritivo, cabeçalho, ou breve explicação sobre o que o usuário pode fazer ou encontrar ali)? [Peso: 3]",
    category: "ENTENDER_COISAS_USO",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O site ou aplicativo ajuda o usuário a manter o contexto (por exemplo, indica onde ele está no processo, na navegação ou no site, mesmo após se distrair)? [Peso: 2]",
    category: "Ajudar usuários a entender o que são as coisas e como usá-las",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "Os botões, links e campos interativos são fáceis de identificar e entender (o usuário consegue saber o que cada um faz antes de clicar)? [Peso: 3]",
    category: "Ajudar usuários a entender o que são as coisas e como usá-las",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "As ações realizadas (como clicar, enviar ou navegar) produzem resultados claros e previsíveis, sem mudanças inesperadas na interface? [Peso: 2]",
    category: "Ajudar usuários a entender o que são as coisas e como usá-las",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "Os ícones e símbolos usados na aplicação ajudam a entender o conteúdo e as ações disponíveis (como botões, menus e seções)? [Peso: 2]",
    category: "Ajudar usuários a entender o que são as coisas e como usá-las",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "Os símbolos são familiares e aparecem junto ao texto (por exemplo, ícone + rótulo), facilitando o entendimento mesmo para quem tem dificuldade de leitura? [Peso: 2]",
    category: "Ajudar usuários a entender o que são as coisas e como usá-las",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "As informações e funções principais (como busca, menu, ajuda ou ação principal da página) são fáceis de localizar e acessar rapidamente, sem confusão ou etapas desnecessárias? [Peso: 3]",
    category: "Ajudar usuários a encontrar o que precisam",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A aplicação possui uma função de busca clara e acessível, que ajuda o usuário a encontrar facilmente conteúdos ou recursos desejados? [Peso: 2]",
    category: "Ajudar usuários a encontrar o que precisam",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O menu e a estrutura de navegação são claros, organizados e fáceis de entender, permitindo que o usuário encontre o que procura sem confusão? [Peso: 2]",
    category: "Ajudar usuários a encontrar o que precisam",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "Os conteúdos em vídeo, áudio ou outras mídias são claros, divididos em partes curtas e compreensíveis, com opções de pausa, retorno e, quando possível, transcrição ou legenda disponíveis? [Peso: 2]",
    category: "Ajudar usuários a encontrar o que precisam",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O conteúdo escrito ou em áudio é claro, fácil de entender e ajuda o usuário a compreender as informações essenciais, sem ambiguidades, jargões complexos ou distrações desnecessárias? [Peso: 2]",
    category: "Usar conteúdo nítido e compreensível",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O layout da página organiza o conteúdo em blocos pequenos, claros e bem espaçados, utilizando espaço em branco suficiente para facilitar a leitura e compreensão sem sobrecarregar o usuário? [Peso: 3]",
    category: "Usar conteúdo nítido e compreensível",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O conteúdo da aplicação pode ser compreendido sem conhecimentos matemáticos, oferecendo explicações em palavras ou alternativas textuais em vez de depender de números ou fórmulas? [Peso: 3]",
    category: "Usar conteúdo nítido e compreensível",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A interface ajuda a evitar erros e orienta o usuário com mensagens claras, instruções passo a passo e exemplos, garantindo que ele saiba como preencher corretamente formulários ou executar tarefas? [Peso: 2]",
    category: "Ajudar usuários a evitar erros e saber como corrigi-los",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A aplicação permite que o usuário corrija facilmente erros e recupere ou salve informações sem perder progresso, mesmo em tarefas longas ou complexas? [Peso: 3]",
    category: "Ajudar usuários a evitar erros e saber como corrigi-los",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A interface fornece suporte adicional e informações úteis antes ou durante a tarefa (como lista de dados necessários, formatação esperada, tempo estimado ou consequências das ações)? [Peso: 2]",
    category: "Ajudar usuários a evitar erros e saber como corrigi-los",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A aplicação oferece recursos claros e previsíveis para desfazer ou voltar ações, permitindo que o usuário corrija erros rapidamente sem perder o que já fez? [Peso: 3]",
    category: "Ajudar usuários a evitar erros e saber como corrigi-los",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A interface ajuda o usuário a manter o foco, reduzindo distrações e permitindo desligá-las facilmente, se existirem? [Peso: 2]",
    category: "Ajudar usuários a se concentrarem",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A aplicação permite que o usuário se reoriente facilmente caso perca o foco, mostrando onde está, o que fez e qual será o próximo passo? [Peso: 2]",
    category: "Ajudar usuários a se concentrarem",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A aplicação lembra automaticamente das informações ou etapas anteriores, permitindo que o usuário complete o processo sem precisar memorizar dados ou repetir ações? [Peso: 2]",
    category: "Garantir que processos não dependam da memória",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O processo de login é simples, seguro e acessível, permitindo que o usuário acesse a conta sem precisar memorizar senhas complexas, realizar cálculos ou decifrar instruções complicadas?  [Peso: 3]",
    category: "Garantir que processos não dependam da memória",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O sistema de menu de voz permite que o usuário acesse ajuda ou informações facilmente, com opções limitadas, pausas adequadas, instruções claras e possibilidade de voltar, sem depender de memória ou de múltiplas etapas complexas? [Peso: 2]",
    category: "Garantir que processos não dependam da memória",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O usuário consegue obter ajuda ou suporte facilmente em qualquer ponto da aplicação, usando métodos acessíveis e compreensíveis, e dar feedback quando necessário? [Peso: 3]",
    category: "Fornecer ajuda e suporte",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A aplicação oferece suporte contextual acessível e personalizável, incluindo feedback visual ou sonoro, gráficos relevantes, conversão de texto em fala e lembretes controláveis, sem criar distrações para o usuário? [Peso: 3]",
    category: "Fornecer ajuda e suporte",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "As instruções e orientações da aplicação são claras, fáceis de entender e ajudam o usuário a navegar e completar tarefas corretamente? [Peso: 2]",
    category: "Fornecer ajuda e suporte",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "O conteúdo da aplicação é apresentado de forma clara e segura, permitindo que o usuário evite sobrecarga mental, distrações ou gatilhos, e complete suas tarefas sem confusão ou erros? [Peso: 3]",
    category: "Fornecer ajuda e suporte",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A aplicação permite que o usuário adapte e personalize a interface e o conteúdo, usando formatos familiares, símbolos, imagens, vídeos curtos e outras opções para reduzir esforço cognitivo e facilitar a compreensão? [Peso: 3]",
    category: "Permitir adaptação e personalização",
    order: 1,
    isPublic: true,
    createdBy: "system",
    usedCount: 0,
  },
  {
    text: "A aplicação funciona corretamente com extensões, complementos e APIs de tecnologia assistiva, permitindo que o usuário utilize essas ferramentas para interagir com o conteúdo sem problemas? [Peso: 2]",
    category: "Permitir adaptação e personalização",
    order: 1,
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