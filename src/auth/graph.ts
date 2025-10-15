import { Client } from '@microsoft/microsoft-graph-client';

export interface GraphContact {
  id?: string;
  displayName?: string;
  emailAddresses?: { address?: string }[];
}

// Allow optional client injection for easier unit testing (avoid real network calls)
export async function fetchGraphContacts(
  accessToken: string,
  options?: { client?: Client }
): Promise<{ name: string; email: string }[]> {
  const client =
    options?.client ||
    Client.init({
      authProvider: done => {
        done(null, accessToken);
      },
    });

  const results: { name: string; email: string }[] = [];
  let url = '/me/contacts?$top=50';
  // Simple paging loop
  for (let i = 0; i < 10 && url; i++) {
  const resp = await (client as any).api(url).get();
    const contacts: GraphContact[] = resp.value || [];
    contacts.forEach(c => {
      const email = c.emailAddresses?.[0]?.address;
      const name = c.displayName || email || 'Unknown';
      if (email) results.push({ name, email });
    });
    url = resp['@odata.nextLink'] || '';
  }
  return results;
}