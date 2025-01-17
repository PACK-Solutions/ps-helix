import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-step',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() completed = false;
  @Input() error?: string;
  @Input() warning?: string;
  @Input() disabled = false;
  @Input() success?: string;
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;
}