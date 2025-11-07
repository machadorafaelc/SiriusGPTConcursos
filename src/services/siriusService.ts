// Serviço especializado para o Sirius Orientador
import { openaiService, type OpenAIMessage } from "./openaiService";
import { conhecimentoEdital, getInfoConcurso } from "../data/editalConhecimento";
import { agentCommunicationService } from "./agentCommunication";
import { agentRouter } from "./agentRouter";
import { distribuirPlano } from "../modules/envioPlano";

export interface PerfilAluno {
  horasSemanais: number;
  prazoSemanas: number;
  disciplinas: string[];
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  concurso?: string;
  banca?: string;
  nome?: string;
}

export interface PlanoSemanal {
  semana: number;
  foco: string;
  tarefas: string[];
}

export interface PlanoCompleto {
  perfil: PerfilAluno;
  cronograma: PlanoSemanal[];
  distribuicaoPorDisciplina: Record<string, PlanoSemanal[]>;
  dataCriacao: Date;
  status: 'em_andamento' | 'concluido' | 'pausado';
}

export class SiriusService {
  private conversas: Map<string, string[]> = new Map();
  private perfis: Map<string, Partial<PerfilAluno>> = new Map();

  // Inicia uma nova conversa com o Sirius
  iniciarConversa(sessionId: string): string {
    console.log("🔍 iniciarConversa chamado para sessão:", sessionId);
    console.log("🔍 Conversas existentes:", Array.from(this.conversas.keys()));
    
    // Verificar se já existe uma conversa para esta sessão
    if (this.conversas.has(sessionId)) {
      console.log("⚠️ Conversa já iniciada para sessão:", sessionId);
      const mensagemExistente = this.conversas.get(sessionId)![0];
      console.log("📝 Retornando mensagem existente:", mensagemExistente.substring(0, 50) + "...");
      return mensagemExistente; // Retorna a mensagem inicial existente
    }

    console.log("🚀 Iniciando nova conversa para sessão:", sessionId);
    const infoConcurso = getInfoConcurso();
    const mensagemInicial = `👋 Olá! Eu sou o Sirius Orientador, seu mentor de elite em planejamento de estudos!

Sou especializado no ${infoConcurso.concurso} da ${infoConcurso.instituicao} e conheço todo o edital verticalizado com ${infoConcurso.totalDisciplinas} disciplinas e ${infoConcurso.totalTopicos} tópicos específicos.

Para criar seu plano personalizado, preciso conhecer melhor seu perfil. Vamos começar:

**Qual concurso você está estudando?** (Se for o Policial Legislativo Federal, posso criar um plano baseado no edital oficial)`;

    this.conversas.set(sessionId, [mensagemInicial]);
    console.log("✅ Conversa criada e salva para sessão:", sessionId);
    return mensagemInicial;
  }

  // Processa uma mensagem do aluno
  async processarMensagem(sessionId: string, mensagem: string): Promise<string> {
    const conversa = this.conversas.get(sessionId) || [];
    const perfil = this.perfis.get(sessionId) || {};

    // Verificar se é o botão "Criar Plano de Estudos 🚀"
    if (mensagem.includes("Criar Plano de Estudos") || mensagem.includes("🚀")) {
      console.log("🚀 Detectado botão de criação de plano");
      
      // Usar perfil existente ou criar perfil padrão
      const perfilCompleto = this.perfis.get(sessionId) || this.criarPerfilPadrao();
      
      if (perfilCompleto.horasSemanais && perfilCompleto.prazoSemanas && perfilCompleto.disciplinas) {
        const plano = await this.gerarPlanoCompleto(perfilCompleto as PerfilAluno);
        conversa.push(`Aluno: ${mensagem}`);
        conversa.push(`Sirius: ${plano}`);
        this.conversas.set(sessionId, conversa);
        return plano;
      } else {
        const resposta = "Primeiro preciso conhecer seu perfil! Me diga quantas horas por semana você pode estudar e em quantas semanas quer se preparar.";
        conversa.push(`Aluno: ${mensagem}`);
        conversa.push(`Sirius: ${resposta}`);
        this.conversas.set(sessionId, conversa);
        return resposta;
      }
    }

    // Adiciona a mensagem do aluno à conversa
    conversa.push(`Aluno: ${mensagem}`);
    this.conversas.set(sessionId, conversa);

    try {
      // Usar OpenAI para gerar resposta do Sirius Orientador
      const systemPrompt = this.getSystemPrompt(perfil);
      const history: OpenAIMessage[] = conversa
        .filter(msg => msg.startsWith('Sirius: '))
        .map(msg => ({
          role: "assistant" as const,
          content: msg.replace('Sirius: ', '')
        }));

      const resposta = await openaiService.chatWithAgent(
        systemPrompt,
        mensagem,
        history
      );
      
      // Atualiza o perfil se necessário
      this.perfis.set(sessionId, perfil);
      this.conversas.set(sessionId, [...conversa, `Sirius: ${resposta}`]);

      return resposta;
    } catch (error) {
      console.error("Erro ao chamar OpenAI para Sirius:", error);
      
      // Fallback para lógica de mock
      const resposta = await this.analisarMensagem(mensagem, perfil, conversa);
      this.perfis.set(sessionId, perfil);
      this.conversas.set(sessionId, [...conversa, `Sirius: ${resposta}`]);
      return resposta;
    }
  }

