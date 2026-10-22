import crypto from 'node:crypto';

export function generateUniqueId(prefix = ''): string {
  const randomBytes = crypto.randomBytes(8).toString('hex');
  return prefix ? `${prefix}_${randomBytes}` : randomBytes;
}
