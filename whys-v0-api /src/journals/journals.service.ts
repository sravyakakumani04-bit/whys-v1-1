import { Injectable, BadRequestException } from '@nestjs/common';
import { DbService } from '../db/db.service';

type SectionRow = {
  title: string;       // e.g., "August 2024"
  data: {
    id: string;
    date: string;      // timestamptz (created_at) raw from PG
    title: string;
    summary: string | null;
    category: string;
  }[];
};

@Injectable()
export class JournalsService {
  constructor(private readonly db: DbService) {}

  /**
   * Returns { sections: [{ title, data: [{id,date,title,summary,category}] }] }
   * - date is created_at (timestamptz) returned as-is
   * - grouped by America/New_York month
   * - items ordered newest → oldest inside each section, sections newest → oldest
   */
  async listSections(userId: string) {
    if (!userId) throw new BadRequestException('userId is required');

    const { rows } = await this.db.query<SectionRow>(
      `
      WITH base AS (
        SELECT
          date_trunc('month', created_at AT TIME ZONE 'America/New_York')::date AS month_key,
          to_char(date_trunc('month', created_at AT TIME ZONE 'America/New_York')::date, 'FMMonth YYYY') AS month_title,
          journal_id AS id,
          created_at AS date,
          journal_title AS title,
          COALESCE(journal_summary, LEFT(journal_transcript, 180)) AS summary,
          journal_category AS category
        FROM public.journals
        WHERE user_id = $1
      )
      SELECT
        month_title AS title,
        json_agg(
          json_build_object(
            'id', id,
            'date', date,
            'title', title,
            'summary', summary,
            'category', category
          )
          ORDER BY date DESC
        ) AS data
      FROM base
      GROUP BY month_key, month_title
      ORDER BY month_key DESC
      `,
      [userId],
    );

    return { sections: rows };
  }
}
