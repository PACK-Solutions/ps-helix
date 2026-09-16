import { InjectionToken, Signal } from '@angular/core';
import { RadioSize } from './radio.types';

/**
 * What a `psh-radio` needs from the group that contains it.
 *
 * A token rather than the component class, because the dependency runs both ways: the group
 * reads its radios through `contentChildren(PshRadioComponent)`, and each radio asks its
 * group what the selected value is. Importing the class in both directions is a cycle;
 * importing an interface in one direction is not.
 */
export interface PshRadioGroupApi<T = unknown> {
  /** The `name` every radio in the group shares, so the browser treats them as one set. */
  readonly name: Signal<string>;
  /** The selected value. A radio is checked when this equals its own `value`. */
  readonly value: Signal<T | null>;
  /** Disables every radio in the group at once. */
  readonly disabled: Signal<boolean>;
  /** Applies to every radio in the group: radios in one set should be the same size. */
  readonly size: Signal<RadioSize>;
  /** Whether the group is required, for `aria-required` on each radio. */
  readonly required: Signal<boolean>;
  /** Selects a value. The group owns it, so a radio asks rather than sets. */
  select(value: T): void;
  /** The user is done with the group — emitted once, by the group, not once per radio. */
  markTouched(): void;
}

export const PSH_RADIO_GROUP = new InjectionToken<PshRadioGroupApi>('PSH_RADIO_GROUP');
