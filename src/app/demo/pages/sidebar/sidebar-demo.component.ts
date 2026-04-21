import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PshSidebarComponent,
  PshButtonComponent,
  PshMenuComponent,
  PshInputComponent,
  PshSelectComponent,
  PshCheckboxComponent
} from '@lib/components';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { MenuItem } from '@lib/components/menu/menu.types';
import { SidebarPosition } from '@lib/components/sidebar/sidebar.types';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-sidebar-demo',
  imports: [
    CommonModule,
    PshSidebarComponent,
    PshButtonComponent,
    PshMenuComponent,
    PshInputComponent,
    PshSelectComponent,
    PshCheckboxComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent
  ],
  templateUrl: './sidebar-demo.component.html',
  styleUrls: ['./sidebar-demo.component.css']
})
export class SidebarDemoComponent {
  isFixedOpen = true;
  isOverlayOpen = false;

  fixedPosition: SidebarPosition = 'left';
  overlayPosition: SidebarPosition = 'left';

  menuItems: MenuItem[] = [
    { id: 'dashboard', content: 'Dashboard', icon: 'chart-line' },
    { id: 'users', content: 'Users', icon: 'users' },
    { id: 'settings', content: 'Settings', icon: 'gear' },
    { id: 'reports', content: 'Reports', icon: 'file-text' },
    { id: 'notifications', content: 'Notifications', icon: 'bell', badge: '3' }
  ];

  toggleFixed(): void {
    this.isFixedOpen = !this.isFixedOpen;
  }

  handleToggle(open: boolean, type: 'fixed' | 'overlay'): void {
    switch (type) {
      case 'fixed':
        this.isFixedOpen = open;
        break;
      case 'overlay':
        this.isOverlayOpen = open;
        break;
    }
  }

  setOverlayPosition(position: SidebarPosition): void {
    this.overlayPosition = position;
    this.isOverlayOpen = true;
  }

  onSidebarOpened(): void {
    console.log('Sidebar fully opened');
  }

  onSidebarClosed(): void {
    console.log('Sidebar fully closed');
  }

  fixedModeCode = `<psh-sidebar
  mode="fixed"
  position="left"
  width="250px"
  [(open)]="isOpen"
>
  <!-- Navigation content -->
</psh-sidebar>`;

  overlayModeCode = `<psh-sidebar
  mode="overlay"
  position="right"
  width="300px"
  [(open)]="isOpen"
>
  <!-- Filter content -->
</psh-sidebar>`;

  onTransitionStart(opening: boolean): void {
    console.log('Transition started:', opening ? 'opening' : 'closing');
  }
}