// src/types/actionItems.ts

export type ActionItem = {
  id: string;
  action: string;
  category: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ActionData = {
  counts: { pending: number; completed: number };
  pending: ActionItem[];
  completed: ActionItem[];
};

export type DeleteActionItemResponse = {
  id: string;
  deleted: boolean;
};