import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  isDevMode,
  model,
  output,
  signal,
  viewChild
} from '@angular/core';
import { RadioSize, RadioConfig } from './radio.types';
import { InjectionToken } from '@angular/core';
import { PSH_RADIO_GROUP } from './radio-group.token';
import { pshUniqueId } from '../../utils/unique-id';
import { pshJoinAriaIds } from '../../utils/aria';

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
 * One radio button.
 *
 * Inside a `psh-radio-group` it is presentational: the group owns the value and the radio
 * asks whether its own `value` is the selected one. On its own it still works as a standalone
 * two-way control through `[(checked)]`.
 *
 * That split is what let it become full-signal. It used to mix `@Input` setters and
 * `EventEmitter` with `output()` in one class, on the stated grounds that *« model() would
 * auto-emit checkedChange on .set() »* — which is not what `model()` does: a parent writing
 * the input does not emit, only the component writing it does. The real problem was that a
 * lone radio had no owner for its value. The group is that owner.
 *
 * Its arrow-key handlers used to be two empty methods commented *« Implementation requires
 * radio group context »*. They live on the group now, where that context exists.
 */
@Component({
  selector: 'psh-radio',
  imports: [],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.psh-radio-disabled]': 'isDisabled()',
    '[class.psh-radio-error]': '!!error()',
    '[class.psh-radio-success]': '!!success()',
    '[class.psh-radio-small]': 'effectiveSize() === "small"',
    '[class.psh-radio-large]': 'effectiveSize() === "large"',
    '[attr.data-state]': 'state()'
  }
})
export class PshRadioComponent<T = unknown> implements AfterViewInit {
  private config = inject(RADIO_CONFIG);
  private styles = inject(RADIO_STYLES, { optional: true }) ?? [];
  private uniqueId = pshUniqueId('radio');
  /** Holds the `label` input or the projected content — whichever provides the visible label. */
  private labelSlot = viewChild<ElementRef<HTMLElement>>('labelSlot');
  private radioInput = viewChild<ElementRef<HTMLInputElement>>('radioInput');

  /**
   * The group this radio belongs to, if any. Injected through a token rather than the
   * component class: the group reads its radios with `contentChildren`, so importing the
   * class in both directions would be a cycle.
   */
  private readonly group = inject(PSH_RADIO_GROUP, { optional: true });

  /** Standalone selection state. Inside a group, {@link isChecked} is what matters. */
  readonly checked = model(this.config.checked ?? false);
  readonly disabled = model(this.config.disabled ?? false);

  required = input(this.config.required ?? false);

  // Regular inputs
  label = input('');
  error = input<string | null | undefined>(null);
  success = input<string | null | undefined>(null);
  /** Guidance shown when there is neither an error nor a success message. */
  hint = input<string | null | undefined>(null);

  /**
   * Extra ids for `aria-describedby`. **Merged** with the control's own — the id of its error,
   * success or hint message — never replacing them.
   */
  readonly ariaDescribedBy = input<string>();

  /**
   * Ids of the elements that name this control, for the cases a visible `<label>` cannot
   * cover. Merged with anything the control already points at.
   */
  readonly ariaLabelledBy = input<string>();
  name = input('');
  value = input<T | undefined>(undefined);
  ariaLabel = input<string>();
  size = input<RadioSize>(this.config.size ?? 'medium');
  labelPosition = input<'left' | 'right'>(this.config.labelPosition ?? 'right');

  // Content projection tracking
  protected hasProjectedContent = signal(false);

  readonly valueChange = output<T | undefined>();

  /** Whether this radio is the selected one — decided by the group when there is one. */
  readonly isChecked = computed(() =>
    this.group ? this.group.value() === this.value() : this.checked(),
  );

  /** Disabled by itself, or by the whole group. */
  readonly isDisabled = computed(() => this.disabled() || (this.group?.disabled() ?? false));

  /** The group's `name` wins: a native radio set is defined by sharing one. */
  protected readonly effectiveName = computed(() => this.group?.name() ?? this.name());

  /** Radios in one set should be one size, so the group's wins when there is a group. */
  protected readonly effectiveSize = computed(() => this.group?.size() ?? this.size());

