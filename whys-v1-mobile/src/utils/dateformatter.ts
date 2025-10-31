// // old (likely): export const fmtMonthYear = (iso: string) => /* "Nov 25" */
// // new:
// export const fmtMonthDay = (iso: string, tz = "America/New_York") => {
//   if (!iso) return "";
//   const d = new Date(iso);
//   // Month short + numeric day, e.g., "Nov 5" or "Nov 12"
//   return d.toLocaleString([], { month: "short", day: "numeric", timeZone: tz });
// };

// // If you still need Month+Year elsewhere, keep it but make it unambiguous:
// export const fmtMonthYear = (iso: string, tz = "America/New_York") => {
//   if (!iso) return "";
//   const d = new Date(iso);
//   // "Nov 2025" (full year so it’s not mistaken for a day)
//   return d.toLocaleString([], { month: "short", year: "numeric", timeZone: tz });
// };
// src/utils/datefmt.ts

// Parse "YYYY-MM-DD" as LOCAL date to avoid UTC shifting.
// If it's not a plain Y-M-D string, fall back to JS Date parsing.
export const parseYMDLocal = (iso: string): Date => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!m) return new Date(iso); // full ISO like 2025-11-05T15:00:00Z, etc.
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  return new Date(y, mo - 1, d); // local midnight (no UTC shift)
};

// "Nov 5" / "Nov 12"
export const fmtMonthDay = (iso: string, locale?: string) => {
  if (!iso) return "";
  const d = parseYMDLocal(iso);
  return d.toLocaleString(locale, { month: "short", day: "numeric" });
};

// "Nov 2025"
export const fmtMonthYear = (iso: string, locale?: string) => {
  if (!iso) return "";
  const d = parseYMDLocal(iso);
  return d.toLocaleString(locale, { month: "short", year: "numeric" });
};

// Optional helper if you need "Today" logic elsewhere
export const isToday = (iso: string) => {
  const d = parseYMDLocal(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};
