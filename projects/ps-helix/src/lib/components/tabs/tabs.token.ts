import { InjectionToken } from '@angular/core';

/**
 * What a `psh-tab` needs from the tabs it sits in: the id prefix its tab button uses.
 *
 * See `PSH_STEPPER` for why this is a token rather than an import. The ids were `tab-0` and
 * `panel-0` — the *same* strings `psh-stepper` used, so a page with a tabs and a stepper had
 * duplicate ids across two unrelated components.
 */
export interface PshTabsApi {
  /** Unique per tabs instance. Tabs are `<prefix>-tab-<i>`, panels `<prefix>-panel-<i>`. */
  readonly idPrefix: string;
}

export const PSH_TABS = new InjectionToken<PshTabsApi>('PSH_TABS');
