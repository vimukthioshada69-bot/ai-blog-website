'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { Copy, Check, Info, Lightbulb, AlertTriangle } from 'lucide-react';

// Allow code highlight classes and standard safe HTML tags
const safeSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), 'className'],
    span: [...(defaultSchema.attributes?.span || []), 'className'],
    pre: [...(defaultSchema.attributes?.pre || []), 'className'],
    h1: [...(defaultSchema.attributes?.h1 || []), 'id'],
    h2: [...(defaultSchema.attributes?.h2 || []), 'id'],
    h3: [...(defaultSchema.attributes?.h3 || []), 'id'],
    h4: [...(defaultSchema.attributes?.h4 || []), 'id'],
    h5: [...(defaultSchema.attributes?.h5 || []), 'id'],
    h6: [...(defaultSchema.attributes?.h6 || []), 'id'],
  },
};

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100/90 border-b border-slate-200 text-xs font-mono text-slate-600">
        <span className="uppercase font-semibold tracking-wider">{lang || 'CODE'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 active:scale-95 transition-all text-xs font-sans"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="!m-0 !rounded-none !bg-slate-50 p-4 overflow-x-auto text-sm leading-relaxed font-mono">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeSanitize, safeSanitizeSchema], rehypeHighlight]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-sm font-semibold border border-indigo-100" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-6 p-4 rounded-xl bg-indigo-50/70 border-l-4 border-indigo-500 text-slate-700 text-base leading-relaxed">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">{children}</table>
              </div>
            );
          },
          img({ src, alt }) {
            return (
              <figure className="my-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src || ''}
                  alt={alt || 'Article visual content'}
                  loading="lazy"
                  className="w-full rounded-2xl border border-slate-200 shadow-sm object-cover max-h-[500px]"
                />
                {alt && (
                  <figcaption className="text-center text-xs text-slate-500 mt-2 font-medium">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
          a({ href, children }) {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-4 decoration-indigo-300 hover:decoration-indigo-600 transition-colors"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
