import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshTooltipComponent } from '@lib/components/tooltip/tooltip.component';
import { PshButtonComponent } from '@lib/components/button/button.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-tooltips-demo',
  imports: [
    TranslateModule,
    PshTooltipComponent,
    PshButtonComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent
  ],
  templateUrl: './tooltips-demo.component.html',
  styleUrls: ['./tooltips-demo.component.css']
})
export class TooltipsDemoComponent {
  demoDelays = {
    quick: { show: 0, hide: 0 },
    normal: { show: 200, hide: 100 },
    slow: { show: 500, hide: 200 }
  };

  iconTooltipCode = `<psh-tooltip content="Info">
  <i class="ph ph-info"></i>
</psh-tooltip>`;

  buttonTooltipCode = `<psh-tooltip content="Info">
  <psh-button>
    Hover me
  </psh-button>
</psh-tooltip>`;

  helpTooltipCode = `<psh-tooltip
  content="Help text"
  (shown)="onShow()"
  (hidden)="onHide()"
>
  <psh-button icon="question" />
</psh-tooltip>`;

  topPositionCode = `<psh-tooltip
  content="Tooltip text"
  position="top"
>
  <psh-button>Top</psh-button>
</psh-tooltip>`;

  rightPositionCode = `<psh-tooltip
  content="Tooltip text"
  position="right"
>
  <psh-button>Right</psh-button>
</psh-tooltip>`;

  bottomPositionCode = `<psh-tooltip
  content="Tooltip text"
  position="bottom"
>
  <psh-button>Bottom</psh-button>
</psh-tooltip>`;

  leftPositionCode = `<psh-tooltip
  content="Tooltip text"
  position="left"
>
  <psh-button>Left</psh-button>
</psh-tooltip>`;

  darkVariantCode = `<psh-tooltip
  content="Dark tooltip"
  variant="dark"
>
  <psh-button>Button</psh-button>
</psh-tooltip>`;

  lightVariantCode = `<psh-tooltip
  content="Light tooltip"
  variant="light"
>
  <psh-button>Button</psh-button>
</psh-tooltip>`;

  instantTimingCode = `<psh-tooltip
  content="Quick tooltip"
  [showDelay]="0"
  [hideDelay]="0"
>
  <psh-button>Instant</psh-button>
</psh-tooltip>`;

  normalTimingCode = `<psh-tooltip
  content="Normal tooltip"
  [showDelay]="200"
  [hideDelay]="100"
>
  <psh-button>Normal</psh-button>
</psh-tooltip>`;

  delayedTimingCode = `<psh-tooltip
  content="Slow tooltip"
  [showDelay]="500"
  [hideDelay]="200"
>
  <psh-button>Delayed</psh-button>
</psh-tooltip>`;

  autoFlipCode = `<psh-tooltip
  content="Auto-flip enabled"
  position="top"
  [autoFlip]="true"
>
  <psh-button>Auto-flip</psh-button>
</psh-tooltip>`;

  noAutoFlipCode = `<psh-tooltip
  content="Fixed position"
  position="top"
  [autoFlip]="false"
>
  <psh-button>No auto-flip</psh-button>
</psh-tooltip>`;

  handleTooltipShown(): void {
    console.log('Tooltip shown');
  }

  handleTooltipHidden(): void {
    console.log('Tooltip hidden');
  }
}
