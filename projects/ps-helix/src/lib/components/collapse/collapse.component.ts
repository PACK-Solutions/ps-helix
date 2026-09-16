import { PshSurfaceAppearance } from '../../types/semantic.types';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  isDevMode,
  model,
  output
} from '@angular/core';
import { CollapseVariant, CollapseSize } from './collapse.types';
import { pshUniqueId } from '../../utils/unique-id';

@Component({
  selector: 'psh-collapse',
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshCollapseComponent {

  expanded = model(false);

  disabled = input(false);
  appearance = input('flat' as PshSurfaceAppearance, {
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
  size = input('medium' as CollapseSize, {
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
  icon = input('caret-down');
  id = input<string>();
  /**
   * Maximum height of the open content. `'auto'` — the default — does not clip.
   *
   * It used to default to a magic `'1000px'`, which **silently truncated** anything taller
   * with no warning and no way to opt out. A fixed length still works, and is what gives the
   * open/close a height animation; `auto` animates opacity and offset only.
   */
  maxHeight = input<string>('auto');

  /**
   * Fallback header text, used when nothing is projected into `[psh-collapse-header]`.
   * Was a literal in the template, so a non-French application could not change it.
   */
  readonly defaultHeaderText = input<string>('Section pliable');

  /** `auto` is not a usable `max-height` for the CSS; `none` is the same intent. */
  protected readonly resolvedMaxHeight = computed(() =>
    this.maxHeight() === 'auto' ? 'none' : this.maxHeight(),
  );
  disableAnimation = input(false);

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