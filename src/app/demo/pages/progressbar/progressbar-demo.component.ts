import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshProgressbarComponent } from '@lib/components/progressbar/progressbar.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-progressbar-demo',
  imports: [TranslateModule, PshProgressbarComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './progressbar-demo.component.html',
  styleUrls: ['./progressbar-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressbarDemoComponent {
  uploadProgress = 35;
  processingProgress = 75;
  installProgress = 60;

  primaryVariantCode = `<psh-progressbar
  [value]="30"
  color="primary"
></psh-progressbar>`;

  secondaryVariantCode = `<psh-progressbar
  [value]="40"
  color="secondary"
></psh-progressbar>`;

  successVariantCode = `<psh-progressbar
  [value]="50"
  color="success"
></psh-progressbar>`;

  warningVariantCode = `<psh-progressbar
  [value]="60"
  color="warning"
></psh-progressbar>`;

  dangerVariantCode = `<psh-progressbar
  [value]="70"
  color="danger"
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
  color="primary"
  label="Téléchargement: 45 Mo sur 120 Mo"
></psh-progressbar>`;
}