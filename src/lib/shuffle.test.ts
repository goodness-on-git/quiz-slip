import { describe, expect, it } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('keeps every item exactly once', () => {
    const input = [1, 2, 3, 4, 5, 6];
    expect([...shuffle(input)].sort()).toEqual(input);
  });

  it('does not change the original array', () => {
    const input = ['a', 'b', 'c'];
    shuffle(input);
    expect(input).toEqual(['a', 'b', 'c']);
  });

  it('is predictable when given a random source', () => {
    // A source that always returns 0 swaps each item with the first one.
    expect(shuffle(['a', 'b', 'c'], () => 0)).toEqual(['b', 'c', 'a']);
  });

  it('handles empty and single-item arrays', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(['only'])).toEqual(['only']);
  });
});
