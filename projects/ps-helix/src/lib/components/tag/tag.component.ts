import { ChangeDetectionStrategy, Component, computed, inject, input, output, InjectionToken, ElementRef, AfterContentChecked, signal } from '@angular/core';
import { TagVariant, TagSize, TagConfig } from './tag.types';

export const TAG_CONFIG = new InjectionToken<Partial<TagConfig>>('TAG_CONFIG', {
  factory: () => ({
    variant: 'primary',
    size: 'medium',
    closable: false,
    disabled: false,
    interactive: false,
    closeLabel: 'Supprimer le tag'
  })
});

@Component({
  selector: 'psh-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PshTagComponent implements AfterContentChecked {
  private readonly config = inject(TAG_CONFIG);
  private readonly elementRef = inject(ElementRef);
  private readonly projectedText = signal('');

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
    if (contentText && contentText !== 'Tag') return contentText;

    const projected = this.projectedText();
    if (projected) return projected;

    return 'Tag';
  });

  ngAfterContentChecked(): void {
    const contentElement = this.elementRef.nativeElement.querySelector('.tag-content');
    if (contentElement) {
      const text = (contentElement.textContent || '').trim();
      if (text !== this.projectedText()) {
        this.projectedText.set(text);
      }
    }
  }

  readonly computedRole = computed(() =>
    this.interactive() ? 'button' : 'status'
  );

  readonly computedTabIndex = computed(() =>
    this.interactive() && !this.disabled() ? 0 : -1
  );

  readonly state = computed(() => this.disabled() ? 'disabled' : 'default');

  handleClick(event: MouseEvent): void {
    if (!this.disabled() && this.interactive()) {
      this.clicked.emit(event);
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.disabled() || !this.interactive()) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.clicked.emit(event as unknown as MouseEvent);
    }
  }

  handleClose(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled()) {
      this.closed.emit();
    }
  }
}