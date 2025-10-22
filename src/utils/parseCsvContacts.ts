export interface ParsedContactInput { name: string; email: string }

// Simple RFC 5322-lite email validation (not exhaustive, but fine for POC)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseCsvContacts(csvText: string, existingEmails: Set<string> = new Set()): ParsedContactInput[] {
  // Normalize line endings and trim
  const lines = csvText.replace(/\r\n?/g, '\n').split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const results: ParsedContactInput[] = [];
  for (const line of lines) {
    // Split by comma, ignore quoted complexity for POC
    const parts = line.split(',').map(p => p.trim());
    if (parts.length < 2) continue;
    const [rawName, rawEmail] = parts;
    const email = rawEmail.toLowerCase();
  if (!emailRegex.test(email)) continue; // skip invalid or header row
  if (existingEmails.has(email)) continue; // skip duplicates
    const name = rawName || email; // fallback to email if name blank
    results.push({ name, email });
  }
  return results;
}