import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbItem, BreadcrumbSize, BreadcrumbVariant } from './breadcrumb.types';
import { BreadcrumbService } from './breadcrumb.service';
import { BREADCRUMB_CONFIG } from './breadcrumb.config';

@Component({
  selector: 'lib-breadcrumb',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BreadcrumbService]
})
export class LibBreadcrumbComponent {
  private breadcrumbService = inject(BreadcrumbService);
  private config = inject(BREADCRUMB_CONFIG);

  // Model inputs with defaults from config
  separator = model<string>(this.config.separator ?? 'caret-right');
  size = model<BreadcrumbSize>(this.config.size ?? 'medium');
  variant = model<BreadcrumbVariant>(this.config.variant ?? 'default');

  // Regular inputs
  items = input<BreadcrumbItem[]>([]);
  ariaLabel = input<string>();

  // Computed values
  customStyles = computed(() => {
    const styles = this.breadcrumbService.getCustomStyles();
    return Object.assign({}, ...styles);
  });

  computedAriaLabel = computed(() => 
    this.ariaLabel() || 'Navigation par fil d\'ariane'
  );

  getItemAriaLabel = (item: BreadcrumbItem, isLast: boolean) => 
    item.ariaLabel || this.breadcrumbService.generateAriaLabel(item.label, isLast);
}