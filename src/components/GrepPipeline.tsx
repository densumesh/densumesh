import { useState } from 'react';
import * as React from 'react';

type DocFile = {
  path: string;
  content: string;
};

const FILES: DocFile[] = [
  {
    path: '/auth/oauth.mdx',
    content: 'Use the access_token from the OAuth flow to authenticate API requests.',
  },
  {
    path: '/auth/api-keys.mdx',
    content: 'API keys are generated from the dashboard settings page.',
  },
  {
    path: '/api-reference/users.mdx',
    content:
      'The GET /users endpoint returns a list of users. Requires access_token in the Authorization header.',
  },
  {
    path: '/api-reference/payments.mdx',
    content: 'POST /payments creates a new payment intent. Requires billing scope.',
  },
  {
    path: '/guides/quickstart.mdx',
    content: 'Get started by generating an access_token using the OAuth guide.',
  },
  {
    path: '/guides/webhooks.mdx',
    content: 'Configure webhook endpoints to receive event notifications.',
  },
];

const QUERIES = [
  { label: 'grep -ri "access_token"', pattern: 'access_token' },
  { label: 'grep -ri "webhook"', pattern: 'webhook' },
  { label: 'grep -ri "billing"', pattern: 'billing' },
];

function highlightMatch(text: string, pattern: string): React.ReactNode[] {
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-brand/20 text-brand-light rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function GrepPipeline() {
  const [activeQuery, setActiveQuery] = useState(0);
  const pattern = QUERIES[activeQuery].pattern;

  const chromaMatches = FILES.filter((f) =>
    f.content.toLowerCase().includes(pattern.toLowerCase())
  );
  const chromaMatchPaths = new Set(chromaMatches.map((f) => f.path));

  return (
    <div className="not-prose my-8 rounded-xl border border-border-sub overflow-hidden">
      <div className="px-5 pt-4 pb-3">
        <div className="flex gap-2 flex-wrap">
          {QUERIES.map((q, i) => (
            <button
              key={q.label}
              onClick={() => setActiveQuery(i)}
              className={`rounded-full px-3 py-1 text-xs font-mono transition-colors ${
                i === activeQuery
                  ? 'bg-brand text-white'
                  : 'bg-white/5 text-text-sub hover:bg-white/10'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border-sub">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-0">
          <div className="p-4">
            <div className="text-xs font-medium text-text-sub mb-3">
              1. Coarse filter <span className="text-text-sub/50">(Chroma)</span>
            </div>
            <div className="space-y-1.5">
              {FILES.map((f) => {
                const matches = chromaMatchPaths.has(f.path);
                return (
                  <div
                    key={f.path}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-mono transition-all duration-200 ${
                      matches
                        ? 'bg-brand/10 text-text-main border border-brand/20'
                        : 'text-text-sub/30 line-through'
                    }`}
                  >
                    {f.path}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-text-sub">
              {chromaMatches.length}/{FILES.length} files match
            </div>
          </div>

          <div className="flex items-center px-2">
            <div className="text-text-sub/30 text-lg">→</div>
          </div>

          <div className="p-4 border-l border-border-sub">
            <div className="text-xs font-medium text-text-sub mb-3">
              2. Fine filter <span className="text-text-sub/50">(in-memory regex)</span>
            </div>
            <div className="space-y-2">
              {chromaMatches.map((f) => (
                <div key={f.path} className="rounded-md border border-border-sub px-2.5 py-2">
                  <div className="text-xs font-mono text-brand-light mb-1">{f.path}</div>
                  <div className="text-xs text-text-sub leading-relaxed">
                    {highlightMatch(f.content, pattern)}
                  </div>
                </div>
              ))}
              {chromaMatches.length === 0 && (
                <div className="text-xs text-text-sub/50 italic">No matches</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
