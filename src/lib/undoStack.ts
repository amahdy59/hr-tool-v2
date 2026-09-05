import { toast } from 'sonner';

export interface UndoableAction {
  id: string;
  description: string;
  execute: () => void | Promise<void>;
  undo: () => void | Promise<void>;
}

class UndoManager {
  private history: UndoableAction[] = [];
  private maxHistory: number = 20;

  public async executeAction(action: UndoableAction, undoLabel: string = 'Undo', duration: number = 5000) {
    // 1. Run forward action
    await action.execute();
    this.history.push(action);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // 2. Dispatch interactive Sonner toast
    toast.success(action.description, {
      duration,
      action: {
        label: undoLabel,
        onClick: async () => {
          await this.undoLastAction(action.id);
        },
      },
    });
  }

  public async undoLastAction(actionId?: string) {
    const idx = actionId
      ? this.history.findIndex((a) => a.id === actionId)
      : this.history.length - 1;

    if (idx === -1) return;

    const [actionToUndo] = this.history.splice(idx, 1);
    try {
      await actionToUndo.undo();
      toast.info(`Undone: ${actionToUndo.description}`);
    } catch (err) {
      console.error('Failed to undo action:', err);
      toast.error('Failed to revert action');
    }
  }

  public clear() {
    this.history = [];
  }
}

export const undoManager = new UndoManager();