  private getSystemPrompt(perfil: Partial<PerfilAluno>): string {
    const infoConcurso = getInfoConcurso();
    
    return `Você é o Sirius Orientador, especializado no ${infoConcurso.concurso} da ${infoConcurso.instituicao}.

CONHECIMENTO DO EDITAL:
- Concurso: ${infoConcurso.concurso}
- Instituição: ${infoConcurso.instituição}
- Status: ${infoConcurso.status}
- Total de disciplinas: ${infoConcurso.totalDisciplinas}
- Total de tópicos: ${infoConcurso.totalTopicos}

DISCIPLINAS DISPONÍVEIS NO CONCURSO:
${conhecimentoEdital.disciplinas.map(d => `- ${d.nome} (${d.topicos.length} tópicos)`).join('\n')}

PERFIL ATUAL DO ALUNO:
- Nome: ${perfil.nome || 'não informado'}
- Horas semanais: ${perfil.horasSemanais || 'não informado'}
- Prazo: ${perfil.prazoSemanas || 'não informado'} semanas
- Nível: ${perfil.nivel || 'não informado'}
- Disciplinas: ${perfil.disciplinas?.join(', ') || 'não informado'}
- Concurso: ${perfil.concurso || 'não especificado'}
- Banca: ${perfil.banca || 'não especificada'}

SUA MISSÃO:
1. Coletar informações do perfil do aluno de forma natural e conversacional
2. Criar um plano de estudos personalizado baseado no edital oficial
3. Ser amigável, motivador e didático
4. Usar os tópicos específicos do edital para criar tarefas precisas

FLUXO DE CONVERSA:
- Se não tem nome: pergunte o nome
- Se não tem horas: pergunte quantas horas por semana pode estudar
- Se não tem prazo: pergunte o prazo até a prova
- Se não tem nível: pergunte o nível (iniciante, intermediário, avançado)
- Se não tem disciplinas: pergunte quais disciplinas precisa estudar (use as disciplinas do edital)
- Se tem tudo: gere o plano de estudos baseado no edital

IMPORTANTE: NUNCA repita a mesma pergunta. Use o conhecimento do edital para criar planos precisos!`;
  }

