import { describe, it, expect, vi, beforeEach } from 'vitest';
import { undoManager, UndoableAction } from '../undoStack';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('UndoManager (Optimistic UI & Reversible Mutations)', () => {
  beforeEach(() => {
    undoManager.clear();
    vi.clearAllMocks();
  });

  it('executes the forward action and triggers an interactive toast with an undo callback', async () => {
    const executeSpy = vi.fn();
    const undoSpy = vi.fn();

    const action: UndoableAction = {
      id: 'action-1',
      description: 'Approved leave for Sarah',
      execute: executeSpy,
      undo: undoSpy,
    };

    await undoManager.executeAction(action, 'Undo', 5000);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      'Approved leave for Sarah',
      expect.objectContaining({
        duration: 5000,
        action: expect.objectContaining({
          label: 'Undo',
          onClick: expect.any(Function),
        }),
      })
    );
  });

  it('reverts the action via undoLastAction by actionId', async () => {
    const executeSpy = vi.fn();
    const undoSpy = vi.fn();

    const action: UndoableAction = {
      id: 'action-2',
      description: 'Rejected leave for John',
      execute: executeSpy,
      undo: undoSpy,
    };

    await undoManager.executeAction(action);
    await undoManager.undoLastAction('action-2');

    expect(undoSpy).toHaveBeenCalledTimes(1);
    expect(toast.info).toHaveBeenCalledWith('Undone: Rejected leave for John');
  });

  it('reverts the last action in LIFO order when no actionId is specified', async () => {
    const undo1 = vi.fn();
    const undo2 = vi.fn();

    await undoManager.executeAction({
      id: 'act-1',
      description: 'First action',
      execute: vi.fn(),
      undo: undo1,
    });

    await undoManager.executeAction({
      id: 'act-2',
      description: 'Second action',
      execute: vi.fn(),
      undo: undo2,
    });

    await undoManager.undoLastAction();

    expect(undo2).toHaveBeenCalledTimes(1);
    expect(undo1).not.toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith('Undone: Second action');
  });

  it('handles undo errors gracefully without throwing', async () => {
    const failingUndo = vi.fn().mockRejectedValue(new Error('Network error on revert'));

    await undoManager.executeAction({
      id: 'act-fail',
      description: 'Dangerous action',
      execute: vi.fn(),
      undo: failingUndo,
    });

    await undoManager.undoLastAction('act-fail');

    expect(failingUndo).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('Failed to revert action');
  });

  it('enforces maxHistory limit of 20 items', async () => {
    for (let i = 1; i <= 25; i++) {
      await undoManager.executeAction({
        id: `act-${i}`,
        description: `Action ${i}`,
        execute: vi.fn(),
        undo: vi.fn(),
      });
    }

    // Earliest action (act-1) should have been pruned
    const undoAct1 = vi.fn();
    await undoManager.undoLastAction('act-1');
    expect(undoAct1).not.toHaveBeenCalled();
  });

  it('clears all history on clear()', async () => {
    const undoSpy = vi.fn();
    await undoManager.executeAction({
      id: 'act-clear',
      description: 'To be cleared',
      execute: vi.fn(),
      undo: undoSpy,
    });

    undoManager.clear();
    await undoManager.undoLastAction();

    expect(undoSpy).not.toHaveBeenCalled();
  });
});
