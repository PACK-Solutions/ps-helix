import { ValidationErrors } from '@angular/forms';

/**
 * The `required` half of the form contract that was missing.
 *
 * Before 7.0.0, `required` on a ps-helix control drew an asterisk and set `aria-required`,
 * and that was all: `NG_VALIDATORS` appeared nowhere in the library. A form built from
 * `<psh-input required>` fields was valid while every one of them was empty, so
 * `form.invalid` never guarded anything and the submit button stayed enabled.
 *
 * The controls provide `NG_VALIDATORS` now. The error key is Angular's own `required`, so it
 * reads the same as `Validators.required` and a consumer who declared both gets one error,
 * not two.
 *
 * **This makes forms that were accidentally valid become invalid.** That is the point, and it
 * is the reason this waited for a major.
 */
export function pshRequiredError(isRequired: boolean, isEmpty: boolean): ValidationErrors | null {
  return isRequired && isEmpty ? { required: true } : null;
}

/**
 * Whether a control value counts as "nothing filled in".
 *
 * `false` is deliberately **not** empty for a text value but **is** for a checkbox, which is
 * why each control passes its own emptiness rather than sharing one rule: an unticked
 * required checkbox is unfilled, a `0` in a required number field is not.
 */
export function pshIsEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}
