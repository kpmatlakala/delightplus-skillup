// src/utils/validation.ts
// Centralized validation utilities for CET Connect Portal

/**
 * Validates a South African phone number (mobile or landline).
 * Accepts numbers with or without country code (+27 or 0),
 * strips spaces, dashes, and parentheses.
 *
 * Returns true if valid, false otherwise.
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // Accept +27 or 0 at start
  if (/^(\+27|0)\d{9}$/.test(cleaned)) {
    // Disallow if it looks like an email
    if (cleaned.includes('@')) return false;
    return true;
  }
  return false;
}

/**
 * Returns a normalized phone number in +27 format, or null if invalid.
 */
export function normalizePhoneNumber(phone: string): string | null {
  if (!isValidPhoneNumber(phone)) return null;
  let cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('0')) {
    return '+27' + cleaned.slice(1);
  }
  if (cleaned.startsWith('+27')) {
    return cleaned;
  }
  return null;
}
