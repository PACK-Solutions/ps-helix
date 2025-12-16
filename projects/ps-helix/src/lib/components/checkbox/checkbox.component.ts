import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  inject,
  InjectionToken,
  input,
  model,
  signal
} from '@angular/core';
import { CheckboxSize, CheckboxConfig } from './checkbox.types';

/**
 * Token d'injection pour la configuration globale des checkboxes
 */
export const CHECKBOX_CONFIG = new InjectionToken<Partial<CheckboxConfig>>('CHECKBOX_CONFIG', {
  factory: () => ({
    checked: false,
    disabled: false,
    required: false,
    indeterminate: false,
    size: 'medium',
    labelPosition: 'right',
    label: ''
  })
});

/**
 * Token d'injection pour les styles personnalisés
 */
export const CHECKBOX_STYLES = new InjectionToken<Record<string, string>[]>('CHECKBOX_STYLES', {
  factory: () => []
});

/**
 * Compteur global pour générer des IDs uniques
 */
let checkboxIdCounter = 0;

@Component({
  selector: 'psh-checkbox',
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.checkbox-disabled]': 'disabled()',
    '[class.checkbox-error]': '!!error()',
    '[class.checkbox-success]': '!!success()',
    '[class.checkbox-small]': 'size() === "small"',
    '[class.checkbox-large]': 'size() === "large"',
    '[attr.data-state]': 'state()'
  }
})
export class PshCheckboxComponent {
  private config = inject(CHECKBOX_CONFIG);
  private styles = inject(CHECKBOX_STYLES, { optional: true }) ?? [];
  private uniqueId = `checkbox-${++checkboxIdCounter}`;

  // Model inputs with defaults from config
  checked = model(this.config.checked ?? false);
  disabled = model(this.config.disabled ?? false);
  required = model(this.config.required ?? false);
  indeterminate = model(this.config.indeterminate ?? false);

  // Regular inputs
  label = input(this.config.label ?? '');
  error = input('');
  success = input('');
  ariaLabel = input<string>();
  size = input<CheckboxSize>(this.config.size ?? 'medium');
  labelPosition = input<'left' | 'right'>(this.config.labelPosition ?? 'right');

  // Content projection tracking
  private checkboxText = contentChild<any>('.checkbox-text');
  protected hasProjectedContent = signal(false);

  // Computed values
  ariaChecked = computed<'true' | 'false' | 'mixed'>(() =>
    this.indeterminate() ? 'mixed' : (this.checked() ? 'true' : 'false')
  );

  computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();
    if (customLabel) return customLabel;

    const labelText = this.label();
    if (labelText) return labelText;

    return this.hasProjectedContent() ? undefined : 'Checkbox';
  });

  errorMessageId = computed(() => this.error() ? `${this.uniqueId}-error` : undefined);
  successMessageId = computed(() => this.success() ? `${this.uniqueId}-success` : undefined);

  ariaDescribedBy = computed(() => {
    const ids: string[] = [];
    if (this.errorMessageId()) ids.push(this.errorMessageId()!);
    if (this.successMessageId()) ids.push(this.successMessageId()!);
    return ids.length > 0 ? ids.join(' ') : undefined;
  });

  customStyles = computed(() => Object.assign({}, ...this.styles));

  state = computed(() => this.getState());

  constructor() {
    effect(() => {
      if (!this.label() && !this.ariaLabel() && !this.hasProjectedContent()) {
        console.warn(
          '[psh-checkbox] No accessible label provided. Please use label input, ariaLabel input, or projected content.'
        );
      }
    }, { allowSignalWrites: false });
  }

  private getState(): string {
    if (this.disabled()) return 'disabled';
    if (this.indeterminate()) return 'indeterminate';
    if (this.error()) return 'error';
    if (this.success()) return 'success';
    return this.checked() ? 'checked' : 'unchecked';
  }

  updateProjectedContent(hasContent: boolean): void {
    this.hasProjectedContent.set(hasContent);
  }

  protected toggle(): void {
    if (!this.disabled()) {
      this.checked.update(v => !v);
      this.indeterminate.set(false);
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.toggle();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }

}