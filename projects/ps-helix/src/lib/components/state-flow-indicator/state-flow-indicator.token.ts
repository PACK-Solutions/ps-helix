import { InjectionToken } from '@angular/core';

/**
 * What a `psh-flow-step` needs from the indicator it sits in: the id prefix its tab uses.
 *
 * See `PSH_STEPPER` for why this is a token and not an import, and for what the global ids
 * `flow-step-0` / `flow-panel-0` did to a page holding two of these.
 */
export interface PshStateFlowApi {
  /** Unique per indicator instance. Tabs are `<prefix>-tab-<i>`, panels `<prefix>-panel-<i>`. */
  readonly idPrefix: string;
}

export const PSH_STATE_FLOW = new InjectionToken<PshStateFlowApi>('PSH_STATE_FLOW');
