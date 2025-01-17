import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TabPanelComponent } from './tab-panel.component';

@Component({
  selector: 'lib-tabs',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class LibTabsComponent implements AfterContentInit, OnDestroy {
  @Input() variant: 'default' | 'underline' | 'pills' = 'default';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() activeIndex = 0;

  @Output() activeIndexChange = new EventEmitter<number>();

  @ContentChildren(TabPanelComponent) panels!: QueryList<TabPanelComponent>;
  private subscription: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit() {
    // Observer les changements dans les panels
    this.subscription = this.panels.changes.subscribe(() => {
      if (this.activeIndex >= this.panels.length) {
        this.activeIndex = Math.max(0, this.panels.length - 1);
        this.activeIndexChange.emit(this.activeIndex);
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  handleKeyDown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.selectTab(index > 0 ? index - 1 : this.panels.length - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.selectTab(index < this.panels.length - 1 ? index + 1 : 0);
        break;
      case 'Home':
        event.preventDefault();
        this.selectTab(0);
        break;
      case 'End':
        event.preventDefault();
        this.selectTab(this.panels.length - 1);
        break;
    }
  }

  selectTab(index: number): void {
    if (this.activeIndex !== index) {
      this.activeIndex = index;
      this.activeIndexChange.emit(index);
      this.cdr.markForCheck();
    }
  }
}