import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { CollapseVariant, CollapseSize } from './collapse.types';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'psh-collapse',
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshCollapseComponent {
  private readonly document = inject(DOCUMENT);
  private static idCounter = 0;

  expanded = model(false);

  disabled = input(false);
  variant = input('default' as CollapseVariant, {
    transform: (value: CollapseVariant) => {
      if (!['default', 'outline'].includes(value)) {
        console.warn(`[psh-collapse] Invalid variant "${value}", falling back to "default"`);
        return 'default';
      }
      return value;
    }
  });
  size = input('medium' as CollapseSize, {
    transform: (value: CollapseSize) => {
      if (!['small', 'medium', 'large'].includes(value)) {
        console.warn(`[psh-collapse] Invalid size "${value}", falling back to "medium"`);
        return 'medium';
      }
      return value;
    }
  });
  icon = input('caret-down');
  id = input<string>();
  maxHeight = input<string>('1000px');
  disableAnimation = input(false);

  opened = output<void>();
  closed = output<void>();
  toggled = output<boolean>();

  private readonly uniqueId = `collapse-${++PshCollapseComponent.idCounter}`;

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