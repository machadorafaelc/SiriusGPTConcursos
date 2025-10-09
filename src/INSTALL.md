# Instalação e Configuração - Sirius GPT Concursos

## 🚀 Como executar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

O arquivo `.env.local` já está configurado com:

```env
VITE_API_BASE_URL=http://localhost:8787
```

Ajuste conforme necessário se sua API estiver em outra URL.

### 3. Executar em desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## 📦 Dependências necessárias

### Dependências de desenvolvimento (adicionar se ainda não existem)

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Dependências principais já configuradas

- React
- TypeScript
- Lucide React (ícones)
- Recharts (gráficos)
- Shadcn/ui (componentes)

## 🎨 Estrutura do projeto

```
/
├── config/           # Configurações (env.ts)
├── services/         # Serviços e API
│   ├── apiClient.ts
│   ├── chat.ts
│   ├── consultaEditais.ts
│   ├── buscarJuris.ts
│   ├── simuladorProva.ts
│   ├── analisadorDesempenho.ts
│   └── gerarPlano.ts
├── components/       # Componentes React
│   ├── Chatbot.tsx
│   ├── Dashboard.tsx
│   ├── Ferramentas.tsx
│   ├── Header.tsx
│   ├── LandingPage.tsx
│   ├── SiriusOrientador.tsx
│   └── ui/          # Componentes Shadcn
├── styles/          # CSS global
│   └── globals.css
├── tailwind.config.js
├── postcss.config.js
└── App.tsx
```

## 🌐 API Backend

### Endpoints esperados

Os serviços estão configurados para consumir os seguintes endpoints:

- `POST /api/chat` - Chat com RAG e citações
- `POST /api/consulta-editais` - Consulta editais
- `POST /api/juris` - Busca jurisprudência
- `POST /api/simulador` - Gera simulados
- `POST /api/analisar-desempenho` - Analisa desempenho
- `POST /api/plano` - Gera plano de estudos

### Modo Mock

Atualmente, todos os serviços possuem **dados mock** que retornam automaticamente após um pequeno delay, permitindo testar a interface sem backend real.

Para conectar à API real:
1. Implemente os endpoints no backend
2. Configure `VITE_API_BASE_URL` no `.env.local`
3. Remova os blocos `catch` com mock dos arquivos em `/services/`

## 🎯 Funcionalidades implementadas

### ✅ Configuração
- [x] Tailwind CSS v4 configurado
- [x] PostCSS configurado
- [x] Tema Universo com classes utilitárias
- [x] Variáveis de ambiente

### ✅ Serviços
- [x] API Client genérico
- [x] Chat com RAG
- [x] Consulta Editais
- [x] Busca Jurisprudência
- [x] Simulador de Prova
- [x] Analisador de Desempenho
- [x] Gerador de Plano

### ✅ Componentes
- [x] Chatbot com governança de IA
- [x] Sistema de citações rastreáveis
- [x] Badge de rastreabilidade
- [x] Bloqueio de respostas sem fonte
- [x] Ferramentas de estudo
- [x] Dashboard hierárquico
- [x] GPT Orientador Sirius

### ✅ UX/Acessibilidade
- [x] Estados de carregamento (Skeleton)
- [x] Mensagens de erro em português
- [x] Enter envia mensagem
- [x] Shift+Enter quebra linha
- [x] Tema visual "Universo"
- [x] Cards com efeito hover
- [x] Contraste adequado (AA)

## 🔒 Governança de IA

### Política de citações

Todas as respostas do chatbot devem incluir citações rastreáveis. Se uma resposta não possuir citações:

1. A resposta é marcada como `blocked`
2. Um aviso é exibido ao usuário
3. Um botão "Tentar novamente com RAG" é oferecido

### Badge rastreável

Respostas com citações exibem um badge verde "Rastreável" para indicar que a resposta possui fontes verificadas.

## 📝 Próximos passos

1. Implementar backend real com os endpoints
2. Conectar ao banco de dados (Supabase ou similar)
3. Implementar autenticação de usuários
4. Adicionar exportação de cronogramas (.csv)
5. Implementar sistema de revisões
6. Adicionar mais ferramentas de estudo

## 🆘 Problemas comuns

### Erro de importação do Tailwind

Se houver erro com imports do Tailwind, certifique-se de que:
- `tailwind.config.js` existe
- `postcss.config.js` existe
- `@import "tailwindcss";` está no topo do `globals.css`

### API não responde

Verifique:
- `VITE_API_BASE_URL` no `.env.local`
- Backend está rodando
- CORS está configurado no backend
- Endpoints estão corretos

### Componentes Shadcn não funcionam

Certifique-se de que todos os componentes necessários estão na pasta `/components/ui/`.

## 📧 Suporte

Para dúvidas ou problemas, consulte a documentação do projeto ou entre em contato com a equipe de desenvolvimento.

---

**Sirius GPT Concursos** - Um universo de possibilidades para sua aprovação! 🌟
