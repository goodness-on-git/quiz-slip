import { describe, expect, it } from 'vitest';
import { clampAmount, DEFAULT_SETTINGS } from './settings';

describe('clampAmount', () => {
  it('keeps values inside 1 to 50', () => {
    expect(clampAmount(0)).toBe(1);
    expect(clampAmount(500)).toBe(50);
    expect(clampAmount(20)).toBe(20);
  });

  it('rounds decimals', () => {
    expect(clampAmount(7.6)).toBe(8);
  });

  it('falls back to the default for non-numbers', () => {
    expect(clampAmount(Number.NaN)).toBe(DEFAULT_SETTINGS.amount);
  });
});
