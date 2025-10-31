// src/api/voice_prints.ts
import axios from "axios";
import { API_BASE } from "../api/api";

export type VoiceGuest = { guestId: string; name: string };

export async function fetchVoiceGuests(
  userId: string,
  signal?: AbortSignal
): Promise<VoiceGuest[]> {
  const { data } = await axios.get<VoiceGuest[]>(
    `${API_BASE}/voiceprints/guests`,
    { params: { userId }, timeout: 20000, signal }
  );
  return data ?? [];
}
