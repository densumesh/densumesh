import { useState } from 'react';

type Entry = {
  path: string;
  isPublic: boolean;
  groups: string[];
};

const ENTRIES: Entry[] = [
  { path: 'auth/oauth', isPublic: true, groups: [] },
  { path: 'auth/api-keys', isPublic: true, groups: [] },
  { path: 'internal/billing', isPublic: false, groups: ['admin', 'billing'] },
  { path: 'internal/audit-log', isPublic: false, groups: ['admin'] },
  { path: 'api-reference/users', isPublic: true, groups: [] },
  { path: 'api-reference/payments', isPublic: false, groups: ['billing'] },
];

const ROLES: { label: string; groups: string[] }[] = [
  { label: 'Public user', groups: [] },
  { label: 'Billing team', groups: ['billing'] },
  { label: 'Admin', groups: ['admin', 'billing'] },
];

function isVisible(entry: Entry, userGroups: Set<string>): boolean {
  if (entry.isPublic) return true;
  if (entry.groups.length === 0) return true;
  return entry.groups.some((g) => userGroups.has(g));
}

export default function RbacTree() {
  const [activeRole, setActiveRole] = useState(0);
  const userGroups = new Set(ROLES[activeRole].groups);

  return (
    <div className="not-prose my-8 rounded-xl border border-border-sub overflow-hidden">
      <div className="flex gap-2 px-5 pt-4 pb-3">
        {ROLES.map((role, i) => (
          <button
            key={role.label}
            onClick={() => setActiveRole(i)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              i === activeRole
                ? 'bg-brand text-white'
                : 'bg-white/5 text-text-sub hover:bg-white/10'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>
      <div className="px-5 pb-2 text-xs text-text-sub">
        Groups: {ROLES[activeRole].groups.length > 0 ? ROLES[activeRole].groups.join(', ') : 'none'}
      </div>
      <div className="border-t border-border-sub">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-text-sub">
              <th className="px-5 py-2.5 font-medium">Path</th>
              <th className="px-5 py-2.5 font-medium">Access</th>
              <th className="px-5 py-2.5 font-medium text-right">Visible</th>
            </tr>
          </thead>
          <tbody>
            {ENTRIES.map((entry) => {
              const visible = isVisible(entry, userGroups);
              return (
                <tr
                  key={entry.path}
                  className={`border-t border-border-sub transition-opacity duration-200 ${
                    visible ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <td className="px-5 py-2 font-mono text-xs">/{entry.path}.mdx</td>
                  <td className="px-5 py-2 text-xs text-text-sub">
                    {entry.isPublic ? 'public' : entry.groups.join(', ')}
                  </td>
                  <td className="px-5 py-2 text-right text-xs">
                    {visible ? (
                      <span className="text-brand-light">✓</span>
                    ) : (
                      <span className="text-red-400">✗</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
