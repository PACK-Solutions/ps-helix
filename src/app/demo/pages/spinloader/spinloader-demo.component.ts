import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshSpinLoaderComponent } from '@lib/components/spinloader/spinloader.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-spinloader-demo',
  imports: [TranslateModule, PshSpinLoaderComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './spinloader-demo.component.html',
  styleUrls: ['./spinloader-demo.component.css']
})
export class SpinLoaderDemoComponent {
  circleVariantCode = `<psh-spinloader
  variant="circle"
  color="primary"
  size="medium"
></psh-spinloader>`;

  dotsVariantCode = `<psh-spinloader
  variant="dots"
  color="primary"
  size="medium"
></psh-spinloader>`;

  pulseVariantCode = `<psh-spinloader
  variant="pulse"
  color="primary"
  size="medium"
></psh-spinloader>`;

  combination1Code = `<psh-spinloader
  variant="dots"
  color="success"
  size="large"
></psh-spinloader>`;

  combination2Code = `<psh-spinloader
  variant="pulse"
  color="warning"
  size="medium"
></psh-spinloader>`;

  combination3Code = `<psh-spinloader
  variant="circle"
  color="secondary"
  size="small"
></psh-spinloader>`;
}