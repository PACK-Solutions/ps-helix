import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  Output,
  output,
  signal
} from '@angular/core';
import { RadioSize, RadioConfig } from './radio.types';
import { InjectionToken } from '@angular/core';

export const RADIO_CONFIG = new InjectionToken<Partial<RadioConfig>>('RADIO_CONFIG', {
  factory: () => ({
    checked: false,
    disabled: false,
    required: false,
    size: 'medium',
    labelPosition: 'right'
  })
});

export const RADIO_STYLES = new InjectionToken<Record<string, string>[]>('RADIO_STYLES', {
  factory: () => []
});

/**
 * Compteur global pour générer des IDs uniques
 */
let radioIdCounter = 0;

@Component({
  selector: 'psh-radio',
  imports: [],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.radio-disabled]': 'disabled()',
    '[class.radio-error]': '!!error()',
    '[class.radio-success]': '!!success()',
    '[class.radio-small]': 'size() === "small"',
    '[class.radio-large]': 'size() === "large"',
    '[attr.data-state]': 'state()'
  }
})
export class PshRadioComponent {
  private config = inject(RADIO_CONFIG);
  private styles = inject(RADIO_STYLES, { optional: true }) ?? [];
  private uniqueId = `radio-${++radioIdCounter}`;

  // Plain signals + manual @Input/@Output to prevent auto-emission
  // when parent sets [checked] or [disabled] via template binding.
  // model() would auto-emit checkedChange/disabledChange on .set().
  checked = signal(this.config.checked ?? false);
  @Input('checked') set checkedInput(v: boolean) { this.checked.set(v); }

  disabled = signal(this.config.disabled ?? false);
  @Input('disabled') set disabledInput(v: boolean) { this.disabled.set(v); }

  required = input(this.config.required ?? false);

  // Regular inputs
  label = input('');
  error = input('');
  success = input('');
  name = input('');
  value = input<any>();
  ariaLabel = input<string>();
  size = input<RadioSize>(this.config.size ?? 'medium');
  labelPosition = input<'left' | 'right'>(this.config.labelPosition ?? 'right');

  // Content projection tracking
  private radioText = contentChild<any>('.radio-text');
  protected hasProjectedContent = signal(false);

  // Outputs — checkedChange/disabledChange use EventEmitter to decouple from signal writes.
  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() disabledChange = new EventEmitter<boolean>();
  valueChange = output<any>();

  // Computed values
  customStyles = computed(() => Object.assign({}, ...this.styles));

  state = computed(() => this.getState());

  computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();
    if (customLabel) return customLabel;

    const labelText = this.label();
    if (labelText) return labelText;

    return this.hasProjectedContent() ? undefined : 'Radio';
  });

  errorMessageId = computed(() =>
    this.error() ? `${this.uniqueId}-error` : undefined
  );

  successMessageId = computed(() =>
    this.success() ? `${this.uniqueId}-success` : undefined
  );

  ariaDescribedBy = computed(() => {
    const ids: string[] = [];
    if (this.errorMessageId()) ids.push(this.errorMessageId()!);
    if (this.successMessageId()) ids.push(this.successMessageId()!);
    return ids.length > 0 ? ids.join(' ') : undefined;
  });

  constructor() {
    effect(() => {
      if (!this.label() && !this.ariaLabel() && !this.hasProjectedContent()) {
        console.warn(
          '[psh-radio] No accessible label provided. Please use label input, ariaLabel input, or projected content.'
        );
      }
    }, { allowSignalWrites: false });
  }

  private getState(): string {
    if (this.disabled()) return 'disabled';
    if (this.error()) return 'error';
    if (this.success()) return 'success';
    return this.checked() ? 'checked' : 'unchecked';
  }

  updateProjectedContent(hasContent: boolean): void {
    this.hasProjectedContent.set(hasContent);
  }

  handleChange(): void {
    if (!this.disabled()) {
      const wasChecked = this.checked();
      this.checked.set(true);
      if (!wasChecked) {
        this.checkedChange.emit(true);
        this.valueChange.emit(this.value());
      }
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    switch(event.key) {
      case ' ':
      case 'Spacebar':
      case 'Enter':
        event.preventDefault();
        this.handleChange();
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this.focusNextRadio();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this.focusPreviousRadio();
        break;
    }
  }

  private focusNextRadio(): void {
    // Navigate to next radio in group
    // Implementation requires radio group context
  }

  private focusPreviousRadio(): void {
    // Navigate to previous radio in group
    // Implementation requires radio group context
  }
}