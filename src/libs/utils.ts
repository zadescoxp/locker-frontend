import { encrypt, decrypt } from "tanmayo7lock";

export function encryptObjectValues(obj: any) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = encrypt(obj[key as any]); // Apply decrypt to each value
    return acc;
  }, {} as Record<string, string>);
}

export function decryptObjectValues(obj: any) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = decrypt(obj[key as any]); // Apply decrypt to each value
    return acc;
  }, {} as Record<string, string>);
}
