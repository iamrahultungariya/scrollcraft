'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Check, Copy, WrapText } from 'lucide-react';

export interface CodeTab {
  label: string;
  code: string;
  fileName?: string;
  language?: string;
}

interface CodeViewerProps {
  code?: string;
  fileName?: string;
  className?: string;
  defaultWrap?: boolean;
  tabs?: CodeTab[];
}

/**
 * Tokenizes a single line of JSX / TypeScript code into colored spans
 */
function tokenizeLine(line: string): React.ReactNode[] {
  if (line.trim().startsWith('//')) {
    return [<span key="comment" className="text-muted italic font-mono">{line}</span>];
  }

  const tokenRegex =
    /(\/\*[\s\S]*?\*\/|\/\/.*$)|(".*?"|'.*?'|`.*?`)|(\b(?:import|export|from|const|function|return|default|interface|type|extends|let|var|if|else|switch|case|break)\b)|(<\/?(?:Parallax|Reveal|Pin|PinContainer|ScrollProgress|ScrollProvider|VelocityMarquee|HorizontalScroll|ScrollSequence|motion\.div|div|section|button|h1|h2|h3|h4|p|span|table|tr|td|thead|tbody|th|img|Image)|(?:\/>|>))|(\b(?:asChild|speed|direction|distance|duration|top|bottom|smooth|className|respectReducedMotion|onProgress|velocityMultiplier|baseSpeed|frames|axis|ref|delay|once|threshold|autoResetOnRouteChange|autoRecalc)\b)|(\b\d+(?:\.\d+)?\b)|([{}(),;=])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }

    const [full, comment, str, keyword, tag, prop, num, punct] = match;

    if (comment) {
      nodes.push(<span key={match.index} className="text-muted italic font-mono">{comment}</span>);
    } else if (str) {
      nodes.push(<span key={match.index} className="text-accent font-mono">{str}</span>);
    } else if (keyword) {
      nodes.push(<span key={match.index} className="text-fg font-mono font-bold">{keyword}</span>);
    } else if (tag) {
      nodes.push(<span key={match.index} className="text-accent font-mono font-bold">{tag}</span>);
    } else if (prop) {
      nodes.push(<span key={match.index} className="text-fg font-mono">{prop}</span>);
    } else if (num) {
      nodes.push(<span key={match.index} className="text-accent font-mono">{num}</span>);
    } else if (punct) {
      nodes.push(<span key={match.index} className="text-muted font-mono">{punct}</span>);
    } else {
      nodes.push(full);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes;
}

export const CodeViewer: React.FC<CodeViewerProps> = React.memo(({
  code = '',
  fileName,
  className = '',
  defaultWrap = true,
  tabs,
}) => {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(defaultWrap);

  const currentCode = tabs && tabs.length > 0 ? tabs[activeTabIdx]?.code || '' : code;
  const currentFileName = tabs && tabs.length > 0 ? tabs[activeTabIdx]?.fileName || fileName : fileName;

  const tokenizedLines = useMemo(() => {
    return currentCode.trim().split('\n').map((line) => tokenizeLine(line));
  }, [currentCode]);

  const onCopy = useCallback(() => {
    if (!currentCode) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = currentCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [currentCode]);

  return (
    <div
      className={`border-2 border-line bg-bg shadow-rest overflow-hidden text-xs font-mono select-text transition-all ${className}`}
    >
      {/* Titlebar with Tabs & Actions */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-line-soft/30 border-b-2 border-line">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
          {/* Brutalist status squares */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div className="w-2 h-2 bg-line-soft" />
            <div className="w-2 h-2 bg-line-soft" />
            <div className="w-2 h-2 bg-accent" />
          </div>

          {/* Tabs or Filename */}
          {tabs && tabs.length > 0 ? (
            <div className="flex items-center gap-1 bg-bg p-0.5 border-2 border-line-soft overflow-x-auto no-scrollbar">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  onClick={() => {
                    setActiveTabIdx(idx);
                    setCopied(false);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono whitespace-nowrap transition-all cursor-pointer uppercase font-bold border ${
                    activeTabIdx === idx
                      ? 'bg-accent text-black border-accent'
                      : 'text-muted hover:text-fg border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : currentFileName ? (
            <span className="text-[11px] text-fg font-bold font-mono tracking-wider uppercase truncate">
              {currentFileName}
            </span>
          ) : (
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-muted">
              CODE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Word Wrap Toggle */}
          <button
            onClick={() => setWordWrap((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 border-2 text-[11px] font-mono font-bold uppercase transition-all cursor-pointer ${
              wordWrap
                ? 'bg-accent text-black border-accent'
                : 'bg-bg hover:bg-fg hover:text-black border-line text-muted'
            }`}
            title={wordWrap ? 'Disable Word Wrap' : 'Enable Word Wrap'}
          >
            <WrapText className="w-3 h-3" />
            <span className="hidden sm:inline">Wrap</span>
          </button>

          {/* Copy Button with Square Brutalist Feedback */}
          <button
            onClick={onCopy}
            className={`flex items-center gap-1.5 h-8 px-3 border-2 text-[11px] font-mono font-bold uppercase transition-all cursor-pointer ${
              copied
                ? 'bg-accent text-black border-accent'
                : 'bg-bg hover:bg-accent text-fg hover:text-black border-line shadow-rest'
            }`}
            title="Copy code snippet"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className={`p-3 sm:p-4 leading-relaxed bg-[#0e1210] ${wordWrap ? 'overflow-x-hidden' : 'overflow-x-auto'}`}>
        <table className="w-full border-collapse">
          <tbody>
            {tokenizedLines.map((tokens, idx) => (
              <tr key={idx} className="hover:bg-paper/[0.03] transition-colors">
                <td className="pr-2 sm:pr-4 text-right text-paper/30 select-none w-6 sm:w-8 align-top font-mono text-[10px] sm:text-[11px] shrink-0">
                  {idx + 1}
                </td>
                <td
                  className={`text-paper/90 font-mono text-[11px] sm:text-[12.5px] leading-5 sm:leading-6 w-full ${
                    wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
                  }`}
                >
                  {tokens}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

CodeViewer.displayName = 'CodeViewer';
