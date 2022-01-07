import { env } from '@shared/env';

export function removeSpecialCharacters(value: string): string {
  if (!value) {
    return value;
  }
  value = value.replace(/[^a-zA-Z0-9]/g, '');
  return value;
}

export function nameProject(): string {
  return env.NAME_PROJECT.replace('_', ' ');
}
