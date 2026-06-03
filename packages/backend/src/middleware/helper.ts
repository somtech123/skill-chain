// ─── Helper ───────────────────────────────────────────────────────────────────

export default function extractField(
  message: string,
  field: string,
): string | null {
  const lines = message.split("\n");
  const idx = lines.findIndex((l) => l.trim() === `${field}:`);
  return idx !== -1 && lines[idx + 1] ? lines[idx + 1].trim() : null;
}
