import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DemoNavigationComponent } from '../components/demo-navigation/demo-navigation.component';
import { PshButtonComponent } from '@lib/components';
import { signal } from '@angular/core';

@Component({
  selector: 'ds-demo-layout',
  imports: [RouterModule, TranslateModule, CommonModule, DemoNavigationComponent, PshButtonComponent],
  templateUrl: './demo-layout.component.html',
  styleUrls: ['./demo-layout.component.css'],
})
export class DemoLayoutComponent {
  protected isMobileSidebarOpen = signal(false);

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update(current => !current);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }
}