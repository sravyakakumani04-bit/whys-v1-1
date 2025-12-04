// // // src/action-items/action-items.service.ts
// // import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// // import { DbService } from '../db/db.service';

// // export type Item = {
// //   id: string;
// //   action: string;
// //   category: string;          // FE will handle category grouping/badges
// //   dueDate: string | null;
// //   completed: boolean;
// //   createdAt: string;
  
// // };

// // type CreatePayload = {
// //   action: string;
// //   category?: string;         // optional; defaults to "General" if blank/omitted
// //   dueDate?: string | null;   // ISO or null; blank → null
// //   completed?: boolean;       // optional; defaults to false
// // };

// // type UpdatePayload = Partial<CreatePayload>;

// // @Injectable()
// // export class ActionItemsService {
// //   constructor(private readonly db: DbService) {}

// //   /* ─────────────────────────── Helpers ─────────────────────────── */
// //   private normAction(a?: string) {
// //     const s = (a ?? '').trim();
// //     if (!s) throw new BadRequestException('Action text is required');
// //     return s;
// //   }
// //   private normCategory(cat?: string) {
// //     const c = (cat ?? '').trim();
// //     return c.length ? c : null;
// //   }
// //   private normDueDate(d?: string | null) {
// //     if (d === undefined || d === '' || d === null) return null;
// //     return d; // assume ISO; DB casts to timestamptz
// //   }
// //   private normCompleted(v?: boolean) {
// //     return v ?? false;
// //   }

// //   /* ─────────────────────────── Queries ─────────────────────────── */
// //   // Minimal list(): no categories/byCategory; FE handles all grouping/badges.
// //   async list(userId: string) {
// //     const { rows } = await this.db.query<Item>(
// //       `
// //       SELECT
// //         action_items_id AS id,
// //         action_item      AS action,
// //         category,
// //         deadline_at      AS "dueDate",
// //         completed,
// //         created_at       AS "createdAt"
        
// //       FROM action_items
// //       WHERE user_id = $1
// //       ORDER BY
// //         completed ASC,                               -- incomplete first
// //         COALESCE(deadline_at, '9999-12-31') ASC,     -- nulls last
// //         created_at DESC                              -- newest within ties
// //       `,
// //       [userId],
// //     );

// //     const pending = rows.filter(r => !r.completed);
// //     const completed = rows.filter(r => r.completed);

// //     return {
// //       counts: {
        
// //         pending: pending.length,
// //         completed: completed.length,
// //       },
// //           // FE derives categories/groups/badges
// //       pending,         // keep if FE wants ready-made lists
// //       completed,       // keep if FE wants ready-made lists
// //     };
// //   }

// //   async create(userId: string, p: CreatePayload): Promise<Item> {
// //     const action    = this.normAction(p.action);
// //     const category  = this.normCategory(p.category);
// //     const dueDate   = this.normDueDate(p.dueDate);
// //     const completed = this.normCompleted(p.completed);

// //     const { rows } = await this.db.query<Item>(
// //       `
// //       INSERT INTO action_items (
// //         action_items_id, user_id, action_item, category, deadline_at, completed
// //       )
// //       VALUES (
// //         gen_random_uuid(), $1, $2, $3, $4::timestamptz, $5
// //       )
// //       RETURNING
// //         action_items_id AS id,
// //         action_item      AS action,
// //         category,
// //         deadline_at      AS "dueDate",
// //         completed,
// //         created_at       AS "createdAt",
       
// //       `,
// //       [userId, action, category, dueDate, completed],
// //     );

// //     return rows[0];
// //   }

// //   async update(id: string, userId: string, p: UpdatePayload): Promise<Item> {
// //     const sets: string[] = [];
// //     const vals: any[] = [];
// //     let i = 1;

// //     // Normalize first; prevents writing blanks
// //     const normed = {
// //       action:    p.action    !== undefined ? this.normAction(p.action) : undefined,
// //       category:  p.category  !== undefined ? this.normCategory(p.category) : undefined,
// //       dueDate:   p.dueDate   !== undefined ? this.normDueDate(p.dueDate) : undefined,
// //       completed: p.completed !== undefined ? this.normCompleted(p.completed) : undefined,
// //     };

// //     if (normed.action !== undefined)    { sets.push(`action_item = $${i++}`); vals.push(normed.action); }
// //     if (normed.category !== undefined)  { sets.push(`category = $${i++}`); vals.push(normed.category); }
// //     if (normed.dueDate !== undefined)   { sets.push(`deadline_at = $${i++}::timestamptz`); vals.push(normed.dueDate); }
// //     if (normed.completed !== undefined) { sets.push(`completed = $${i++}`); vals.push(normed.completed); }

