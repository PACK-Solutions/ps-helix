import { Component, signal } from '@angular/core';
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
  dynamicMessage = signal('Chargement des données...');
  currentStep = signal(1);
  totalSteps = signal(3);
  isSimulating = signal(false);
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

  labelStaticCode = `<psh-spinloader
  variant="circle"
  color="primary"
  label="Chargement des données..."
></psh-spinloader>`;

  labelDynamicCode = `import { Component, signal } from '@angular/core';

@Component({
  template: \`
    <psh-spinloader
      variant="circle"
      color="primary"
      [label]="dynamicMessage()"
      [ariaLabel]="dynamicMessage()"
    ></psh-spinloader>
  \`
})
export class MyComponent {
  dynamicMessage = signal('Chargement...');

  async loadData() {
    this.dynamicMessage.set('Connexion...');
    await this.connect();

    this.dynamicMessage.set('Récupération...');
    await this.fetch();
  }
}`;

  labelStepCode = `<psh-spinloader
  variant="dots"
  color="primary"
  [label]="'Étape ' + currentStep() + ' sur ' + totalSteps()"
></psh-spinloader>`;

  async simulateDynamicLoading() {
    if (this.isSimulating()) return;

    this.isSimulating.set(true);
    this.dynamicMessage.set('Connexion au serveur...');
    await this.delay(1500);

    this.dynamicMessage.set('Récupération des données...');
    await this.delay(1500);

    this.dynamicMessage.set('Traitement des données...');
    await this.delay(1500);

    this.dynamicMessage.set('Finalisation...');
    await this.delay(1000);

    this.dynamicMessage.set('Chargement des données...');
    this.isSimulating.set(false);
  }

  async simulateStepLoading() {
    if (this.isSimulating()) return;

    this.isSimulating.set(true);
    for (let i = 1; i <= this.totalSteps(); i++) {
      this.currentStep.set(i);
      await this.delay(1500);
    }
    this.currentStep.set(1);
    this.isSimulating.set(false);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}