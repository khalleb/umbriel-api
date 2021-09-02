export function removeSpecialCharacters(value: string): string {
  if (!value) {
    return value;
  }
  value = value.replace(/[^a-zA-Z0-9]/g, '');
  return value;
}

export function teste(value: string): string {
  return value;
}
