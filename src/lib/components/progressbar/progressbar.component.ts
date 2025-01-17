import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressbarVariant, ProgressbarSize } from './progressbar.types';

@Component({
  selector: 'lib-progressbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibProgressbarComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() variant: ProgressbarVariant = 'primary';
  @Input() size: ProgressbarSize = 'medium';
  @Input() showLabel = true;
  @Input() indeterminate = false;
  @Input() striped = false;
  @Input() animated = false;

  get percentage(): number {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }
}