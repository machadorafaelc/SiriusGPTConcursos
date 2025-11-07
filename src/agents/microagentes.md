# Microagentes do SiriusGPTConcursos

## Conceito de Microagentes

Os microagentes são agentes especializados e subordinados que respondem a comandos específicos dos agentes principais. Eles não iniciam conversas independentemente, mas são acionados quando há necessidade de expertise específica.

## Arquitetura de Microagentes

### Hierarquia de Agentes

```
OrientadorGPT (Agente Principal)
├── Guia de Métodos de Estudo (Microagente)
├── Direito Administrativo GPT (Agente Principal)
├── Português GPT (Agente Principal)
└── Raciocínio Lógico GPT (Agente Principal)
```

### Características dos Microagentes

1. **Subordinados**: Nunca iniciam conversas sozinhos
2. **Especializados**: Focam em um domínio específico
3. **Respostas Curtas**: Máximo 250-300 palavras
4. **Práticos**: Focam na aplicação, não na teoria
5. **Contextuais**: Entendem o contexto enviado pelo agente principal

## Microagentes Implementados

### Guia de Métodos de Estudo

**ID**: `guia-metodos`
**Tipo**: `subagent`
**Acionado por**: OrientadorGPT
**Trigger**: Perguntas sobre técnicas de estudo, foco, concentração, memorização ou produtividade

**Métodos Disponíveis**:
- Pomodoro
- Feynman
- Revisão Espaçada
- Active Recall
- Interleaving
- Mind Mapping
- Flashcards
- SQ3R

**Formato de Resposta**:
1. Título do método
2. Descrição breve e motivadora
3. Como aplicar (passos práticos)
4. Quando usar (situação ideal)
5. Atenção (limitações e ajustes)
6. Exemplo aplicado à rotina
7. Próximo passo (integração ao plano)

## Como Usar Microagentes

### No Código

```typescript
// Acionar microagente através do OrientadorGPT
const resposta = await chatRag({
  agentId: "guia-metodos",
  message: "Explique o método Pomodoro",
  contexto: {
    tempoDisponivel: "2 horas por dia",
    concurso: "Policial Legislativo Federal"
  }
});
```

### No Sistema

1. **OrientadorGPT** identifica necessidade de explicação de método
2. **Aciona** o microagente apropriado
3. **Microagente** responde com explicação prática
4. **OrientadorGPT** integra a resposta ao plano principal

## Benefícios dos Microagentes

1. **Especialização**: Expertise profunda em domínios específicos
2. **Modularidade**: Fácil manutenção e atualização
3. **Eficiência**: Respostas focadas e diretas
4. **Escalabilidade**: Fácil adição de novos microagentes
5. **Consistência**: Padrões claros de resposta

## Futuros Microagentes

- **Guia de Simulados**: Estratégias para provas
- **Guia de Memorização**: Técnicas específicas de memória
- **Guia de Concentração**: Dicas para foco e produtividade
- **Guia de Revisão**: Estratégias de revisão eficazes