// //     if (sets.length === 0) {
// //       const cur = await this.findOne(id, userId);
// //       if (!cur) throw new NotFoundException('Item not found');
// //       return cur;
// //     }

// //     vals.push(id, userId);

// //     const { rows } = await this.db.query<Item>(
// //       `
// //       UPDATE action_items
// //          SET ${sets.join(', ')},
// //              updated_at = now()
// //        WHERE action_items_id = $${i++}
// //          AND user_id = $${i}
// //       RETURNING
// //         action_items_id AS id,
// //         action_item      AS action,
// //         category,
// //         deadline_at      AS "dueDate",
// //         completed,
// //         created_at       AS "createdAt"
       
// //       `,
// //       vals,
// //     );

// //     if (rows.length === 0) throw new NotFoundException('Item not found');
// //     return rows[0];
// //   }

// //   async delete(id: string, userId: string) {
// //     const { rows } = await this.db.query<{ id: string }>(
// //       `DELETE FROM action_items WHERE action_items_id = $1 AND user_id = $2 RETURNING action_items_id AS id`,
// //       [id, userId],
// //     );
// //     if (rows.length === 0) throw new NotFoundException('Item not found');
// //     return { id: rows[0].id, deleted: true };
// //   }
// //   async toggle(id: string, userId: string): Promise<boolean> {
// //   const { rowCount } = await this.db.query(
// //     `UPDATE action_items
// //        SET completed = NOT completed
// //      WHERE action_items_id = $1 AND user_id = $2`,
// //     [id, userId],
// //   );
// //   return rowCount === 1;
// // }


// //   private async findOne(id: string, userId: string): Promise<Item | undefined> {
// //     const { rows } = await this.db.query<Item>(
// //       `
// //       SELECT
// //         action_items_id AS id,
// //         action_item      AS action,
// //         category,
// //         deadline_at      AS "dueDate",
// //         completed,
// //         created_at       AS "createdAt"
       
// //       FROM action_items
// //       WHERE action_items_id = $1 AND user_id = $2
// //       `,
// //       [id, userId],
// //     );
// //     return rows[0];
// //   }
// // }
// // src/action-items/action-items.service.ts
// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { DbService } from '../db/db.service';

// export type Item = {
//   id: string;
//   action: string;
//   category: string | null;
//   dueDate: string | null;
//   completed: boolean;
//   createdAt: string;
// };

// type CreatePayload = {
//   action: string;
//   category?: string;
//   dueDate?: string | null;
//   completed?: boolean;
// };

// type UpdatePayload = Partial<CreatePayload>;

// @Injectable()
// export class ActionItemsService {
//   constructor(private readonly db: DbService) {}

//   /* ─────────────────────────── Helpers ─────────────────────────── */
//   private normAction(a?: string) {
//     const s = (a ?? '').trim();
//     if (!s) throw new BadRequestException('Action text is required');
//     return s;
//   }
//   private normCategory(cat?: string) {
//     const c = (cat ?? '').trim();
//     return c.length ? c : "All";
//   }
//   private normDueDate(d?: string | null) {
//     if (d === undefined || d === '' || d === null) return null;
//     return d;
//   }
//   private normCompleted(v?: boolean) {
//     return v ?? false;
//   }

//   /* ─────────────────────────── Queries ─────────────────────────── */
//   async list(userId: string) {
//     const { rows } = await this.db.query<Item>(
//       `
//       SELECT
//         action_items_id AS id,
//         action_item      AS action,
//         category,
//         deadline_at      AS "dueDate",
//         completed,
//         created_at       AS "createdAt"
//       FROM action_items
//       WHERE user_id = $1
//       ORDER BY
//         completed ASC,
//         COALESCE(deadline_at, '9999-12-31') ASC,
//         created_at DESC
//       `,
//       [userId],
//     );

//     const pending = rows.filter(r => !r.completed);
//     const completed = rows.filter(r => r.completed);

//     return {
//       counts: {
//         pending: pending.length,
//         completed: completed.length,
//       },
//       pending,
//       completed,
//     };
//   }

//   async create(userId: string, p: CreatePayload): Promise<Item> {
//     const action    = this.normAction(p.action);
//     const category  = this.normCategory(p.category);
//     const dueDate   = this.normDueDate(p.dueDate);
//     const completed = this.normCompleted(p.completed);

