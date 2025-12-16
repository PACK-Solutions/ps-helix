import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  TemplateRef,
  viewChild
} from '@angular/core';
import { Tab } from './tabs.types';

@Component({
  selector: 'psh-tab',
  template: '<ng-template><ng-content /></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PshTabComponent {
  header = input.required<string>();
  icon = input<string>();
  disabled = input(false);
  ariaLabel = input<string>();

  content = viewChild(TemplateRef);

  private _isActive = signal(false);
  readonly isActive = this._isActive.asReadonly();

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
