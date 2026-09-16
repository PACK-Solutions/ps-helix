/**
 * One deterministic id generator for the whole library.
 *
 * Five strategies coexisted before 7.0.0, and three of them were not safe:
 *
 *   `Math.random()`      select, modal, tooltip — a different id on the server and on the
 *                        client, so the ids baked into the SSR markup never matched the ones
 *                        the browser generated. Every `aria-describedby`,
 *                        `aria-labelledby` and `<label for>` they fed pointed at nothing
 *                        after hydration.
 *   `crypto.randomUUID()` switch, toast — same mismatch, plus it is simply **undefined in a
 *                        non-secure context**: over plain http, a switch threw on
 *                        construction.
 *   a module counter     input, textarea, checkbox, radio, collapse, pagination — correct,
 *                        and now the only one.
 *
 * A counter is deterministic because server and client render the same components in the
 * same order, so the nth component gets the same id in both passes. That is the whole
 * requirement; uniqueness across a page follows from it.
 */

let counter = 0;

/**
 * Returns a process-unique, render-order-stable DOM id.
 *
 * @param prefix Short component tag, e.g. `'input'`, `'modal'`. Namespaced for you.
 *
 * @example
 * private readonly id = pshUniqueId('select');   // 'psh-select-1', 'psh-select-2', …
 */
export function pshUniqueId(prefix: string): string {
  return `psh-${prefix}-${++counter}`;
}

/**
 * Resets the counter. Test-only: two suites that both assert on generated ids are otherwise
 * order-dependent on each other.
 *
 * @internal
 */
export function resetPshUniqueIdForTesting(): void {
  counter = 0;
}
