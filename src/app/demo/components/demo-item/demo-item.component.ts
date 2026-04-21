import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-demo-item',
  imports: [],
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