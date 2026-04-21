import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-demo-button',
  imports: [CommonModule, TranslateModule],
  template: `
    <button
      [class]="variant"
      [class.small]="size === 'small'"
      [class.large]="size === 'large'"
      [class.icon-button]="iconOnly"
      [attr.aria-label]="ariaLabel"
      (click)="onClick.emit($event)"
    >
      <span class="button-content">
        @if (icon) {
          <i class="ph ph-{{ icon }}" aria-hidden="true"></i>
        }
        @if (!iconOnly) {
          <ng-content></ng-content>
        }
      </span>
    </button>
  `,
  styleUrls: ['./demo-button.component.css']
})
export class DemoButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'text' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() icon?: string;
  @Input() iconOnly = false;
  @Input() ariaLabel?: string;

  @Output() onClick = new EventEmitter<MouseEvent>();
}