import { Component, signal, computed, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavigationItem, NavigationSection } from '../types';

interface SearchResult {
  section: string;
  item: NavigationItem;
  sectionTranslated: string;
}

@Component({
  selector: 'ds-search',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchQuery = signal<string>('');
  selectedIndex = signal<number>(-1);
  isActive = signal<boolean>(false);

  navigationSections = signal<NavigationSection[]>([]);

  navigationClick = output<string>();

  filteredResults = computed<SearchResult[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) {
      return [];
    }

    const results: SearchResult[] = [];
    const sections = this.navigationSections();
    const normalizedQuery = this.normalizeString(query);

    sections.forEach(section => {
      const sectionTranslated = this.translateService.instant(section.title);

      section.items.forEach(item => {
        const labelTranslated = this.translateService.instant(item.label);
        const normalizedLabel = this.normalizeString(labelTranslated);
        const normalizedPath = this.normalizeString(item.path);

        const matchesLabel = normalizedLabel.includes(normalizedQuery);
        const matchesPath = normalizedPath.includes(normalizedQuery);
        const matchesKeyword = item.keywords?.some(keyword =>
          this.normalizeString(keyword).includes(normalizedQuery)
        ) ?? false;

        if (matchesLabel || matchesPath || matchesKeyword) {
          results.push({
            section: section.title,
            item,
            sectionTranslated
          });
        }
      });
    });

    return results;
  });

  hasResults = computed(() => this.filteredResults().length > 0);
  showNoResults = computed(() => this.searchQuery().trim() !== '' && !this.hasResults());

  constructor(private translateService: TranslateService) {
    effect(() => {
      if (this.filteredResults().length > 0 && this.selectedIndex() >= this.filteredResults().length) {
        this.selectedIndex.set(0);
      }
    });
  }

  setNavigationSections(sections: NavigationSection[]): void {
    this.navigationSections.set(sections);
  }

  normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.selectedIndex.set(-1);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.selectedIndex.set(-1);
  }

  selectResult(path: string): void {
    this.navigationClick.emit(path);
    this.clearSearch();
  }

  handleKeyDown(event: KeyboardEvent): void {
    const results = this.filteredResults();

    if (results.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.update(index =>
          index < results.length - 1 ? index + 1 : index
        );
        this.scrollToSelected();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.update(index =>
          index > 0 ? index - 1 : -1
        );
        this.scrollToSelected();
        break;

      case 'Enter':
        event.preventDefault();
        const index = this.selectedIndex();
        if (index >= 0 && index < results.length) {
          const result = results[index];
          if (result) {
            this.selectResult(result.item.path);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.clearSearch();
        break;
    }
  }

  scrollToSelected(): void {
    setTimeout(() => {
      const selectedElement = document.querySelector('.search-result.selected');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  focus(): void {
    setTimeout(() => {
      const input = document.querySelector('.search-input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    });
  }
}
