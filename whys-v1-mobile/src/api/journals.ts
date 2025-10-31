import axios from 'axios';
import { API_BASE } from '../api/api';

export type JournalItem = {
  id: string;
  date: string;      // timestamptz from backend
  title: string;
  summary: string | null;
  category: string;
};
export type JournalSection = { title: string; data: JournalItem[] };

export async function fetchJournalSections(userId: string) {
  const url = `${API_BASE}/journals/sections`;
  const { data } = await axios.get<{ sections: JournalSection[] }>(url, {
    params: { userId },
    timeout: 20000,
  });
  return data.sections ?? [];
}
