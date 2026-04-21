import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-demo-page-layout',
  imports: [CommonModule, TranslateModule],
  templateUrl: './demo-page-layout.component.html',
  styleUrls: ['./demo-page-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DemoPageLayoutComponent {
  /** Titre de la page de démonstration */
  title = input.required<string>();
  
  /** Texte d'introduction de la page */
  introText = input.required<string>();
  
  /** Indique si la section technique doit être affichée */
  showTechnicalSection = input(false);
  
  /** Titre personnalisé pour la section technique */
  technicalTitle = input('Documentation Technique');
}