//     const { rows } = await this.db.query<Item>(
//       `
//       INSERT INTO action_items (
//         action_items_id, user_id, action_item, category, deadline_at, completed
//       )
//       VALUES (
//         gen_random_uuid(), $1, $2, $3, $4::timestamptz, $5
//       )
//       RETURNING
//         action_items_id AS id,
//         action_item      AS action,
//         category,
//         deadline_at      AS "dueDate",
//         completed,
//         created_at       AS "createdAt"
//       `,
//       [userId, action, category, dueDate, completed],
//     );

//     return rows[0];
//   }

//   async update(id: string, userId: string, p: UpdatePayload): Promise<Item> {
//     const sets: string[] = [];
//     const vals: any[] = [];
//     let i = 1;

//     const normed = {
//       action:    p.action    !== undefined ? this.normAction(p.action) : undefined,
//       category:  p.category  !== undefined ? this.normCategory(p.category) : undefined,
//       dueDate:   p.dueDate   !== undefined ? this.normDueDate(p.dueDate) : undefined,
//       completed: p.completed !== undefined ? this.normCompleted(p.completed) : undefined,
//     };

//     if (normed.action !== undefined)    { sets.push(`action_item = $${i++}`); vals.push(normed.action); }
//     if (normed.category !== undefined)  { sets.push(`category = $${i++}`); vals.push(normed.category); }
//     if (normed.dueDate !== undefined)   { sets.push(`deadline_at = $${i++}::timestamptz`); vals.push(normed.dueDate); }
//     if (normed.completed !== undefined) { sets.push(`completed = $${i++}`); vals.push(normed.completed); }

//     if (sets.length === 0) {
//       const cur = await this.findOne(id, userId);
//       if (!cur) throw new NotFoundException('Item not found');
//       return cur;
//     }

//     vals.push(id, userId);

//     const { rows } = await this.db.query<Item>(
//       `
//       UPDATE action_items
//          SET ${sets.join(', ')}
//        WHERE action_items_id = $${i++}
//          AND user_id = $${i}
//       RETURNING
//         action_items_id AS id,
//         action_item      AS action,
//         category,
//         deadline_at      AS "dueDate",
//         completed,
//         created_at       AS "createdAt"
//       `,
//       vals,
//     );

//     if (rows.length === 0) throw new NotFoundException('Item not found');
//     return rows[0];
//   }

//   async delete(id: string, userId: string) {
//     const { rows } = await this.db.query<{ id: string }>(
//       `DELETE FROM action_items WHERE action_items_id = $1 AND user_id = $2 RETURNING action_items_id AS id`,
//       [id, userId],
//     );
//     if (rows.length === 0) throw new NotFoundException('Item not found');
//     return { id: rows[0].id, deleted: true };
//   }

//   async toggle(id: string, userId: string): Promise<boolean> {
//     const { rowCount } = await this.db.query(
//       `UPDATE action_items
//          SET completed = NOT completed
//        WHERE action_items_id = $1 AND user_id = $2`,
//       [id, userId],
//     );
//     return rowCount === 1;
//   }

//   private async findOne(id: string, userId: string): Promise<Item | undefined> {
//     const { rows } = await this.db.query<Item>(
//       `
//       SELECT
//         action_items_id AS id,
//         action_item      AS action,
//         category,
//         deadline_at      AS "dueDate",
//         completed,
//         created_at       AS "createdAt"
//       FROM action_items
//       WHERE action_items_id = $1 AND user_id = $2
//       `,
//       [id, userId],
//     );
//     return rows[0];
//   }
// }
// src/action-items/action-items.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '../db/db.service';

export type Item = {
  id: string;
  action: string;
  category: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
};

type CreatePayload = {
  action: string;
  category?: string;
  dueDate?: string | null;
  completed?: boolean;
};

type UpdatePayload = Partial<CreatePayload>;

@Injectable()
export class ActionItemsService {
  constructor(private readonly db: DbService) {}

  /* ─────────────────────────── Helpers ─────────────────────────── */
  private normAction(a?: string) {
    const s = (a ?? '').trim();
    if (!s) throw new BadRequestException('Action text is required');
    return s;
  }

  private normDueDate(d?: string | null) {
    if (d === undefined || d === '' || d === null) return null;
    return d;
  }

  private normCompleted(v?: boolean) {
    return v ?? false;
  }

