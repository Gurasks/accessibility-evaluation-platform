# 📋 Accessibility Evaluation Platform

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.0-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-4.0-646CFF)](https://vitejs.dev/)

Uma plataforma completa para avaliação de acessibilidade de aplicações, baseada nos padrões do **Cognitive and Learning Disabilities Accessibility Task Force**. Permite criar, gerenciar e compartilhar avaliações com escalas Likert e sistema de perguntas personalizáveis.

## ✨ Funcionalidades

### 🔐 Autenticação
- **Registro e Login** com Firebase Authentication
- **Sessão persistente** entre dispositivos
- **Recuperação de senha** (configurável)

### 📊 Sistema de Avaliação
- **Formulários dinâmicos** com escalas Likert (1-5)
- **Campo de comentários** para cada questão
- **Cálculo automático** de pontuação e média
- **Salvamento em nuvem** com Firebase Firestore

### 📝 Banco de Perguntas
- **Perguntas pré-definidas** para acessibilidade
- **Criação de perguntas personalizadas**
- **Perguntas públicas** compartilháveis entre usuários
- **Templates** de avaliação reutilizáveis

### 👥 Compartilhamento
- **Formulários compartilháveis** para outras pessoas responderem
- **Controle de acesso** por usuário
- **Visualização de respostas** coletivas

## 🚀 Pré-requisitos

- **Node.js** 18.0 ou superior
- **npm** 9.0 ou superior
- **Conta Google** para Firebase
- **Git** (opcional)

## ⚙️ Configuração do Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/Gurasks/accessibility-evaluation-platform.git
cd app
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar Firebase
A) Criar projeto no Firebase Console
1. Acesse console.firebase.google.com

2. Clique em "Adicionar projeto"

3. Digite o nome: accessibility-evaluation-platform

4. Desative Google Analytics (opcional)

5. Clique em "Criar projeto"

B) Configurar Authentication
1. No menu lateral: Build → Authentication

2. Clique em "Get started"

3. Vá para "Sign-in method"

4. Ative "Email/Password"

5. Clique em "Save"

C) Configurar Firestore Database
No menu lateral: Build → Firestore Database

1. Clique em "Create database"

2. Escolha "Start in test mode"

3. Selecione região (ex: southamerica-east1)

4. Clique em "Enable"

D) Registrar aplicação Web
1. No centro do painel: Clique no ícone </>

2. Nome do app: Accessibility Platform

3. Clique em "Register app"

4. Copie as configurações do Firebase

### 4. Configurar variáveis de ambiente
Crie o arquivo .env. na raiz do projeto (/app):
```bash
VITE_FIREBASE_API_KEY=SUA_API_KEY_AQUI
VITE_FIREBASE_AUTH_DOMAIN=SEU-PROJETO.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=SEU-PROJETO-ID
VITE_FIREBASE_STORAGE_BUCKET=SEU-PROJETO.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_NUMERO_ID
VITE_FIREBASE_APP_ID=1:SEU_NUMERO_ID:web:SEU_APP_ID
```
Onde encontrar essas informações:

- Firebase Console → ⚙️ → Configurações do projeto → Seus aplicativos

- Ou no objeto firebaseConfig gerado ao registrar o app

### 5. Popular banco de dados (opcional)
Para adicionar perguntas pré-definidas:

```bash
# Instalar dependências do script
npm install dotenv

# Executar script (substitua as credenciais no arquivo)
node scripts/populateQuestions.js
```

Ou use o comando npm:

```bash
npm run populate:questions
```

🏃‍♂️ Executando a Aplicação
Ambiente de desenvolvimento

```bash
# Iniciar servidor de desenvolvimento dentro da pasta app
npm run dev
# Iniciar servidor de desenvolvimento fora da pasta app
npm run app
```
### Acesse: http://localhost:5173
Build para produção
```bash
# Build do projeto
npm run build

# Preview do build
npm run preview
```
Deploy no Firebase Hosting
```bash
# Login no Firebase
firebase login

# Inicializar Firebase no projeto (apenas primeira vez)
firebase init
# Selecione: Hosting, Use existing project, dist, Yes (SPA)

# Deploy
npm run deploy

# Ou apenas hosting
npm run deploy:hosting
```