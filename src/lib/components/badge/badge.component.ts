import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BadgeSize, BadgeVariant, BadgePosition, BadgeDisplayType } from './badge.types';
import { BadgeService } from './badge.service';
import { BADGE_CONFIG } from './badge.config';

@Component({
  selector: 'lib-badge',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BadgeService]
})
export class LibBadgeComponent<T = number> {
  private badgeService = inject(BadgeService);
  private config = inject(BADGE_CONFIG);
  private translateService = inject(TranslateService);
  
  // Model inputs with defaults from config
  variant = model.required<BadgeVariant>();
  size = model<BadgeSize>(this.config.size ?? 'medium');
  displayType = model<BadgeDisplayType>(this.config.displayType ?? 'counter');
  content = model<string>('');
  visible = model(true);
  value = model<T>();
  max = model(this.config.max ?? 99);
  showZero = model(this.config.showZero ?? false);
  position = model<BadgePosition>(this.config.position ?? 'top-right');

  // Regular inputs
  overlap = input(false);
  ariaLabel = input<string>();
  formatter = input<((value: T) => string) | undefined>();
  translateKey = input<string>();
  translateParams = input<Record<string, any>>();

  // Computed values
  translatedContent = computed(() => {
    if (this.translateKey()) {
      const key = this.translateKey();
      return key ? this.translateService.instant(key, this.translateParams() || {}) : '';
    }
    return this.content();
  });

  translatedAriaLabel = computed(() => {
    if (this.ariaLabel()) {
      const label = this.ariaLabel();
      return label ? this.translateService.instant(label, this.translateParams() || {}) : '';
    }
    return this.computedAriaLabel();
  });

  shouldDisplay = computed(() => 
    this.visible() && 
    (this.displayType() === 'dot' || this.displayType() === 'counter' ? 
      this.computeDisplayValue() !== '' : 
      !!this.translatedContent())
  );

  computeDisplayValue = computed(() => {
    if (this.displayType() !== 'counter' || this.value() === undefined) return '';
    
    const currentValue = this.value();
    const currentFormatter = this.formatter();

    // Si un formatter personnalisé est fourni et qu'on a une valeur
    if (currentFormatter && currentValue !== null && currentValue !== undefined) {
      return currentFormatter(currentValue);
    }

    // Pour les valeurs numériques, utiliser le formatter par défaut
    if (typeof currentValue === 'number') {
      const numericValue = currentValue;
      if (!this.badgeService.shouldDisplayValue(numericValue, this.showZero())) return '';
      return this.badgeService.formatValue(numericValue, this.max() ?? 99);
    }

    // Pour les autres types, convertir en string
    return currentValue !== undefined ? String(currentValue) : '';
  });

  computedAriaLabel = computed(() => 
    this.ariaLabel() || this.translatedContent() || this.computeDisplayValue()
  );

  computedRole = computed(() => 
    this.badgeService.getAriaRole(this.displayType())
  );

  customStyles = computed(() => {
    const styles = this.badgeService.getCustomStyles();
    return Object.assign({}, ...styles);
  });
}