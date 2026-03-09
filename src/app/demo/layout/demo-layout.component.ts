import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DemoNavigationComponent } from '../components/demo-navigation/demo-navigation.component';
import { PshButtonComponent } from '@lib/components';

@Component({
  selector: 'ds-demo-layout',
  imports: [RouterModule, TranslateModule, DemoNavigationComponent, PshButtonComponent],
  templateUrl: './demo-layout.component.html',
  styleUrls: ['./demo-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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