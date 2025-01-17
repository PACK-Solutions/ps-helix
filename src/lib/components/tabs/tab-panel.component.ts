import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-tab-panel',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class TabPanelComponent {
  @Input() header = '';
  @Input() icon?: string;
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;
}