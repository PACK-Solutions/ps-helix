import { Injectable, signal, computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '../../types/select.types';

@Injectable()
export class SelectState {
  private translateService = inject(TranslateService);
  private isOpenSignal = signal(false);
  private searchTermSignal = signal('');
  private selectedLabelSignal = signal('');
  private optionsSignal = signal<SelectOption[]>([]);

  readonly isOpen = computed(() => this.isOpenSignal());
  readonly searchTerm = computed(() => this.searchTermSignal());
  readonly selectedLabel = computed(() => this.selectedLabelSignal());
  readonly filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const opts = this.optionsSignal();
    
    if (!term) return opts;
    return opts.filter((opt: SelectOption) => {
      const translatedLabel = this.translateService.instant(opt.label).toLowerCase();
      return translatedLabel.includes(term);
    });
  });

  toggle(): void {
    this.isOpenSignal.update(v => !v);
  }

  close(): void {
    this.isOpenSignal.set(false);
    this.searchTermSignal.set('');
  }

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }

  setOptions(options: SelectOption[]): void {
    this.optionsSignal.set(options);
  }

  setSelectedLabel(label: string): void {
    this.selectedLabelSignal.set(label);
  }
}