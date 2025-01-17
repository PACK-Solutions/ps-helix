import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-switch',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibSwitchComponent {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() label = '';
  @Input() error = '';
  @Input() success = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Output() checkedChange = new EventEmitter<boolean>();

  toggle(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.checkedChange.emit(this.checked);
    }
  }
}