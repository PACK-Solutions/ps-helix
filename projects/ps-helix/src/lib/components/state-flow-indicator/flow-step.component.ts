import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal
} from '@angular/core';

@Component({
  selector: 'psh-flow-step',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"none"'
  }
})
export class PshFlowStepComponent {
  title = input.required<string>();
  disabled = input(false);
  completed = input(false);
  loading = input(false);
  error = input<string>();
  warning = input<string>();

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
