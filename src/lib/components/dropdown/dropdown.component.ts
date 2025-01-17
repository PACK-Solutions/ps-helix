import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownItem, DropdownSize, DropdownPlacement } from './dropdown.types';

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibDropdownComponent implements OnInit, OnDestroy {
  @Input() items: DropdownItem[] = [];
  @Input() label = '';
  @Input() icon?: string;
  @Input() size: DropdownSize = 'medium';
  @Input() placement: DropdownPlacement = 'bottom-start';
  @Input() disabled = false;
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'text' = 'text';

  @Output() selected = new EventEmitter<DropdownItem>();

  isOpen = false;
  private clickHandler: ((e: MouseEvent) => void) | null = null;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.removeClickHandler();
  }

  private addClickHandler(): void {
    if (!this.clickHandler) {
      this.clickHandler = (e: MouseEvent) => {
        if (this.isOpen) {
          const target = e.target as HTMLElement;
          if (!target.closest('.dropdown-container')) {
            this.close();
          }
        }
      };
      document.addEventListener('click', this.clickHandler);
    }
  }

  private removeClickHandler(): void {
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
  }

  // Méthode pour fermer le dropdown
  private close(): void {
    this.isOpen = false;
    this.removeClickHandler();
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      // Empêcher la propagation pour éviter la fermeture immédiate
      event?.stopPropagation(); 
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.addClickHandler();
      } else {
        this.removeClickHandler();
      }
    }
  }

  selectItem(item: DropdownItem): void {
    if (!item.disabled) {
      this.selected.emit(item);
      this.close();
    }
  }
}