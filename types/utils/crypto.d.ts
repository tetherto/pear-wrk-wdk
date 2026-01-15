/**
 * Securely zero out sensitive memory (memzero)
 * @param buffer - Buffer to zero out
 */
export function memzero(buffer: Buffer | Uint8Array | ArrayBuffer): void;

/**
 * Generate a strong encryption key (32 bytes for AES-256)
 * @returns Base64-encoded encryption key
 */
export function generateEncryptionKey(): string;

/**
 * Encrypt data using AES-256-GCM
 * @param data - Data to encrypt
 * @param keyBase64 - Base64-encoded encryption key
 * @returns Base64-encoded encrypted data with IV and auth tag
 */
export function encrypt(data: Uint8Array | Buffer, keyBase64: string): string;

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedBase64 - Base64-encoded encrypted data with IV and auth tag
 * @param keyBase64 - Base64-encoded encryption key
 * @returns Decrypted data
 */
export function decrypt(encryptedBase64: string, keyBase64: string): Buffer;

/**
 * Generate entropy for a seed phrase
 * @param wordCount - Number of words (12 or 24)
 * @returns Entropy bytes
 */
export function generateEntropy(wordCount: 12 | 24): Uint8Array;

/**
 * Encrypt seed and entropy with a new encryption key
 * @param seed - Seed bytes to encrypt
 * @param entropy - Entropy bytes to encrypt
 * @returns Object containing encryptionKey, encryptedSeedBuffer, and encryptedEntropyBuffer
 */
export function encryptSecrets(seed: Uint8Array | Buffer, entropy: Uint8Array | Buffer): {
    encryptionKey: string;
    encryptedSeedBuffer: string;
    encryptedEntropyBuffer: string;
};
