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
  readonly color = input<AlertType>(this.config.color ?? DEFAULT_CONFIG.type);
  readonly iconPosition = input<IconPosition>(this.config.iconPosition ?? DEFAULT_CONFIG.iconPosition);
  readonly closable = input(this.config.closable ?? DEFAULT_CONFIG.closable);
  readonly size = input<AlertSize>(this.config.size ?? DEFAULT_CONFIG.size);
  readonly showIcon = input(this.config.showIcon ?? DEFAULT_CONFIG.showIcon);
  readonly role = input<AlertRole>();
  readonly icon = input<string>();
  readonly ariaLabel = input<string>();
  readonly dismissLabelInput = input<string | undefined>(undefined, { alias: 'dismissLabel' });
  readonly dismissLabel = computed(
    () => this.dismissLabelInput() ?? pshResolveConfigValue(this.config.labels?.dismiss) ?? DEFAULT_LABELS.dismiss,
  );
  readonly ariaLive = input<'polite' | 'assertive'>();
  readonly content = input('');
  
  // Outputs
  closed = output<void>();

  // Computed values
  readonly defaultIcon = computed(() => DEFAULT_ICONS[this.color()] || 'info');
  readonly getIcon = computed(() => this.icon() || this.defaultIcon());

  readonly computedAriaLive = computed(() => 
    this.ariaLive() || (['warning', 'danger'].includes(this.color()) ? 'assertive' : 'polite')
  );

  readonly computedRole = computed(() => 
    this.role() || (['warning', 'danger'].includes(this.color()) ? 'alert' : 'status')
  );

  readonly state = computed(() => {
    if (this.closable()) return 'closable';
    return this.color();
  });

  handleClose(): void {
    this.closed.emit();
  }
}