  private async analisarMensagem(mensagem: string, perfil: Partial<PerfilAluno>, conversa: string[]): Promise<string> {
    const msg = mensagem.toLowerCase();

    // Se ainda não tem nome
    if (!perfil.nome) {
      perfil.nome = mensagem.trim();
      return `Prazer em conhecê-lo, ${perfil.nome}! 😊

Agora vou te fazer algumas perguntas para criar seu plano personalizado:

**1. Quantas horas por semana você pode dedicar aos estudos?**
(Ex: 10, 15, 20, 30+ horas)`;
    }

    // Se ainda não tem horas semanais
    if (!perfil.horasSemanais) {
      const horas = parseInt(msg.match(/\d+/)?.[0] || '0');
      if (horas > 0) {
        perfil.horasSemanais = horas;
        return `Perfeito! ${horas} horas por semana é um bom tempo para estudar! 📚

**2. Qual é o prazo que você tem para a prova?**
(Ex: 3 meses, 6 meses, 1 ano, ou me diga em semanas)`;
      } else {
        return `Por favor, me diga quantas horas por semana você pode estudar. 
(Ex: 10, 15, 20, 30+ horas)`;
      }
    }

    // Se ainda não tem prazo
    if (!perfil.prazoSemanas) {
      const meses = parseInt(msg.match(/(\d+)\s*mes/i)?.[1] || '0');
      const semanas = parseInt(msg.match(/(\d+)\s*semana/i)?.[1] || '0');
      
      if (meses > 0) {
        perfil.prazoSemanas = meses * 4;
      } else if (semanas > 0) {
        perfil.prazoSemanas = semanas;
      } else {
        return `Por favor, me diga seu prazo em meses ou semanas.
(Ex: 3 meses, 6 meses, 20 semanas)`;
      }

      return `Entendi! ${perfil.prazoSemanas} semanas é um prazo ${perfil.prazoSemanas >= 20 ? 'bom' : 'desafiador'}! ⏰

**3. Qual é seu nível atual de conhecimento?**
- Iniciante (começando do zero)
- Intermediário (já tem alguma base)
- Avançado (já estudou bastante)`;
    }

    // Se ainda não tem nível
    if (!perfil.nivel) {
      if (msg.includes('iniciante') || msg.includes('zero')) {
        perfil.nivel = 'iniciante';
      } else if (msg.includes('intermediario') || msg.includes('intermediário')) {
        perfil.nivel = 'intermediario';
      } else if (msg.includes('avancado') || msg.includes('avançado')) {
        perfil.nivel = 'avancado';
      } else {
        return `Por favor, escolha uma das opções:
- Iniciante (começando do zero)
- Intermediário (já tem alguma base)  
- Avançado (já estudou bastante)`;
      }

      return `Perfeito! Nível ${perfil.nivel} identificado! 🎯

**4. Quais disciplinas você quer estudar?**
(Ex: Direito Administrativo, Português, Raciocínio Lógico, etc.)

Você pode me dizer todas de uma vez ou uma por vez.`;
    }

    // Se ainda não tem disciplinas
    if (!perfil.disciplinas || perfil.disciplinas.length === 0) {
      const disciplinasDisponiveis = [
        'Direito Administrativo',
        'Português – Gramática', 
        'Raciocínio Lógico-Matemático',
        'Direito Constitucional',
        'Direito Penal',
        'Informática',
        'Atualidades'
      ];

      // Extrai disciplinas mencionadas
      const disciplinasMencionadas = disciplinasDisponiveis.filter(disc => 
        msg.includes(disc.toLowerCase().split(' ')[0])
      );

      if (disciplinasMencionadas.length > 0) {
        perfil.disciplinas = disciplinasMencionadas;
      } else {
        return `Por favor, me diga quais disciplinas você quer estudar. 

Disciplinas disponíveis:
${disciplinasDisponiveis.map(d => `• ${d}`).join('\n')}

Você pode escolher quantas quiser!`;
      }

      // Se tem todas as informações, gera o plano
      if (perfil.horasSemanais && perfil.prazoSemanas && perfil.nivel && perfil.disciplinas) {
        return await this.gerarPlanoCompleto(perfil as PerfilAluno);
      }
    }

    return `Entendi! Vou processar essas informações e criar seu plano personalizado...`;
  }

  private extrairPerfilDoHistorico(historico: OpenAIMessage[]): PerfilAluno | null {
    // Tenta extrair informações do histórico de conversa
    const ultimaMensagem = historico[historico.length - 1]?.content || '';
    
    // Se contém informações suficientes, criar perfil
    if (ultimaMensagem.includes('horas') && ultimaMensagem.includes('semanas')) {
      const horasMatch = ultimaMensagem.match(/(\d+)\s*horas?/i);
      const semanasMatch = ultimaMensagem.match(/(\d+)\s*semanas?/i);
      
      if (horasMatch && semanasMatch) {
        return {
          nome: 'Aluno',
          nivel: 'intermediario',
          horasSemanais: parseInt(horasMatch[1]),
          prazoSemanas: parseInt(semanasMatch[1]),
          disciplinas: ['Direito Administrativo', 'Português', 'Raciocínio Lógico-Matemático']
        };
      }
    }
    
    return null;
  }

  private criarPerfilPadrao(): PerfilAluno {
    return {
      nome: 'Aluno',
      nivel: 'intermediario',
      horasSemanais: 20,
      prazoSemanas: 24,
      disciplinas: ['Direito Administrativo', 'Português', 'Raciocínio Lógico-Matemático', 'Direito Constitucional']
    };
  }

