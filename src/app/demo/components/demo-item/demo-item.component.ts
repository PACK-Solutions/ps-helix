import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Composant d'élément de démonstration
 * 
 * Composant utilitaire pour structurer chaque section de démonstration
 * avec une zone d'exemple et une zone de documentation
 */
@Component({
  selector: 'ds-demo-item',
  imports: [CommonModule],
  template: `
    <div class="demo-item">
      <!-- Zone d'exemple/showcase -->
      <div class="demo-showcase">
        <ng-content select="[demo-showcase]"></ng-content>
      </div>
      
      <!-- Zone de documentation -->
      <div class="demo-doc">
        <ng-content select="[demo-doc]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./demo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoItemComponent {}