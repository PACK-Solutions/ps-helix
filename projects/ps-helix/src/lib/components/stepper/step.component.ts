import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal
} from '@angular/core';
import { PSH_STEPPER } from './stepper.token';
import { pshUniqueId } from '../../utils/unique-id';

@Component({
  selector: 'psh-step',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.psh-step-content]': 'true',
    '[class.psh-active]': 'isActive()',
    '[attr.role]': '"tabpanel"',
    '[attr.aria-labelledby]': 'idPrefix + "-tab-" + index()',
    '[attr.id]': 'idPrefix + "-panel-" + index()',
    '[attr.tabindex]': 'isActive() ? 0 : -1',
    '[style.display]': 'isActive() ? "block" : "none"'
  }
})
export class PshStepComponent {
  /**
   * The stepper's id prefix, so the panel's id matches the `aria-controls` of its tab.
   *
   * Falls back to an id of its own for a `psh-step` used outside a stepper: a dangling
   * `aria-labelledby` is worse than an unreferenced panel.
   */
  protected readonly idPrefix =
    inject(PSH_STEPPER, { optional: true })?.idPrefix ?? pshUniqueId('step');

  title = input.required<string>();
  subtitle = input<string>();
  icon = input<string>();
  disabled = input(false);
  completed = input(false);
  loading = input(false);
  error = input<string | null | undefined>(null);
  warning = input<string>();
  success = input<string | null | undefined>(null);

  private _index = signal(0);
  private _isActive = signal(false);

  readonly index = this._index.asReadonly();
  readonly isActive = this._isActive.asReadonly();

  setIndex(value: number): void {
    this._index.set(value);
  }

  setActive(value: boolean): void {
    this._isActive.set(value);
  }
}
