import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputSize, InputVariant } from './input.types';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibInputComponent {
  @Input() variant: InputVariant = 'default';
  @Input() size: InputSize = 'medium';
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() value = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() error = '';
  @Input() success = '';
  @Input() hint = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }

  handleFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  handleBlur(event: FocusEvent): void {
    this.blur.emit(event);
  }
}