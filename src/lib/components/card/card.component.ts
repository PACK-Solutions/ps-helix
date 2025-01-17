import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardVariant, CardSize } from '../../types/card.types';
import { LibButtonComponent } from '../button/button.component';

@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, LibButtonComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibCardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() size: CardSize = 'medium';
  @Input() title = '';
  @Input() description = '';
  @Input() imageUrl?: string;
  @Input() imageAlt = '';
  @Input() buttonText = '';
  @Input() buttonIcon?: string;
  @Input() buttonVariant: 'primary' | 'secondary' | 'outline' = 'primary';
}