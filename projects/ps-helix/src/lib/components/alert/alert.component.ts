import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  inject,
} from '@angular/core';
import { pshResolveConfigValue } from '../../utils/config-value';
import { AlertType, IconPosition, AlertSize, AlertRole, AlertLabels } from './alert.types';
import { ALERT_CONFIG } from './alert.tokens';

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

const DEFAULT_CONFIG = {
  type: 'info' as AlertType,
  iconPosition: 'left' as IconPosition,
  closable: false,
  size: 'medium' as AlertSize,
  showIcon: true
};

@Component({
  selector: 'psh-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshAlertComponent {
  private readonly config = inject(ALERT_CONFIG);


  // Inputs
  color = input<AlertType>(this.config.color ?? DEFAULT_CONFIG.type);
  iconPosition = input<IconPosition>(this.config.iconPosition ?? DEFAULT_CONFIG.iconPosition);
  closable = input(this.config.closable ?? DEFAULT_CONFIG.closable);
  size = input<AlertSize>(this.config.size ?? DEFAULT_CONFIG.size);
  showIcon = input(this.config.showIcon ?? DEFAULT_CONFIG.showIcon);
  role = input<AlertRole>();
  icon = input<string>();
  ariaLabel = input<string>();
  dismissLabelInput = input<string | undefined>(undefined, { alias: 'dismissLabel' });
  dismissLabel = computed(
    () => this.dismissLabelInput() ?? pshResolveConfigValue(this.config.labels?.dismiss) ?? DEFAULT_LABELS.dismiss,
  );
  ariaLive = input<'polite' | 'assertive'>();
  content = input('');
  
  // Outputs
  closed = output<void>();

  // Computed values
  defaultIcon = computed(() => DEFAULT_ICONS[this.color()] || 'info');
  getIcon = computed(() => this.icon() || this.defaultIcon());

  computedAriaLive = computed(() => 
    this.ariaLive() || (['warning', 'danger'].includes(this.color()) ? 'assertive' : 'polite')
  );

  computedRole = computed(() => 
    this.role() || (['warning', 'danger'].includes(this.color()) ? 'alert' : 'status')
  );

  state = computed(() => {
    if (this.closable()) return 'closable';
    return this.color();
  });

  handleClose(): void {
    this.closed.emit();
  }
}