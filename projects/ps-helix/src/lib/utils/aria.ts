/**
 * Joins the ids a component computes for itself with the ones a consumer supplied.
 *
 * `aria-describedby` takes a **list**, and that is the whole point here. A control that
 * already points at its own error message must not lose it because the caller added a hint of
 * their own, and a caller who adds one must not silently replace the error. Before 7.0.0 the
 * library offered no `ariaDescribedBy` input at all — zero across all 33 classes — so the only
 * way to attach extra guidance was to set the attribute from outside and overwrite whatever
 * the component had put there.
 *
 * Returns `null` rather than an empty string, because `aria-describedby=""` is a reference to
 * nothing and some screen readers announce it as such.
 */
export function pshJoinAriaIds(
  ...ids: readonly (string | null | undefined)[]
): string | null {
  const seen = new Set<string>();

  for (const entry of ids) {
    if (!entry) continue;
    for (const id of entry.split(/\s+/)) {
      if (id) seen.add(id);
    }
  }

  return seen.size > 0 ? [...seen].join(' ') : null;
}
