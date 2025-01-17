import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-collapse',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibCollapseComponent {
  @Input() expanded = false;
  @Input() disabled = false;
  @Input() icon = 'caret-down';
  @Input() variant: 'default' | 'outline' = 'default';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() header = '';

  @Output() expandedChange = new EventEmitter<boolean>();

  toggle(): void {
    if (!this.disabled) {
      this.expanded = !this.expanded;
      this.expandedChange.emit(this.expanded);
    }
  }
}