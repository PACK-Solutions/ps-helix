import { ChangeDetectionStrategy, Component, computed, inject, input, output, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagVariant, TagSize, TagConfig } from './tag.types';

export const TAG_CONFIG = new InjectionToken<Partial<TagConfig>>('TAG_CONFIG', {
  factory: () => ({
    variant: 'primary',
    size: 'medium',
    closable: false,
    disabled: false,
    interactive: false,
    closeLabel: 'Supprimer le tag',
    ariaLabels: {
      close: 'Supprimer le tag',
      disabled: 'Tag désactivé',
      status: 'État'
    }
  })
});

export const TAG_STYLES = new InjectionToken<Record<string, string>[]>('TAG_STYLES', {
  factory: () => []
});

@Component({
  selector: 'psh-tag',
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshTagComponent {
  private readonly config = inject(TAG_CONFIG);
  private readonly styles = inject(TAG_STYLES, { optional: true }) ?? [];

  readonly variant = input<TagVariant>(this.config.variant ?? 'primary');
  readonly size = input<TagSize>(this.config.size ?? 'medium');
  readonly closable = input(this.config.closable ?? false);
  readonly disabled = input(this.config.disabled ?? false);
  readonly interactive = input(this.config.interactive ?? false);
  readonly icon = input<string>();
  readonly closeLabel = input(this.config.closeLabel ?? 'Supprimer le tag');
  readonly content = input('Tag');
  readonly ariaLabel = input<string>();

  readonly clicked = output<MouseEvent>();
  readonly closed = output<void>();

  readonly computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();
    if (customLabel) return customLabel;

    const contentText = this.content();
    if (contentText) return contentText;

    return 'Tag';
  });

  readonly computedRole = computed(() =>
    this.interactive() ? 'button' : 'status'
  );

  readonly computedTabIndex = computed(() =>
    this.interactive() && !this.disabled() ? 0 : -1
  );

  readonly customStyles = computed(() => Object.assign({}, ...this.styles));

  readonly state = computed(() => this.disabled() ? 'disabled' : 'default');

  handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }

  handleClose(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled()) {
      this.closed.emit();
    }
  }
}