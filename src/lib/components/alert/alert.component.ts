import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AlertType, IconPosition, AlertSize, AlertRole } from './alert.types';
import { AlertService } from './alert.service';
import { ALERT_CONFIG } from './alert.config';

@Component({
  selector: 'lib-alert',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AlertService]
})
export class LibAlertComponent {
  private alertService = inject(AlertService);
  private config = inject(ALERT_CONFIG);
  
  // Required model inputs
  type = model.required<AlertType>();
  
  // Optional model inputs with defaults from config
  iconPosition = model<IconPosition>(this.config.iconPosition ?? 'left');
  closable = model(this.config.closable ?? false);
  size = model<AlertSize>(this.config.size ?? 'medium');
  showIcon = model(this.config.showIcon ?? true);
  role = model<AlertRole>(this.config.role ?? 'alert');
  
  // Regular inputs
  icon = input<string>();
  ariaLabel = input<string>();
  ariaLive = input<'polite' | 'assertive'>();
  
  // Outputs
  closed = output<void>();

  // Computed values using service
  defaultIcon = computed(() => this.alertService.getDefaultIcon(this.type()));
  getIcon = computed(() => this.icon() || this.defaultIcon());
  customStyles = computed(() => this.alertService.getCustomStyles());

  ariaDescribedBy = computed(() => {
    const parts: string[] = [];
    if (this.ariaLabel()) parts.push('alert-label');
    return parts.length ? parts.join(' ') : undefined;
  });

  computedAriaLive = computed(() => 
    this.ariaLive() || this.alertService.getAriaLive(this.type())
  );

  computedRole = computed(() => 
    this.role() || this.alertService.getAriaRole(this.type())
  );

  handleClose(): void {
    this.closed.emit();
  }
}