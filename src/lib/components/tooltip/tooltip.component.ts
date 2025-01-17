import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipPosition } from './tooltip.types';

@Component({
  selector: 'lib-tooltip',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibTooltipComponent {
  @Input() content = '';
  @Input() position: TooltipPosition = 'top';
  @Input() variant: 'light' | 'dark' = 'dark';
  @Input() showDelay = 200;
  @Input() hideDelay = 100;
  @Input() maxWidth = 200;

  isVisible = false;
  private showTimeout: any;
  private hideTimeout: any;

  constructor(private elementRef: ElementRef) {}

  @HostListener('mouseenter')
  show(): void {
    clearTimeout(this.hideTimeout);
    this.showTimeout = setTimeout(() => {
      this.isVisible = true;
    }, this.showDelay);
  }

  @HostListener('mouseleave')
  hide(): void {
    clearTimeout(this.showTimeout);
    this.hideTimeout = setTimeout(() => {
      this.isVisible = false;
    }, this.hideDelay);
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.show();
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.hide();
  }
}
