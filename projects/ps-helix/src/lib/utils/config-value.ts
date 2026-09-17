/**
 * A configured default that may be computed each time it is read.
 *
 * Every visible string the library ships is a key on a `*_CONFIG` token, so an application
 * translates the whole design system in one `provideHelix()` call. That works as long as the
 * language is settled before the components render — the value is read once, when the
 * component is built.
 *
 * An application with a language switcher needs the value re-read when the language changes,
 * and passing a function is how it says so:
 *
 *     provideHelix({
 *       components: {
 *         select: { placeholder: () => translate.instant('psh.select.placeholder') },
 *         modal: { dismissLabel: 'Fermer' },     // still fine, and still the common case
 *       },
 *     })
 *
 * The component reads prose through a `computed`, so a function that touches a signal — which
 * every i18n library in Angular now exposes — re-runs on a language change and the label
 * updates in place. A plain string costs nothing and behaves exactly as before.
 *
 * Only prose is treated this way. `size`, `appearance`, `placement` and their kind stay plain
 * values: they are not translated, and nothing is gained by making twenty enum defaults
 * lazily evaluated.
 */
export type PshConfigValue<T> = T | (() => T);

/**
 * Reads a configured value, calling it if it is a thunk.
 *
 * Call it inside the `computed` that exposes the value, never in a field initialiser —
 * resolving it once at construction is exactly the behaviour this exists to avoid.
 */
export function pshResolveConfigValue<T>(value: PshConfigValue<T> | undefined): T | undefined {
  return typeof value === 'function' ? (value as () => T)() : value;
}
