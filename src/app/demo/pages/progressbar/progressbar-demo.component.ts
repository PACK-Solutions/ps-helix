import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshProgressbarComponent } from '@lib/components/progressbar/progressbar.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-progressbar-demo',
  imports: [TranslateModule, PshProgressbarComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './progressbar-demo.component.html',
  styleUrls: ['./progressbar-demo.component.css']
})
export class ProgressbarDemoComponent {
  uploadProgress = 35;
  processingProgress = 75;
  installProgress = 60;

  primaryVariantCode = `<psh-progressbar
  [value]="30"
  variant="primary"
></psh-progressbar>`;

  secondaryVariantCode = `<psh-progressbar
  [value]="40"
  variant="secondary"
></psh-progressbar>`;

  successVariantCode = `<psh-progressbar
  [value]="50"
  variant="success"
></psh-progressbar>`;

  warningVariantCode = `<psh-progressbar
  [value]="60"
  variant="warning"
></psh-progressbar>`;

  dangerVariantCode = `<psh-progressbar
  [value]="70"
  variant="danger"
></psh-progressbar>`;

  defaultModeCode = `<psh-progressbar
  [value]="50"
  mode="default"
></psh-progressbar>`;

  stripedModeCode = `<psh-progressbar
  [value]="60"
  mode="striped"
></psh-progressbar>`;

  animatedModeCode = `<psh-progressbar
  [value]="70"
  mode="animated"
></psh-progressbar>`;

  indeterminateModeCode = `<psh-progressbar
  mode="indeterminate"
  label="Chargement..."
></psh-progressbar>`;

  customLabelCode = `<psh-progressbar
  [value]="45"
  variant="primary"
  label="Téléchargement: 45 Mo sur 120 Mo"
></psh-progressbar>`;
}