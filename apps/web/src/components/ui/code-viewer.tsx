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
    return [<span key="comment" className="text-zinc-500 italic">{line}</span>];
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
      nodes.push(<span key={match.index} className="text-zinc-500 italic">{comment}</span>);
    } else if (str) {
      nodes.push(<span key={match.index} className="text-emerald-400 font-medium">{str}</span>);
    } else if (keyword) {
      nodes.push(<span key={match.index} className="text-purple-400 font-semibold">{keyword}</span>);
    } else if (tag) {
      nodes.push(<span key={match.index} className="text-sky-400 font-semibold">{tag}</span>);
    } else if (prop) {
      nodes.push(<span key={match.index} className="text-amber-300 font-medium">{prop}</span>);
    } else if (num) {
      nodes.push(<span key={match.index} className="text-indigo-400 font-medium">{num}</span>);
    } else if (punct) {
      nodes.push(<span key={match.index} className="text-zinc-500">{punct}</span>);
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
      className={`rounded-xl bg-[#09090b] border border-zinc-800/80 shadow-2xl overflow-hidden text-xs font-mono select-text transition-all ${className}`}
    >
      {/* Titlebar with Tabs & Actions */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#0d0d10] border-b border-zinc-800/80">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
          {/* Mac Traffic Lights */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
          </div>

          {/* Tabs or Filename */}
          {tabs && tabs.length > 0 ? (
            <div className="flex items-center gap-1 bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800/80 overflow-x-auto no-scrollbar">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  onClick={() => {
                    setActiveTabIdx(idx);
                    setCopied(false);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium font-sans whitespace-nowrap transition-all cursor-pointer ${
                    activeTabIdx === idx
                      ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : currentFileName ? (
            <span className="text-[11px] text-zinc-400 font-semibold font-mono tracking-tight truncate">
              {currentFileName}
            </span>
          ) : (
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-500">
              Code
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Word Wrap Toggle */}
          <button
            onClick={() => setWordWrap((prev) => !prev)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] transition-all cursor-pointer ${
              wordWrap
                ? 'bg-zinc-800 border-zinc-700 text-white font-medium'
                : 'bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={wordWrap ? 'Disable Word Wrap' : 'Enable Word Wrap'}
          >
            <WrapText className="w-3 h-3" />
            <span className="hidden sm:inline">Wrap</span>
          </button>

          {/* Copy Button with Green Tick Feedback */}
          <button
            onClick={onCopy}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md border text-[11px] transition-all cursor-pointer shadow-xs active:scale-95 ${
              copied
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium'
                : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
            title="Copy code snippet"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium text-[11px]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className={`p-3 sm:p-4 leading-relaxed bg-[#060608] ${wordWrap ? 'overflow-x-hidden' : 'overflow-x-auto'}`}>
        <table className="w-full border-collapse">
          <tbody>
            {tokenizedLines.map((tokens, idx) => (
              <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                <td className="pr-2 sm:pr-4 text-right text-zinc-600 select-none w-6 sm:w-8 align-top font-mono text-[10px] sm:text-[11px] shrink-0">
                  {idx + 1}
                </td>
                <td
                  className={`text-zinc-200 font-mono text-[11px] sm:text-[12.5px] leading-5 sm:leading-6 w-full ${
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
