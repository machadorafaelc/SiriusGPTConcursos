import React from 'react';

interface RichMessageProps {
  content: string;
  className?: string;
}

export function RichMessage({ content, className = "" }: RichMessageProps) {
  // Função para processar o conteúdo e criar blocos visuais
  const processContent = (text: string) => {
    const lines = text.split('\n');
    const blocks: JSX.Element[] = [];
    let currentBlock: string[] = [];
    let currentType = '';

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Detecta emojis de seção
      if (trimmedLine.startsWith('🚀')) {
        if (currentBlock.length > 0) {
          blocks.push(createBlock(currentType, currentBlock.join('\n')));
          currentBlock = [];
        }
        currentType = 'introduction';
        currentBlock.push(trimmedLine);
      } else if (trimmedLine.startsWith('💬')) {
        if (currentBlock.length > 0) {
          blocks.push(createBlock(currentType, currentBlock.join('\n')));
          currentBlock = [];
        }
        currentType = 'explanation';
        currentBlock.push(trimmedLine);
      } else if (trimmedLine.startsWith('🧩')) {
        if (currentBlock.length > 0) {
          blocks.push(createBlock(currentType, currentBlock.join('\n')));
          currentBlock = [];
        }
        currentType = 'example';
        currentBlock.push(trimmedLine);
      } else if (trimmedLine.startsWith('❓')) {
        if (currentBlock.length > 0) {
          blocks.push(createBlock(currentType, currentBlock.join('\n')));
          currentBlock = [];
        }
        currentType = 'question';
        currentBlock.push(trimmedLine);
      } else if (trimmedLine.startsWith('📘')) {
        if (currentBlock.length > 0) {
          blocks.push(createBlock(currentType, currentBlock.join('\n')));
          currentBlock = [];
        }
        currentType = 'summary';
        currentBlock.push(trimmedLine);
      } else if (trimmedLine.startsWith('🌠')) {
        if (currentBlock.length > 0) {
          blocks.push(createBlock(currentType, currentBlock.join('\n')));
          currentBlock = [];
        }
        currentType = 'highlight';
        currentBlock.push(trimmedLine);
      } else if (trimmedLine) {
        currentBlock.push(line);
      } else {
        // Linha vazia - adiciona quebra
        if (currentBlock.length > 0) {
          currentBlock.push('');
        }
      }
    });

    // Adiciona o último bloco
    if (currentBlock.length > 0) {
      blocks.push(createBlock(currentType, currentBlock.join('\n')));
    }

    return blocks;
  };

  const createBlock = (type: string, content: string) => {
    const cleanContent = content.replace(/^[🚀💬🧩❓📘🌠]\s*/, '');
    
    const blockStyles = {
      introduction: 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500',
      explanation: 'bg-slate-800/30 border-l-4 border-slate-500',
      example: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-l-4 border-green-500',
      question: 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-500',
      summary: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500',
      highlight: 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-l-4 border-cyan-500',
      default: 'bg-slate-800/20 border-l-4 border-slate-600'
    };

    const iconStyles = {
      introduction: 'text-blue-400',
      explanation: 'text-slate-400',
      example: 'text-green-400',
      question: 'text-yellow-400',
      summary: 'text-purple-400',
      highlight: 'text-cyan-400',
      default: 'text-slate-500'
    };

    const icons = {
      introduction: '🚀',
      explanation: '💬',
      example: '🧩',
      question: '❓',
      summary: '📘',
      highlight: '🌠',
      default: '💡'
    };

    return (
      <div key={Math.random()} className={`p-4 rounded-r-lg mb-4 ${blockStyles[type as keyof typeof blockStyles] || blockStyles.default}`}>
        <div className="flex items-start gap-3">
          <span className={`text-xl ${iconStyles[type as keyof typeof iconStyles] || iconStyles.default} flex-shrink-0 mt-1`}>
            {icons[type as keyof typeof icons] || icons.default}
          </span>
          <div className="flex-1">
            <pre className="whitespace-pre-wrap text-white leading-relaxed font-sans">
              {cleanContent}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  const blocks = processContent(content);

  return (
    <div className={`space-y-2 ${className}`}>
      {blocks.length > 0 ? blocks : (
        <div className="p-4 bg-slate-800/20 rounded-lg">
          <pre className="whitespace-pre-wrap text-white leading-relaxed">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}
