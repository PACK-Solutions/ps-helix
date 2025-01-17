import { Injectable, signal, computed } from '@angular/core';
import { SelectOption } from '../../types/select.types';

@Injectable()
export class SelectStateService {
  private isOpenSignal = signal(false);
  private searchTermSignal = signal('');
  private optionsSignal = signal<SelectOption[]>([]);

  isOpen = computed(() => this.isOpenSignal());
  searchTerm = computed(() => this.searchTermSignal());
  
  filteredOptions = computed(() => {
    const options = this.optionsSignal();
    const term = this.searchTerm().toLowerCase();
    if (!term) return options;
    
    return options.filter(option => 
      option.label.toLowerCase().includes(term)
    );
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
}