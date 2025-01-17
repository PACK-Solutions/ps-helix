import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SpinLoaderVariant, SpinLoaderSize } from './spinloader.types';

@Component({
  selector: 'lib-spinloader',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './spinloader.component.html',
  styleUrls: ['./spinloader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibSpinLoaderComponent {
  @Input() variant: SpinLoaderVariant = 'circle';
  @Input() size: SpinLoaderSize = 'medium';
  @Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() label = '';
}