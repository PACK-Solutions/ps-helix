import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshCollapseComponent } from '@lib/components/collapse/collapse.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-collapse-demo',
  imports: [TranslateModule, PshCollapseComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './collapse-demo.component.html',
  styleUrls: ['./collapse-demo.component.css'],
})
export class CollapseDemoComponent {
  title = 'Sections Pliables';
  introText =
    'Les sections pliables permettent aux utilisateurs de développer et réduire des sections de contenu.';

  controlledExpanded = signal(false);

  defaultVariantCode = `<psh-collapse variant="default">
  <div collapse-header>
    Titre de la section
  </div>
  Contenu de la section
</psh-collapse>`;

  outlineVariantCode = `<psh-collapse variant="outline">
  <div collapse-header>
    Titre de la section
  </div>
  Contenu de la section
</psh-collapse>`;

  customHeaderCode = `<psh-collapse>
  <div collapse-header>
    <i class="ph ph-info"></i>
    Section avec icône
  </div>
  Contenu de la section
</psh-collapse>`;

  controlledCode = `<psh-collapse [(expanded)]="isExpanded">
  <div collapse-header>
    Section contrôlée
  </div>
  Contenu contrôlé
</psh-collapse>

<button (click)="isExpanded.set(true)">
  Ouvrir
</button>`;

  noAnimationCode = `<psh-collapse [disableAnimation]="true">
  <div collapse-header>
    Collapse sans animation
  </div>
  Contenu
</psh-collapse>`;

  maxHeightCode = `<psh-collapse maxHeight="300px">
  <div collapse-header>
    Contenu avec scroll
  </div>
  Contenu très long...
</psh-collapse>`;

  customIdCode = `<psh-collapse id="terms-conditions">
  <div collapse-header>
    Conditions générales
  </div>
  Contenu
</psh-collapse>`;

  slotsCode = `<psh-collapse>
  <!-- Slot header -->
  <div collapse-header>
    <i class="ph ph-info"></i>
    Titre personnalisé avec icône
  </div>

  <!-- Slot contenu par défaut -->
  <p>Votre contenu ici...</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</psh-collapse>`;

  toggleControlled(): void {
    this.controlledExpanded.update(v => !v);
  }
}
