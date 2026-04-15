import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

@Injectable()
export class PasswordHasherService {
  hash(plainText: string): string {
    const salt = randomBytes(16).toString('hex');
    const key = scryptSync(plainText, salt, 64).toString('hex');
    return `${salt}:${key}`;
  }

  verify(plainText: string, storedHash: string): boolean {
    const [salt, key] = storedHash.split(':');

    if (!salt || !key) {
      return false;
    }

    const derived = scryptSync(plainText, salt, 64);
    const original = Buffer.from(key, 'hex');

    if (derived.length !== original.length) {
      return false;
    }

    return timingSafeEqual(derived, original);
  }
}