  private async gerarPlanoCompleto(perfil: PerfilAluno): Promise<string> {
    // Simula geração do plano (em produção seria integrado com IA)
    const plano = this.criarPlanoAdaptativo(perfil);
    
    // Criar plano no formato galáctico V3
    const planoGalactico = this.criarPlanoGalacticoV3(perfil, plano);
    
    // Distribuir plano para os agentes especializados
    await distribuirPlano(planoGalactico);
    
    const duracaoMeses = Math.ceil(perfil.prazoSemanas / 4);
    const cargaDiaria = Math.round(perfil.horasSemanais / 5);
    const totalHoras = perfil.horasSemanais * perfil.prazoSemanas;
    
    return `🌌 **Plano Galáctico de Estudos**  
Câmara dos Deputados — Policial Legislativo Federal  

⏳ **Duração:** ${duracaoMeses} meses  
📅 **Frequência:** 5 dias/semana  
🕓 **Carga diária:** ${cargaDiaria}h  
💫 **Total estimado:** ${totalHoras}h de estudo  

📊 **Distribuição por Disciplina**  
${perfil.disciplinas.map((disc, i) => {
  const percentual = Math.round(100 / perfil.disciplinas.length);
  const icones = ['📚', '🧮', '⚖️', '🏛️', '🚨', '⚡', '📋', '🤝', '💻', '🌐', '🗣️', '🎯'];
  return `${icones[i] || '📖'} ${disc} — ${percentual}%`;
}).join('\n')}

🪐 **Distribuição Semanal (${perfil.horasSemanais}h/semana)**  
**Segunda-feira**  
08:00–09:00 → ${perfil.disciplinas[0] || 'Português'}  
09:00–09:45 → ${perfil.disciplinas[1] || 'Lógico'}  
10:00–11:15 → ${perfil.disciplinas[2] || 'Constitucional'}  

**Terça-feira**  
08:00–09:30 → ${perfil.disciplinas[3] || 'Administrativo'}  
09:45–11:15 → ${perfil.disciplinas[4] || 'Penal'}  

**Quarta-feira**  
08:00–09:30 → ${perfil.disciplinas[5] || 'Processual Penal'}  
09:45–11:15 → Legislação Especial  

**Quinta-feira**  
08:00–09:00 → Informática  
09:00–10:00 → Direito Digital  
10:00–11:00 → Direitos Humanos  

**Sexta-feira**  
08:00–08:45 → Inglês  
08:45–10:00 → Conhecimentos Específicos  
10:15–11:15 → Revisão Integrada  

🌠 **Estrutura Modular (${duracaoMeses} meses)**  
1️⃣ Fundamentos e Leitura da Lei Seca → Leitura dirigida + anotações + 10 questões diárias  
2️⃣ Interpretação e Compreensão → Análise textual + primeiros simulados  
3️⃣ Consolidação Teórica → Revisões semanais + exercícios intermediários  
4️⃣ Questões e Jurisprudência → Prática intensiva + fichas-resumo automáticas  
5️⃣ Revisão Avançada → Ciclos curtos + simulados temáticos  
6️⃣ Simulados Gerais + Redação → Treino de tempo e síntese final  

🧠 **Métodos Aplicados**  
- Pomodoro (25/5): foco e ritmo sem fadiga  
- Revisão espaçada (1–7–30): retenção de longo prazo  
- Active Recall: revisão ativa com autoexplicação  
- Interleaving: alternância entre disciplinas para consolidar memórias  
- Checkpoints: simulados a cada domingo para medir evolução  

✨ **Função dos GPTs no Cenário**  
Cada GPT disciplinar atuará como instrutor autônomo:  
- recebe seu tempo, metas e módulo atual;  
- aplica o método definido;  
- gera resumos e exercícios baseados na semana.  

🛰️ Exemplo:  
> "Hoje temos 1h de Direito Constitucional.  
> Vamos revisar os princípios fundamentais e resolver 5 questões sobre o artigo 5º da CF/88.  
> No final, posso gerar um resumo automático do que vimos."  

💾 **Integração entre Agentes (JSON):**
\`\`\`json
{
  "planoEstudos": {
    "aluno": "${perfil.nome}",
    "duracao": "${duracaoMeses} meses",
    "frequencia": "5 dias/semana",
    "metodoPrincipal": "Pomodoro + Revisão Espaçada + Active Recall",
    "disciplinas": [
      ${perfil.disciplinas.map((disc, i) => {
        const percentual = Math.round(100 / perfil.disciplinas.length);
        const dias = i === 0 ? '["segunda"]' : i === 1 ? '["segunda"]' : i === 2 ? '["segunda"]' : 
                    i === 3 ? '["terça"]' : i === 4 ? '["terça"]' : '["quarta"]';
        return `{ "nome": "${disc}", "carga": "${percentual}%", "dias": ${dias}, "metodo": "Pomodoro" }`;
      }).join(',\n      ')}
    ],
    "modulos": [
      "Fundamentos", "Interpretação", "Consolidação",
      "Questões e Jurisprudência", "Revisão Avançada", "Simulados Gerais"
    ]
  }
}
\`\`\`

🚀 **Criar Plano de Estudos**
(Ao clicar neste botão, o plano será enviado aos GPTs das disciplinas correspondentes.)`;
  }

