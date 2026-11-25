import { describe, it, expect } from 'vitest';
import { VaultEncryption } from '../src/core/vault_encryption';

describe('VaultEncryption', () => {
  it('encrypts and decrypts secret dreams losslessly', async () => {
    const plaintext = 'Secret nocturnal vision: the golden gate revealed the hidden key.';
    const password = 'mySecretSuperPasscode123!';

    const ciphertext = await VaultEncryption.encrypt(plaintext, password);
    expect(ciphertext).toBeDefined();
    expect(ciphertext).not.toEqual(plaintext);
    expect(ciphertext.length).toBeGreaterThan(20);

    const decrypted = await VaultEncryption.decrypt(ciphertext, password);
    expect(decrypted).toBe(plaintext);
  });

  it('fails decryption with wrong password', async () => {
    const plaintext = 'Classified dream log.';
    const ciphertext = await VaultEncryption.encrypt(plaintext, 'correctPass');

    await expect(VaultEncryption.decrypt(ciphertext, 'wrongPass')).rejects.toThrow();
  });
});
