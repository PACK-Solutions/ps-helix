import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TagVariant, TagSize } from '../../types/tag.types';

@Component({
  selector: 'lib-tag',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibTagComponent {
  @Input() variant: TagVariant = 'primary';
  @Input() size: TagSize = 'medium';
  @Input() icon?: string;
  @Input() closable = false;
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() closed = new EventEmitter<void>();

  handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }

  handleClose(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.closed.emit();
    }
  }
}