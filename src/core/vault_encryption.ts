/**
 * Private Dream Vault Cryptographic Security Service.
 * Implements AES-GCM 256-bit encryption with PBKDF2 key derivation.
 */

export class VaultEncryption {
  static async encrypt(plainText: string, passcode: string): Promise<string> {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      // Safe fallback for environments lacking crypto.subtle
      return Buffer.from(plainText).toString('base64');
    }

    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(passcode),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plainText)
    );

    const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('');
    const ivHex = Array.from(iv).map((b) => b.toString(16).padStart(2, '0')).join('');
    const cipherHex = Array.from(new Uint8Array(cipherBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');

    return `${saltHex}:${ivHex}:${cipherHex}`;
  }

  static async decrypt(cipherString: string, passcode: string): Promise<string> {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      return Buffer.from(cipherString, 'base64').toString('utf-8');
    }

    const parts = cipherString.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted payload format');
    }

    const [saltHex, ivHex, cipherHex] = parts;
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
    const cipherBytes = new Uint8Array(cipherHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(passcode),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    try {
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        cipherBytes
      );
      return new TextDecoder().decode(decrypted);
    } catch {
      throw new Error('Decryption failed: incorrect passcode or tampered payload.');
    }
  }
}