  /* ─────────────────────────── Queries ─────────────────────────── */
  async list(userId: string) {
    const { rows } = await this.db.query<Item>(
      `
      SELECT
        action_items_id AS id,
        action_item      AS action,
        category,
        deadline_at      AS "dueDate",
        completed,
        created_at       AS "createdAt"
      FROM action_items
      WHERE user_id = $1
      ORDER BY
        completed ASC,
        COALESCE(deadline_at, '9999-12-31') ASC,
        created_at DESC
      `,
      [userId],
    );

    const pending = rows.filter(r => !r.completed);
    const completed = rows.filter(r => r.completed);

    return {
      counts: {
        pending: pending.length,
        completed: completed.length,
      },
      pending,
      completed,
    };
  }

  async create(userId: string, p: CreatePayload): Promise<Item> {
    const action = this.normAction(p.action);
    const category = (p.category ?? '').trim();
    const dueDate = this.normDueDate(p.dueDate);
    const completed = this.normCompleted(p.completed);

    // Build dynamic query based on whether category is provided
    const hasCategory = category.length > 0;

    const query = hasCategory
      ? {
          sql: `
            INSERT INTO action_items (
              action_items_id, user_id, action_item, category, deadline_at, completed
            )
            VALUES (
              gen_random_uuid(), $1, $2, $3, $4::timestamptz, $5
            )
            RETURNING
              action_items_id AS id,
              action_item      AS action,
              category,
              deadline_at      AS "dueDate",
              completed,
              created_at       AS "createdAt"
          `,
          params: [userId, action, category, dueDate, completed],
        }
      : {
          sql: `
            INSERT INTO action_items (
              action_items_id, user_id, action_item, deadline_at, completed
            )
            VALUES (
              gen_random_uuid(), $1, $2, $3::timestamptz, $4
            )
            RETURNING
              action_items_id AS id,
              action_item      AS action,
              category,
              deadline_at      AS "dueDate",
              completed,
              created_at       AS "createdAt"
          `,
          params: [userId, action, dueDate, completed],
        };

    const { rows } = await this.db.query<Item>(query.sql, query.params);
    return rows[0];
  }

  async update(id: string, userId: string, p: UpdatePayload): Promise<Item> {
    const sets: string[] = [];
    const vals: any[] = [];
    let i = 1;

    // Normalize and build SET clause
    if (p.action !== undefined) {
      const action = this.normAction(p.action);
      sets.push(`action_item = $${i++}`);
      vals.push(action);
    }

    if (p.category !== undefined) {
      const category = (p.category ?? '').trim();
      if (category.length > 0) {
        sets.push(`category = $${i++}`);
        vals.push(category);
      } else {
        // Reset to default if empty string provided
        sets.push(`category = DEFAULT`);
      }
    }

    if (p.dueDate !== undefined) {
      const dueDate = this.normDueDate(p.dueDate);
      sets.push(`deadline_at = $${i++}::timestamptz`);
      vals.push(dueDate);
    }

    if (p.completed !== undefined) {
      const completed = this.normCompleted(p.completed);
      sets.push(`completed = $${i++}`);
      vals.push(completed);
    }

    if (sets.length === 0) {
      const cur = await this.findOne(id, userId);
      if (!cur) throw new NotFoundException('Item not found');
      return cur;
    }

    vals.push(id, userId);

    const { rows } = await this.db.query<Item>(
      `
      UPDATE action_items
         SET ${sets.join(', ')}
       WHERE action_items_id = $${i++}
         AND user_id = $${i}
      RETURNING
        action_items_id AS id,
        action_item      AS action,
        category,
        deadline_at      AS "dueDate",
        completed,
        created_at       AS "createdAt"
      `,
      vals,
    );

    if (rows.length === 0) throw new NotFoundException('Item not found');
    return rows[0];
  }

  async delete(id: string, userId: string) {
    const { rows } = await this.db.query<{ id: string }>(
      `DELETE FROM action_items WHERE action_items_id = $1 AND user_id = $2 RETURNING action_items_id AS id`,
      [id, userId],
    );
    if (rows.length === 0) throw new NotFoundException('Item not found');
    return { id: rows[0].id, deleted: true };
  }

  async toggle(id: string, userId: string): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `UPDATE action_items
         SET completed = NOT completed
       WHERE action_items_id = $1 AND user_id = $2`,
      [id, userId],
    );
    return rowCount === 1;
  }

  private async findOne(id: string, userId: string): Promise<Item | undefined> {
    const { rows } = await this.db.query<Item>(
      `
      SELECT
        action_items_id AS id,
        action_item      AS action,
        category,
        deadline_at      AS "dueDate",
        completed,
        created_at       AS "createdAt"
      FROM action_items
      WHERE action_items_id = $1 AND user_id = $2
      `,
      [id, userId],
    );
    return rows[0];
  }
}