  private criarPlanoGalacticoV3(perfil: PerfilAluno, plano: PlanoCompleto) {
    const duracaoMeses = Math.ceil(perfil.prazoSemanas / 4);
    
    return {
      planoEstudos: {
        aluno: perfil.nome || 'Aluno',
        duracao: `${duracaoMeses} meses`,
        frequencia: "5 dias/semana",
        metodoPrincipal: "Pomodoro + Revisão Espaçada + Active Recall",
        disciplinas: perfil.disciplinas.map((disc, i) => {
          const percentual = Math.round(100 / perfil.disciplinas.length);
          const dias = i === 0 ? ['segunda'] : i === 1 ? ['segunda'] : i === 2 ? ['segunda'] : 
                      i === 3 ? ['terça'] : i === 4 ? ['terça'] : ['quarta'];
          return {
            nome: disc,
            carga: `${percentual}%`,
            dias: dias,
            metodo: "Pomodoro"
          };
        }),
        modulos: [
          "Fundamentos", "Interpretação", "Consolidação",
          "Questões e Jurisprudência", "Revisão Avançada", "Simulados Gerais"
        ]
      }
    };
  }

  private criarPlanoGalacticoAvancado(perfil: PerfilAluno, plano: PlanoCompleto) {
    return {
      planoEstudos: {
        aluno: {
          nome: perfil.nome || 'Aluno',
          nivel: perfil.nivel,
          horasSemana: perfil.horasSemanais,
          prazoSemanas: perfil.prazoSemanas
        },
        metodoPrincipal: "Pomodoro + Revisão espaçada + Active Recall",
        modulos: [
          { nome: "Fundamentos teóricos", duracaoSemanas: 2 },
          { nome: "Fixação e Revisões", duracaoSemanas: 2 },
          { nome: "Questões e Revisões", duracaoSemanas: 2 },
          { nome: "Simulados intermediários", duracaoSemanas: 2 },
          { nome: "Revisão Total", duracaoSemanas: 2 },
          { nome: "Simulados Finais", duracaoSemanas: 2 }
        ],
        disciplinas: perfil.disciplinas.map(disc => ({
          nome: disc,
          cargaSemanal: Math.round((perfil.horasSemanais / perfil.disciplinas.length) * 2) / 2
        })),
        rotinaSemanal: {
          segunda: [perfil.disciplinas[0] || 'Português', perfil.disciplinas[1] || 'Lógico', perfil.disciplinas[2] || 'Constitucional'],
          terça: [perfil.disciplinas[3] || 'Administrativo', perfil.disciplinas[4] || 'Penal'],
          quarta: [perfil.disciplinas[5] || 'Processual Penal', 'Legislação Especial'],
          quinta: ['Informática', 'Direitos Humanos'],
          sexta: ['Inglês', 'Revisão Geral']
        }
      }
    };
  }

