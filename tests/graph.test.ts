import { describe, it, expect } from 'vitest';
import { fetchGraphContacts } from '../src/auth/graph';

class MockGraphClient {
  private pages: any[];
  private index = 0;
  constructor(pages: any[]) {
    this.pages = pages;
  }
  api(_url: string) {
    return {
      get: async () => {
        const page = this.pages[this.index++];
        return page;
      },
    };
  }
}

describe('fetchGraphContacts', () => {
  it('maps contacts with email only, paged', async () => {
    const pages = [
      {
        value: [
          { id: '1', displayName: 'Alpha', emailAddresses: [{ address: 'alpha@example.com' }] },
          { id: '2', displayName: 'NoEmail' },
        ],
        '@odata.nextLink': '/me/contacts?$top=50&$skip=50',
      },
      {
        value: [
          { id: '3', displayName: 'Beta', emailAddresses: [{ address: 'beta@example.com' }] },
        ],
      },
    ];
    const client: any = new MockGraphClient(pages);
    const results = await fetchGraphContacts('fake-token', { client });
    expect(results).toEqual([
      { name: 'Alpha', email: 'alpha@example.com' },
      { name: 'Beta', email: 'beta@example.com' },
    ]);
  });
});
