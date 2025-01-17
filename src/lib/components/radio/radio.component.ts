import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-radio',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibRadioComponent {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() label = '';
  @Input() value: any;
  @Input() name = '';
  @Input() error = '';
  @Input() success = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<any>();

  toggle(): void {
    if (!this.disabled && !this.checked) {
      this.checked = true;
      this.checkedChange.emit(this.checked);
      this.valueChange.emit(this.value);
    }
  }
}