  private criarPlanoGalactico(perfil: PerfilAluno, plano: PlanoCompleto) {
    return {
      planoEstudos: {
        aluno: {
          nome: perfil.nome || 'Aluno',
          nivel: perfil.nivel,
          horasSemana: perfil.horasSemanais,
          prazoSemanas: perfil.prazoSemanas
        },
        metodoPrincipal: "Pomodoro + Revisão espaçada + Active Recall",
        modulos: [
          { mes: 1, foco: "Fundamentos e leitura da lei seca" },
          { mes: 2, foco: "Interpretação e compreensão" },
          { mes: 3, foco: "Consolidação teórica" },
          { mes: 4, foco: "Questões e jurisprudência" },
          { mes: 5, foco: "Revisão avançada" },
          { mes: 6, foco: "Simulados gerais e redação" }
        ],
        disciplinas: perfil.disciplinas.map(disc => ({
          nome: disc,
          percentual: Math.round(100 / perfil.disciplinas.length)
        })),
        rotinaSemanal: {
          segunda: [perfil.disciplinas[0] || 'Português', perfil.disciplinas[1] || 'Lógico', perfil.disciplinas[2] || 'Constitucional'],
          terça: [perfil.disciplinas[3] || 'Administrativo', perfil.disciplinas[4] || 'Penal'],
          quarta: [perfil.disciplinas[5] || 'Processual Penal', 'Legislação Especial'],
          quinta: ['Informática', 'Direitos Humanos'],
          sexta: ['Inglês', 'Revisão Geral']
        }
      }
    };
  }

  private criarPlanoAdaptativo(perfil: PerfilAluno): PlanoCompleto {
    const cronograma: PlanoSemanal[] = [];
    const distribuicaoPorDisciplina: Record<string, PlanoSemanal[]> = {};

    // Inicializa arrays para cada disciplina
    perfil.disciplinas.forEach(disciplina => {
      distribuicaoPorDisciplina[disciplina] = [];
    });

    // Gera cronograma semana a semana
    for (let semana = 1; semana <= perfil.prazoSemanas; semana++) {
      const disciplina = perfil.disciplinas[(semana - 1) % perfil.disciplinas.length];
      const foco = this.gerarFocoSemanal(disciplina, semana, perfil.nivel);
      const tarefas = this.gerarTarefasSemanal(disciplina, foco, perfil.horasSemanais);

      const semanaPlano: PlanoSemanal = {
        semana,
        foco: `${foco} (${disciplina})`,
        tarefas
      };

      cronograma.push(semanaPlano);
      distribuicaoPorDisciplina[disciplina].push(semanaPlano);
    }

    return {
      perfil,
      cronograma,
      distribuicaoPorDisciplina,
      dataCriacao: new Date(),
      status: 'em_andamento'
    };
  }

  private gerarFocoSemanal(disciplina: string, semana: number, nivel: string): string {
    const focosPorDisciplina: Record<string, string[]> = {
      'Direito Administrativo': [
        'Poder de polícia', 'Ato administrativo', 'Processo administrativo',
        'Servidores públicos', 'Controle da administração', 'Licitações'
      ],
      'Português – Gramática': [
        'Sujeito e predicado', 'Concordância verbal', 'Regência verbal',
        'Crase', 'Pontuação', 'Interpretação de texto'
      ],
      'Raciocínio Lógico-Matemático': [
        'Lógica proposicional', 'Análise combinatória', 'Probabilidade',
        'Sequências', 'Geometria', 'Álgebra'
      ]
    };

    const focos = focosPorDisciplina[disciplina] || ['Tópico principal', 'Revisão geral'];
    return focos[(semana - 1) % focos.length];
  }

  private gerarTarefasSemanal(disciplina: string, foco: string, horasSemanais: number): string[] {
    const tarefasBase = [
      `Estudar ${foco.toLowerCase()}`,
      `Resolver questões sobre ${foco.toLowerCase()}`,
      `Revisar material da semana anterior`
    ];

    if (horasSemanais >= 20) {
      tarefasBase.push(`Fazer resumo de ${foco.toLowerCase()}`);
    }

    if (horasSemanais >= 30) {
      tarefasBase.push(`Praticar exercícios avançados`);
    }

    return tarefasBase;
  }

  // Getters para acessar dados
  getConversa(sessionId: string): string[] {
    return this.conversas.get(sessionId) || [];
  }

  getPerfil(sessionId: string): Partial<PerfilAluno> {
    return this.perfis.get(sessionId) || {};
  }

  limparSessao(sessionId: string): void {
    this.conversas.delete(sessionId);
    this.perfis.delete(sessionId);
  }
}

// Instância singleton
export const siriusService = new SiriusService();
