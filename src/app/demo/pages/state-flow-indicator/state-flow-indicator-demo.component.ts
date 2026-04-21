import { Component, ChangeDetectionStrategy, signal, viewChild } from '@angular/core';
import { PshStateFlowIndicatorComponent, PshFlowStepComponent, PshButtonComponent } from '@lib/components';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-state-flow-indicator-demo',
  imports: [
    PshStateFlowIndicatorComponent,
    PshFlowStepComponent,
    PshButtonComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent
  ],
  templateUrl: './state-flow-indicator-demo.component.html',
  styleUrls: ['./state-flow-indicator-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateFlowIndicatorDemoComponent {
  basicRef = viewChild<PshStateFlowIndicatorComponent>('basicIndicator');
  statesRef = viewChild<PshStateFlowIndicatorComponent>('statesIndicator');

  basicActiveStep = signal(0);
  basicStep1Completed = signal(false);
  basicStep2Completed = signal(false);
  basicStep3Completed = signal(false);

  statesActiveStep = signal(1);
  statesStep1Completed = signal(true);
  statesStep2Warning = signal<string | undefined>('Champs optionnels manquants');
  statesStep3Error = signal<string | undefined>(undefined);
  statesStep3Completed = signal(false);
  statesStep4Loading = signal(false);

  sizeActiveStep = signal(1);
  sizeStep1Completed = signal(true);

  navigationErrorMessage = signal('');

  handleBasicStepChange(step: number): void {
    this.basicActiveStep.set(step);
  }

  completeCurrentAndNext(): void {
    const current = this.basicActiveStep();
    if (current === 0) this.basicStep1Completed.set(true);
    if (current === 1) this.basicStep2Completed.set(true);
    if (current === 2) this.basicStep3Completed.set(true);

    const ref = this.basicRef();
    if (ref && current < 3) {
      ref.next();
    }
  }

  goToPreviousBasic(): void {
    const ref = this.basicRef();
    if (ref) {
      ref.previous();
    }
  }

  resetBasic(): void {
    const ref = this.basicRef();
    if (ref) {
      ref.reset();
    }
    this.basicStep1Completed.set(false);
    this.basicStep2Completed.set(false);
    this.basicStep3Completed.set(false);
  }

  toggleWarning(): void {
    this.statesStep2Warning.update(v => v ? undefined : 'Champs optionnels manquants');
  }

  toggleError(): void {
    this.statesStep3Error.update(v => v ? undefined : 'Validation échouée');
  }

  async simulateLoading(): Promise<void> {
    if (this.statesStep4Loading()) return;
    this.statesStep4Loading.set(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.statesStep4Loading.set(false);
  }

  handleNavigationError(error: string): void {
    this.navigationErrorMessage.set(error);
    setTimeout(() => this.navigationErrorMessage.set(''), 4000);
  }

  dismissError(): void {
    this.navigationErrorMessage.set('');
  }

  basicCode = `<psh-state-flow-indicator
  [(activeStep)]="activeStep"
  [linear]="true"
  (stepChange)="onStepChange($event)"
>
  <psh-flow-step title="Panier" [completed]="step1Done" />
  <psh-flow-step title="Facturation" [completed]="step2Done" />
  <psh-flow-step title="Livraison" />
  <psh-flow-step title="Paiement" />
</psh-state-flow-indicator>`;

  statesCode = `<psh-flow-step
  title="Facturation"
  [completed]="true"
/>

<psh-flow-step
  title="Livraison"
  [warning]="'Champs manquants'"
/>

<psh-flow-step
  title="Validation"
  [error]="'Erreur de validation'"
/>

<psh-flow-step
  title="Paiement"
  [loading]="true"
/>`;

  sizesCode = `<psh-state-flow-indicator size="small">
  ...
</psh-state-flow-indicator>

<psh-state-flow-indicator size="medium">
  ...
</psh-state-flow-indicator>

<psh-state-flow-indicator size="large">
  ...
</psh-state-flow-indicator>`;
}
