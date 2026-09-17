import { PshSurfaceAppearance } from '../../types/semantic.types';
import { pshResolveConfigValue } from '../../utils/config-value';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  isDevMode,
  model,
  output,
  inject,
} from '@angular/core';
import { CollapseVariant, CollapseSize } from './collapse.types';
import { pshUniqueId } from '../../utils/unique-id';
import { COLLAPSE_CONFIG } from './collapse.tokens';

@Component({
  selector: 'psh-collapse',
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshCollapseComponent {
  private readonly config = inject(COLLAPSE_CONFIG);


  readonly expanded = model(false);

  readonly disabled = input(false);
  readonly appearance = input(this.config.appearance ?? ('flat' as PshSurfaceAppearance), {
    transform: (value: CollapseVariant) => {
      if (!['flat', 'outline'].includes(value)) {
        if (isDevMode()) {
          console.warn(`[psh-collapse] Invalid variant "${value}", falling back to "flat"`);
        }
        return 'flat';
      }
      return value;
    }
  });
  readonly size = input(this.config.size ?? ('medium' as CollapseSize), {
    transform: (value: CollapseSize) => {
      if (!['small', 'medium', 'large'].includes(value)) {
        if (isDevMode()) {
          console.warn(`[psh-collapse] Invalid size "${value}", falling back to "medium"`);
        }
        return 'medium';
      }
      return value;
    }
  });
  readonly icon = input(this.config.icon ?? 'caret-down');
  readonly id = input<string>();
  /**
   * Maximum height of the open content. `'auto'` — the default — does not clip.
   *
   * It used to default to a magic `'1000px'`, which **silently truncated** anything taller
   * with no warning and no way to opt out. A fixed length still works, and is what gives the
   * open/close a height animation; `auto` animates opacity and offset only.
   */
  readonly maxHeight = input<string>(this.config.maxHeight ?? 'auto');

  /**
   * Fallback header text, used when nothing is projected into `[psh-collapse-header]`.
   * Was a literal in the template, so a non-French application could not change it.
   */
  readonly defaultHeaderTextInput = input<string | undefined>(undefined, { alias: 'defaultHeaderText' });
  readonly defaultHeaderText = computed(
    () => this.defaultHeaderTextInput() ?? pshResolveConfigValue(this.config.defaultHeaderText) ?? 'Collapsible section',
  );

  /** `auto` is not a usable `max-height` for the CSS; `none` is the same intent. */
  protected readonly resolvedMaxHeight = computed(() =>
    this.maxHeight() === 'auto' ? 'none' : this.maxHeight(),
  );
  readonly disableAnimation = input(this.config.disableAnimation ?? false);

  opened = output<void>();
  closed = output<void>();
  toggled = output<boolean>();

  private readonly uniqueId = pshUniqueId('collapse');

  protected readonly headerId = computed(() => {
    const customId = this.id();
    return customId ? `${customId}-header` : `${this.uniqueId}-header`;
  });

  protected readonly contentId = computed(() => {
    const customId = this.id();
    return customId ? `${customId}-content` : `${this.uniqueId}-content`;
  });

  readonly state = computed(() => {
    if (this.disabled()) return 'disabled';
    return this.expanded() ? 'expanded' : 'collapsed';
  });

  readonly animationClass = computed(() => {
    return this.disableAnimation() ? 'no-animation' : '';
  });

  toggle(): void {
    if (!this.disabled()) {
      this.expanded.update(value => {
        const newValue = !value;
        this.toggled.emit(newValue);
        return newValue;
      });
    }
  }

  open(): void {
    if (!this.disabled() && !this.expanded()) {
      this.expanded.set(true);
      this.opened.emit();
    }
  }

  close(): void {
    if (!this.disabled() && this.expanded()) {
      this.expanded.set(false);
      this.closed.emit();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle();
        break;
      case 'Escape':
        if (this.expanded()) {
          event.preventDefault();
          this.close();
        }
        break;
    }
  }
}