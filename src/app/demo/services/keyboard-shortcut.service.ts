import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutService {
  private searchTriggered = signal<number>(0);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
    }
  }

  getSearchTrigger() {
    return this.searchTriggered.asReadonly();
  }

  private handleGlobalKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.searchTriggered.update(count => count + 1);
    }
  }
}
