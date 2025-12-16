import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertType, IconPosition, AlertSize, AlertRole, AlertLabels } from './alert.types';

// Default alert labels
const DEFAULT_LABELS: AlertLabels = {
  dismiss: 'Dismiss alert'
};

// Default alert icons
const DEFAULT_ICONS: Record<string, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'warning-octagon'
};

// Default alert configuration
const DEFAULT_CONFIG = {
  type: 'info' as AlertType,
  iconPosition: 'left' as IconPosition,
  closable: false,
  size: 'medium' as AlertSize,
  showIcon: true,
  role: 'alert' as AlertRole
};

@Component({
  selector: 'psh-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshAlertComponent {

  // Inputs
  type = input<AlertType>(DEFAULT_CONFIG.type);
  iconPosition = input<IconPosition>(DEFAULT_CONFIG.iconPosition);
  closable = input(DEFAULT_CONFIG.closable);
  size = input<AlertSize>(DEFAULT_CONFIG.size);
  showIcon = input(DEFAULT_CONFIG.showIcon);
  role = input<AlertRole>(DEFAULT_CONFIG.role);
  icon = input<string>();
  ariaLabel = input<string>();
  dismissLabel = input(DEFAULT_LABELS.dismiss);
  ariaLive = input<'polite' | 'assertive'>();
  content = input('');
  
  // Outputs
  closed = output<void>();

  // Computed values
  defaultIcon = computed(() => DEFAULT_ICONS[this.type()] || 'info');
  getIcon = computed(() => this.icon() || this.defaultIcon());

  ariaDescribedBy = computed(() => {
    const parts: string[] = [];
    if (this.ariaLabel()) parts.push('alert-label');
    return parts.length ? parts.join(' ') : undefined;
  });

  computedAriaLive = computed(() => 
    this.ariaLive() || (['warning', 'danger'].includes(this.type()) ? 'assertive' : 'polite')
  );

  computedRole = computed(() => 
    this.role() || (['warning', 'danger'].includes(this.type()) ? 'alert' : 'status')
  );

  state = computed(() => {
    if (this.closable()) return 'closable';
    return this.type();
  });

  handleClose(): void {
    this.closed.emit();
  }
}