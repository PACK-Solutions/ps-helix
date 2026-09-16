import { InjectionToken } from '@angular/core';

/**
 * What a `psh-step` needs from the stepper it sits in.
 *
 * Only the id prefix, and that is the point: the tab and its panel have to agree on an id, and
 * until 7.0.0 they agreed on a *global* one — `step-0`, `panel-0`. Two steppers on a page, or a
 * stepper beside a `psh-tabs` (which also used `panel-0`), produced duplicate ids, and every
 * `aria-controls` and `aria-labelledby` resolved to whichever element the browser found first.
 *
 * A token rather than an import because `psh-stepper` reads its steps with
 * `contentChildren(PshStepComponent)`: importing the parent from the child would close the
 * cycle. `PSH_RADIO_GROUP` exists for the same reason.
 */
export interface PshStepperApi {
  /** Unique per stepper instance. Tabs are `<prefix>-tab-<i>`, panels `<prefix>-panel-<i>`. */
  readonly idPrefix: string;
}

export const PSH_STEPPER = new InjectionToken<PshStepperApi>('PSH_STEPPER');
