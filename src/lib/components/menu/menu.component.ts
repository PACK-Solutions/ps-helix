import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem, MenuVariant, MenuMode } from './menu.types';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibMenuComponent {
  @Input() items: MenuItem[] = [];
  @Input() variant: MenuVariant = 'default';
  @Input() mode: MenuMode = 'vertical';
  @Input() collapsible = false;
  @Input() collapsed = false;

  @Output() itemClick = new EventEmitter<MenuItem>();
  @Output() collapsedChange = new EventEmitter<boolean>();

  expandedItems = new Set<string>();

  toggleItem(item: MenuItem): void {
    if (item.children?.length) {
      if (this.expandedItems.has(item.id)) {
        this.expandedItems.delete(item.id);
      } else {
        this.expandedItems.add(item.id);
      }
    }
    this.itemClick.emit(item);
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItems.has(item.id);
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}