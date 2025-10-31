//src/sessions/sessions.service.ts
import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class SessionsService {
  constructor(private readonly db: DbService) {}

  async findById(id: string) {
    const transcript = await this.db.query(
      `SELECT text, segments_json FROM transcripts WHERE session_id = $1`,
      [id]
    );

    const summary = await this.db.query(
      `SELECT summary_text FROM summaries WHERE session_id = $1`,
      [id]
    );

    const todos = await this.db.query(
      `SELECT owner, due_at, task FROM todos WHERE session_id = $1`,
      [id]
    );
    
    const blindspots = await this.db.query(
      `SELECT speaker_label, label, evidence
         FROM blindspots
        WHERE session_id = $1`,
  
      [id]
    );

    

    // Normalize segments to an array (or null)
    let segments: any = null;
    const rawSeg = transcript.rows[0]?.segments_json;
    if (rawSeg != null) {
      try {
        segments = typeof rawSeg === 'string' ? JSON.parse(rawSeg) : rawSeg;
        if (!Array.isArray(segments)) segments = null;
      } catch {
        segments = null;
      }
    }

    return {
      session_id: id,
      transcript: transcript.rows[0]?.text ?? null,
      segments, // now a real array or null
      summary: summary.rows[0]?.summary_text ?? null,
      to_do: todos.rows.map(t => ({
        owner: t.owner,
        due_at: t.due_at,
        task: t.task,
      })),
      blindspots: blindspots.rows.map(b => ({
        speaker_label: b.speaker_label,
        label: b.label,
        evidence: b.evidence,
      })),
    };
  }
}
