import { encrypt, decrypt } from "tanmayo7lock";

export function encryptObjectValues(obj: Record<string, unknown>) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = encrypt(obj[key as string]); // Apply decrypt to each value
    return acc;
  }, {} as Record<string, string>);
}

export function decryptObjectValues(obj: Record<string, string>) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = decrypt(obj[key as string]); // Apply decrypt to each value
    return acc;
  }, {} as Record<string, string>);
}
