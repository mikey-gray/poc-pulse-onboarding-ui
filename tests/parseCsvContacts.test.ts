import { describe, it, expect } from 'vitest';
import { parseCsvContacts } from '../src/utils/parseCsvContacts';

describe('parseCsvContacts', () => {
  it('parses valid rows', () => {
    const csv = 'John Doe,john@example.com\nJane,jane@domain.org';
    const res = parseCsvContacts(csv);
    expect(res).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane', email: 'jane@domain.org' },
    ]);
  });

  it('skips invalid email rows and empty lines', () => {
    const csv = 'Header,Email\nBad Row,no-at-symbol\nValid User,user@ok.com\n,blankname@site.net\n';
    const res = parseCsvContacts(csv);
    expect(res).toEqual([
      { name: 'Valid User', email: 'user@ok.com' },
      { name: 'blankname@site.net', email: 'blankname@site.net' },
    ]);
  });

  it('returns empty for all invalid', () => {
    const csv = 'OnlyOneColumn\nFoo,bar\nName,not-an-email';
    const res = parseCsvContacts(csv);
    expect(res.length).toBe(0);
  });
});
