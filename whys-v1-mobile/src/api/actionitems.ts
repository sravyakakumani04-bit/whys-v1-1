
// src/api/actionItems.ts
import axios from "axios";
import { API_BASE } from "./api";

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

const HARD_USER_ID = "99a99eea-d4dd-41b8-9ae3-efaec9f62a21";

export const fetchActionItems = async (): Promise<ActionData> => {
  const { data } = await axios.get<ActionData>(`${API_BASE}/action-items`, {
    params: { userId: HARD_USER_ID },
    timeout: 20000,
  });
  return data;
};

export const deleteActionItem = async (itemId: string): Promise<DeleteActionItemResponse> => {
  const { data } = await axios.delete<DeleteActionItemResponse>(
    `${API_BASE}/action-items/${itemId}`,
    { params: { userId: HARD_USER_ID }, timeout: 10000 }
  );
  return data;
};

// ✅ NEW: PATCH a single field (completed) optimistically
export async function toggleActionItem(id: string) {
  const userId = HARD_USER_ID // ensure this returns a string
  await axios.patch(`${API_BASE}/action-items/${id}/toggle`, null, {
    params: { userId },
    // no response body expected; 204 is success
    validateStatus: (s) => s === 204 || (s >= 200 && s < 300),
  });
}

// ── Additions ──────────────────────────────────────────────────────────────────
export type CreateActionItemDto = {
  action: string;
  category?: string | null;   // omit/NULL to let backend default it
  dueDate?: string | null;    // ISO string or null
  completed?: boolean;        // optional; defaults false server-side
};

export async function createActionItem(
  dto: CreateActionItemDto,
  userId: string = HARD_USER_ID
): Promise<ActionItem> {
  const { data } = await axios.post<ActionItem>(
    `${API_BASE}/action-items`,
    dto,
    { params: { userId }, timeout: 20000 }
  );
  return data;
}

export async function fetchExistingCategories(
  userId: string = HARD_USER_ID
): Promise<string[]> {
  const data = await fetchActionItems();
  const cats = new Set<string>();
  for (const it of [...(data.pending ?? []), ...(data.completed ?? [])]) {
    const c = (it.category ?? "").trim();
    if (c) cats.add(c);
  }
  return Array.from(cats).sort((a, b) => a.localeCompare(b));
}
