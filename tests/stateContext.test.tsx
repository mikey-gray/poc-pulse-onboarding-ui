import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { StateProvider, useAppState } from '../src/state/StateContext';

function setup() {
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <StateProvider>{children}</StateProvider>
  );
  return renderHook(() => useAppState(), { wrapper });
}

describe('StateContext', () => {
  it('adds a contact', () => {
    const { result } = setup();
    const initial = result.current.contacts.length;
    act(() => result.current.addContact({ name: 'Test User', email: 'test@example.com' }));
    expect(result.current.contacts.length).toBe(initial + 1);
  });

  it('imports contacts', () => {
    const { result } = setup();
    const initial = result.current.contacts.length;
    act(() =>
      result.current.importContacts([
        { name: 'Bulk One', email: 'bulk1@example.com' },
        { name: 'Bulk Two', email: 'bulk2@example.com' },
      ])
    );
    expect(result.current.contacts.length).toBe(initial + 2);
  });

  it('assigns company admin', () => {
    const { result } = setup();
    const contactId = result.current.contacts[0].id;
    act(() => result.current.assignCompany(contactId));
  expect(result.current.companyAssignments.some((a: { contactId: string }) => a.contactId === contactId)).toBe(true);
  });

  it('assigns workspace manager and prevents duplicate', () => {
    const { result } = setup();
    let workspaceId: string = '';
    act(() => {
      workspaceId = result.current.addWorkspace();
    });
    const contactId = result.current.contacts[0].id;
    act(() => result.current.assignWorkspace(workspaceId, contactId));
    act(() => result.current.assignWorkspace(workspaceId, contactId)); // duplicate attempt
    const matches = result.current.workspaceAssignments.filter(
      (a: { workspaceId: string; contactId: string }) => a.workspaceId === workspaceId && a.contactId === contactId
    );
    expect(matches.length).toBe(1);
  });

  it('resets state', () => {
    const { result } = setup();
    act(() => result.current.addWorkspace());
    act(() => result.current.reset());
    expect(result.current.workspaces.length).toBe(0);
    expect(result.current.contacts.length).toBeGreaterThan(0); // initial seed restored
  });
});
