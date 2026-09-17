import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal
} from '@angular/core';
import { PSH_STATE_FLOW } from './state-flow-indicator.token';
import { pshUniqueId } from '../../utils/unique-id';

/**
 * One step of a `psh-state-flow-indicator`, and the panel that belongs to it.
 *
 * Until 7.0.0 this component was `template: ''` with a permanent `display: none`, so anything
 * projected into it was **silently discarded** — and `psh-state-flow-indicator` had no
 * `<ng-content>` either, so there was nowhere for it to go. A developer copying the
 * `psh-step` pattern, which does project, got a blank screen and no error.
 *
 * It now behaves like `psh-step`: the active step's content is shown, the others are hidden,
 * and each is a `tabpanel` labelled by its tab.
 */
@Component({
  selector: 'psh-flow-step',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.psh-flow-step-content]': 'true',
    '[class.psh-active]': 'isActive()',
    '[attr.role]': '"tabpanel"',
    '[attr.aria-labelledby]': 'idPrefix + "-tab-" + index()',
    '[attr.id]': 'idPrefix + "-panel-" + index()',
    '[attr.tabindex]': 'isActive() ? 0 : -1',
    '[style.display]': 'isActive() ? "block" : "none"'
  }
})
export class PshFlowStepComponent {
  /** The indicator's id prefix; see `PshStepComponent` for the fallback. */
  protected readonly idPrefix =
    inject(PSH_STATE_FLOW, { optional: true })?.idPrefix ?? pshUniqueId('flow-step');

  readonly title = input.required<string>();
  /** Secondary line under the title. Parity with `psh-step`, which had it and this did not. */
  readonly subtitle = input<string>();
  /** Phosphor icon name, shown instead of the state icon. Parity with `psh-step`. */
  readonly icon = input<string>();
  readonly disabled = input(false);
  readonly completed = input(false);
  readonly loading = input(false);
  readonly error = input<string | null | undefined>(null);
  readonly warning = input<string | null | undefined>(null);
  /** Parity with `psh-step`. */
  readonly success = input<string | null | undefined>(null);

  private readonly _index = signal(0);
  private readonly _isActive = signal(false);

  readonly index = this._index.asReadonly();
  readonly isActive = this._isActive.asReadonly();

  setIndex(value: number): void {
    this._index.set(value);
  }

  setActive(value: boolean): void {
    this._isActive.set(value);
  }
}
