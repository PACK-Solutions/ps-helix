import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal
} from '@angular/core';
import { Tab } from './tabs.types';

@Component({
  selector: 'psh-tab',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tab-panel]': 'true',
    '[class.active]': 'isActive()',
    '[attr.role]': '"tabpanel"',
    '[attr.aria-labelledby]': '"tab-" + index()',
    '[attr.id]': '"panel-" + index()',
    '[attr.tabindex]': 'isActive() ? 0 : -1'
  }
})
export class PshTabComponent {
  header = input.required<string>();
  icon = input<string>();
  disabled = input(false);
  ariaLabel = input<string>();

  private _index = signal(0);
  private _isActive = signal(false);

  readonly index = this._index.asReadonly();
  readonly isActive = this._isActive.asReadonly();

  setIndex(value: number): void {
    this._index.set(value);
  }

  setActive(active: boolean): void {
    this._isActive.set(active);
  }

  toTabData(): Tab {
    return {
      header: this.header(),
      icon: this.icon(),
      content: '',
      disabled: this.disabled(),
      ariaLabel: this.ariaLabel()
    };
  }
}
