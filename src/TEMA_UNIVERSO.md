# 🌌 Tema Universo - Classes CSS Personalizadas

## Classes utilitárias disponíveis

### 🌟 Background Cósmico

```css
.cosmic-bg
```

Aplica um gradiente radial sutil que simula um fundo cósmico com tons de azul e roxo.

**Uso:**
```jsx
<div className="cosmic-bg">
  {/* conteúdo */}
</div>
```

---

### ✨ Estrelas Discretas

```css
.stars-subtle
```

Adiciona um efeito de estrelas discretas usando gradientes radiais. Perfeito para fundos de seções.

**Uso:**
```jsx
<div className="stars-subtle">
  {/* conteúdo */}
</div>
```

**Nota:** Pode ser combinado com `.cosmic-bg` para efeito mais rico.

---

### 🎴 Cards Universo

#### Card Básico
```css
.universe-card
```

Card com:
- `border-radius: 2xl`
- `backdrop-blur-sm`
- Background semi-transparente
- Borda com cor azul/roxo sutil
- Sombra suave

**Uso:**
```jsx
<div className="universe-card p-4">
  {/* conteúdo do card */}
</div>
```

#### Card com Hover
```css
.universe-card-hover
```

Mesmas características do `.universe-card` + efeito hover:
- Muda cor da borda para roxo
- Aumenta sombra
- Translação sutil para cima (`translateY(-2px)`)
- Transição suave

**Uso:**
```jsx
<Card className="universe-card-hover">
  {/* conteúdo */}
</Card>
```

---

### 🛡️ Badge Rastreável

```css
.badge-traceable
```

Badge especial para indicar rastreabilidade de informações:
- Gradiente de azul para roxo
- Borda sutil
- Cor do texto: roxo claro (`rgb(167, 139, 250)`)
- Inline-flex com gap

**Uso:**
```jsx
<Badge className="badge-traceable">
  <ShieldCheck className="w-3 h-3" />
  Rastreável
</Badge>
```

---

### 📚 Painel de Citações

```css
.citations-panel
```

Container estilizado para exibir fontes e citações:
- Margem superior
- Padding interno
- Border radius arredondado
- Background escuro semi-transparente
- Borda azul/roxo

**Uso:**
```jsx
<div className="citations-panel">
  <h4 className="text-cyan-200">Fontes consultadas</h4>
  {/* lista de citações */}
</div>
```

---

## 🎨 Paleta de cores recomendada

### Texto
- **Primário:** `text-white` ou `text-cyan-100`
- **Secundário:** `text-cyan-200` ou `text-cyan-300`
- **Muted:** `text-cyan-300/70`

### Bordas
- **Padrão:** `border-cyan-800/30`
- **Hover/Focus:** `border-cyan-400/50`
- **Ativo:** `border-cyan-500/30`

### Backgrounds
- **Card:** `bg-slate-900/50` ou `bg-slate-900/40`
- **Input:** `bg-slate-900/50`
- **Hover:** `hover:bg-slate-900/70`

### Gradientes
- **Primário:** `from-blue-600 via-purple-600 to-cyan-500`
- **Secundário:** `from-purple-600 via-pink-600 to-orange-500`
- **Terciário:** `from-cyan-900/40 to-blue-900/40`

---

## 🔧 Combinações recomendadas

### Card padrão com tema universo
```jsx
<Card className="universe-card p-4">
  <h3 className="text-cyan-200 mb-2">Título</h3>
  <p className="text-cyan-300/80">Conteúdo</p>
</Card>
```

### Card interativo
```jsx
<Card className="universe-card-hover p-4 cursor-pointer">
  <h3 className="text-cyan-100">Título</h3>
  <p className="text-cyan-200">Descrição</p>
</Card>
```

### Input com tema
```jsx
<Input
  className="bg-slate-900/50 border-cyan-800/30 text-white placeholder-cyan-300/50 focus:border-cyan-400/50"
  placeholder="Digite algo..."
/>
```

### Button com gradiente
```jsx
<Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600">
  Ação
</Button>
```

### Badge com governança
```jsx
<Badge className="badge-traceable">
  <ShieldCheck className="w-3 h-3" />
  Rastreável
</Badge>
```

---

## 💡 Boas práticas

### Contraste
- Sempre garantir contraste AA (mínimo 4.5:1)
- Usar tons mais claros para texto sobre fundos escuros
- Testar com ferramentas de acessibilidade

### Performance
- As classes utilizam `backdrop-blur` que pode impactar performance em dispositivos antigos
- Use `will-change` com moderação
- Evite muitos elementos com blur simultâneos

### Responsividade
- Todas as classes são responsivas por padrão
- Combine com classes Tailwind para ajustes específicos:
  ```jsx
  <div className="universe-card p-4 md:p-6 lg:p-8">
  ```

### Estados
- Sempre forneça estados de hover, focus e active
- Use transições suaves (`transition-all duration-300`)
- Feedback visual claro para interações

---

## 🌠 Exemplos completos

### Card de ferramenta
```jsx
<Card className="universe-card-hover">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-cyan-100">
      <FileText className="w-5 h-5 text-cyan-400" />
      Consulta Editais
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <Input
      placeholder="Nome do concurso"
      className="bg-slate-900/50 border-cyan-800/30 text-white placeholder-cyan-300/50"
    />
    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
      Consultar
    </Button>
  </CardContent>
</Card>
```

### Mensagem com citações
```jsx
<div className="max-w-2xl">
  <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-cyan-600/90 text-white border border-cyan-400/30">
    <p>{resposta}</p>
  </div>
  
  <div className="citations-panel">
    <div className="flex items-center gap-2 mb-3">
      <ShieldCheck className="w-4 h-4 text-cyan-400" />
      <h4 className="text-cyan-200">Fontes consultadas</h4>
      <Badge className="badge-traceable">
        <ShieldCheck className="w-3 h-3" />
        Rastreável
      </Badge>
    </div>
    {/* citações aqui */}
  </div>
</div>
```

### Background completo
```jsx
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 cosmic-bg">
  <div className="container mx-auto p-6">
    {/* conteúdo */}
  </div>
</div>
```

---

## 🎭 Personalização

Para personalizar as cores do tema, edite o arquivo `/styles/globals.css` nas seções:

1. **Variáveis CSS** (`:root` e `.dark`)
2. **Classes utilitárias** (`@layer utilities`)

Mantenha a consistência com a identidade visual "Universo" usando tons de:
- Azul profundo (#3B82F6, #06B6D4)
- Roxo (#8B5CF6, #A855F7)
- Rosa/Magenta (#EC4899)
- Ciano (#22D3EE)

---

**Sirius GPT Concursos** - Tema Universo 🌌✨