  protected readonly effectiveRequired = computed(
    () => this.group?.required() ?? this.required(),
  );

  /**
   * Roving tabindex: one Tab stop per group rather than one per radio, which is what makes a
   * radio set a single stop with arrow keys inside it. The selected radio is the stop; when
   * nothing is selected yet, the first enabled one is.
   */
  protected readonly tabIndex = computed(() => {
    if (this.isDisabled()) return -1;
    if (!this.group) return 0;
    if (this.isChecked()) return 0;
    return this.group.value() == null && this.isFirstEnabled() ? 0 : -1;
  });

  // Computed values
  customStyles = computed(() => Object.assign({}, ...this.styles));

  state = computed(() => this.getState());

  computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();
    if (customLabel) return customLabel;

    const labelText = this.label();
    if (labelText) return labelText;

    // No `aria-label` at all when nothing is declared: the `<label>` wrapping the input
    // already names it from a projected label. A hard-coded fallback would override that
    // visible text for screen readers (WCAG 2.5.3 "Label in Name").
    return undefined;
  });

  errorMessageId = computed(() =>
    this.error() ? `${this.uniqueId}-error` : undefined
  );

  successMessageId = computed(() =>
    this.success() ? `${this.uniqueId}-success` : undefined
  );

  hintMessageId = computed(() =>
    this.hint() ? `${this.uniqueId}-hint` : undefined
  );

  // error, success and hint are mutually exclusive in the template (@if/@else if), so
  // aria-describedby references whichever message is actually rendered — in the same order.
  describedBy = computed(() =>
    pshJoinAriaIds(
      this.errorMessageId() ?? this.successMessageId() ?? this.hintMessageId(),
      this.ariaDescribedBy(),
    ),
  );

  ngAfterViewInit(): void {
    if (!isDevMode()) return;

    // Read the rendered label slot rather than the `label` input alone: a projected
    // label (`<psh-radio>Accept terms</psh-radio>`) is just as accessible, and
    // `contentChild` cannot see a bare text node. Checked once, after the first render.
    const hasVisibleLabel = !!this.labelSlot()?.nativeElement.textContent?.trim();
    if (!hasVisibleLabel && !this.ariaLabel() && !this.hasProjectedContent()) {
      console.warn(
        '[psh-radio] No accessible label provided. Please use label input, ariaLabel input, or projected content.'
      );
    }
  }

  /** Focuses the native input. The group calls this when arrow keys move the selection. */
  focus(): void {
    this.radioInput()?.nativeElement.focus();
  }

  /**
   * Whether this is the first enabled radio of its group, which only matters for the roving
   * tabindex before anything is selected. Read from the DOM rather than from the group's
   * `contentChildren`, because asking the group here would make the two read each other's
   * signals during the same computation.
   */
  private isFirstEnabled(): boolean {
    const el = this.radioInput()?.nativeElement;
    const group = el?.closest('psh-radio-group');
    if (!el || !group) return false;
    return group.querySelector('psh-radio:not(.psh-radio-disabled) input') === el;
  }

  private getState(): string {
    if (this.isDisabled()) return 'disabled';
    if (this.error()) return 'error';
    if (this.success()) return 'success';
    return this.isChecked() ? 'checked' : 'unchecked';
  }

  /**
   * Declares whether a label is projected. No longer required — projected content is now
   * detected from the rendered label slot. Kept for backwards compatibility: calling it
   * with `true` still suppresses the dev-only accessibility warning.
   */
  updateProjectedContent(hasContent: boolean): void {
    this.hasProjectedContent.set(hasContent);
  }

  handleChange(): void {
    if (this.isDisabled()) return;

    if (this.group) {
      // The group owns the value, so it decides — including whether anything changed at all.
      this.group.select(this.value() as T);
      return;
    }

    if (!this.checked()) {
      this.checked.set(true);
      this.valueChange.emit(this.value());
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    switch (event.key) {
      case ' ':
      case 'Spacebar':
      case 'Enter':
        event.preventDefault();
        this.handleChange();
        break;
    }
    // Arrow keys are the group's business: moving between radios needs to know what the
    // other radios are. See PshRadioGroupComponent.handleKeydown.
  }
}
