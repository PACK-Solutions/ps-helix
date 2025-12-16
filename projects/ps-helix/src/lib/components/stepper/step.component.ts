import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal
} from '@angular/core';

@Component({
  selector: 'psh-step',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.step-content]': 'true',
    '[class.active]': 'isActive()',
    '[attr.role]': '"tabpanel"',
    '[attr.aria-labelledby]': '"step-" + index()',
    '[attr.id]': '"panel-" + index()',
    '[attr.tabindex]': 'isActive() ? 0 : -1',
    '[style.display]': 'isActive() ? "block" : "none"'
  }
})
export class PshStepComponent {
  title = input.required<string>();
  subtitle = input<string>();
  icon = input<string>();
  disabled = input(false);
  completed = input(false);
  loading = input(false);
  error = input<string>();
  warning = input<string>();
  success = input<string>();

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
