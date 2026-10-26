import { beforeEach, describe, expect, it } from 'vitest';
import { readFormDraft, saveFormDraft, clearFormDraft } from '../formDraft';
beforeEach(() => { sessionStorage.clear(); localStorage.clear(); });
describe('request drafts', () => {
  it('separates request types and accounts', () => {
    localStorage.setItem('hr_tool_user', JSON.stringify({ email: 'first@example.com' }));
    saveFormDraft('leave', { notes: 'First leave' }); saveFormDraft('mission', { notes: 'First mission' });
    expect(readFormDraft('leave')).toEqual({ notes: 'First leave' });
    expect(readFormDraft('mission')).toEqual({ notes: 'First mission' });
    localStorage.setItem('hr_tool_user', JSON.stringify({ email: 'second@example.com' }));
    expect(readFormDraft('leave')).toEqual({});
  });
  it('clears only the submitted draft and recovers from invalid stored data', () => {
    saveFormDraft('leave', { notes: 'Test' }); saveFormDraft('mission', { notes: 'Keep' });
    clearFormDraft('leave'); expect(readFormDraft('leave')).toEqual({});
    expect(readFormDraft('mission')).toEqual({ notes: 'Keep' });
    sessionStorage.setItem('hr_tool_draft:demo:leave', '{broken'); expect(readFormDraft('leave')).toEqual({});
    sessionStorage.setItem('hr_tool_draft:demo:leave', JSON.stringify({ notes: 42 })); expect(readFormDraft('leave')).toEqual({});
  });
});
