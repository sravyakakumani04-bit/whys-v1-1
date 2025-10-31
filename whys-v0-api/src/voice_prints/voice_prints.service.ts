import { Injectable, BadRequestException } from '@nestjs/common';
import { DbService } from '../db/db.service';

export type VoiceGuest = { guestId: string; name: string };

@Injectable()
export class VoiceprintsService {
  constructor(private readonly db: DbService) {}

  async listGuests(userId: string): Promise<VoiceGuest[]> {
    if (!userId) throw new BadRequestException('userId is required');

    const { rows } = await this.db.query<VoiceGuest>(
      `
      SELECT
        rec.guest_id::text AS "guestId",
        rec.name::text     AS "name"
      FROM public.users u
      CROSS JOIN LATERAL jsonb_to_recordset(
        COALESCE(u.embeddings->'guests', '[]'::jsonb)
      ) AS rec(guest_id text, name text, encoding jsonb)
      WHERE u.user_id = $1::uuid
      `,
      [userId],
    );

    return rows; // [{ guestId, name }, ...]
  }
}
