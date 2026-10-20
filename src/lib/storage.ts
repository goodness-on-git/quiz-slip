/**
 * Thin wrappers around sessionStorage. Storage can be missing or throw
 * (private windows, blocked site data), so every call is guarded and the
 * app keeps working without it.
 */
export function readSession(key: string): unknown {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: unknown): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Not being able to save is fine. The quiz just won't survive a refresh.
  }
}

export function removeSession(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Nothing to clean up.
  }
}
