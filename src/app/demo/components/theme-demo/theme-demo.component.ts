import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@lib/services/theme/theme.service';

@Component({
  selector: 'ds-theme-demo',
  imports: [CommonModule],
  template: `
    <div class="theme-info">
      <p>Current theme: {{ themeService.themeName() }}</p>
      <p>Is dark mode: {{ themeService.isDarkTheme() }}</p>
      <p>Last changed: {{ themeService.themeInfo().lastChange | date:'medium' }}</p>
      
      <button (click)="themeService.toggleTheme()">Toggle Theme</button>
    </div>
  `
})
export class ThemeDemoComponent {
  constructor(public themeService: ThemeService) {}
}