import { z } from 'zod';
const schema = z.record(z.string(), z.string().max(12000));
const key = (kind: string) => {
  let account = 'demo';
  try { account = JSON.parse(localStorage.getItem('hr_tool_user') || '{}').email || account; } catch { /* Anonymous demo. */ }
  return `hr_tool_draft:${encodeURIComponent(account.toLowerCase())}:${kind}`;
};
export function readFormDraft(kind: string): Record<string, string> {
  try { const parsed = schema.safeParse(JSON.parse(sessionStorage.getItem(key(kind)) || '{}')); return parsed.success ? parsed.data : {}; } catch { return {}; }
}
export function saveFormDraft(kind: string, fields: Record<string, string>) {
  try { sessionStorage.setItem(key(kind), JSON.stringify(fields)); } catch { /* The in-memory form remains usable. */ }
}
export function clearFormDraft(kind: string) {
  try { sessionStorage.removeItem(key(kind)); } catch { /* Storage may be disabled. */ }
}
