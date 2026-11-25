import { describe, it, expect, beforeEach } from 'vitest';
import { useJournalStore } from '../src/core/journal_store';

describe('useJournalStore', () => {
  beforeEach(() => {
    useJournalStore.setState({
      entries: [],
      searchQuery: '',
      selectedMood: 'ALL',
      isVaultLocked: true,
      vaultPasscode: '1234'
    });
  });

  it('adds and deletes dream entries', async () => {
    const store = useJournalStore.getState();
    const entry = await store.addEntry({
      title: 'Neon Flight',
      date: '2026-11-25',
      content: 'I flew past towering crystal skyscrapers over the ocean.',
      mood: 'EUPHORIC',
      lucidity: 5,
      sleepQuality: 9,
      tags: ['flight', 'city']
    });

    expect(entry.id).toBeDefined();
    expect(useJournalStore.getState().entries.length).toBe(1);
    expect(useJournalStore.getState().entries[0].title).toBe('Neon Flight');

    useJournalStore.getState().deleteEntry(entry.id);
    expect(useJournalStore.getState().entries.length).toBe(0);
  });

  it('manages vault lock and unlock state', async () => {
    const store = useJournalStore.getState();
    expect(store.isVaultLocked).toBe(true);

    const fail = await store.unlockVault('wrongcode');
    expect(fail).toBe(false);
    expect(useJournalStore.getState().isVaultLocked).toBe(true);

    const success = await store.unlockVault('1234');
    expect(success).toBe(true);
    expect(useJournalStore.getState().isVaultLocked).toBe(false);

    store.lockVault();
    expect(useJournalStore.getState().isVaultLocked).toBe(true);
  });
});
