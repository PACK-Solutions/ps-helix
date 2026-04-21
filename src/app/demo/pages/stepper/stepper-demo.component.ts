import { Component, ChangeDetectionStrategy, signal, viewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PshStepperComponent, PshStepComponent, PshButtonComponent } from '@lib/components';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-stepper-demo',
  standalone: true,
  imports: [
    PshStepperComponent,
    PshStepComponent,
    PshButtonComponent,
    DemoPageLayoutComponent,
    ReactiveFormsModule,
    CodeSnippetComponent
  ],
  templateUrl: './stepper-demo.component.html',
  styleUrls: ['./stepper-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperDemoComponent {
  basicStepperRef = viewChild<PshStepperComponent>('basicStepper');
  formStepperRef = viewChild<PshStepperComponent>('formStepper');
  progressStepperRef = viewChild<PshStepperComponent>('progressStepper');

  activeStep = signal(0);
  formActiveStep = signal(0);
  progressActiveStep = signal(0);
  isProgressLoading = signal(false);
  progressStep1Completed = signal(false);
  progressStep2Completed = signal(false);
  step1Form: FormGroup;
  step2Form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.step1Form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.step2Form = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  nextStep(): void {
    const stepper = this.basicStepperRef();
    if (stepper) {
      stepper.next();
    }
  }

  previousStep(): void {
    const stepper = this.basicStepperRef();
    if (stepper) {
      stepper.previous();
    }
  }

  formNextStep(): void {
    const stepper = this.formStepperRef();
    if (stepper) {
      stepper.next();
    }
  }

  formPreviousStep(): void {
    const stepper = this.formStepperRef();
    if (stepper) {
      stepper.previous();
    }
  }

  completeProcess(): void {
    console.log('Process completed successfully!');
  }

  handleStepChange(step: number): void {
    console.log('Navigated to step:', step);
  }

  handleComplete(): void {
    console.log('All steps completed!');
  }

  isStep1Valid(): boolean {
    return this.step1Form.valid;
  }

  isStep2Valid(): boolean {
    return this.step2Form.valid;
  }

  async validateStepChange(from: number, to: number): Promise<boolean> {
    if (from === 0 && !this.step1Form.valid) {
      console.log('Cannot proceed: Step 1 form is invalid');
      this.step1Form.markAllAsTouched();
      return false;
    }
    if (from === 1 && !this.step2Form.valid) {
      console.log('Cannot proceed: Step 2 form is invalid');
      this.step2Form.markAllAsTouched();
      return false;
    }
    return true;
  }

  submitForms(): void {
    if (this.step1Form.valid && this.step2Form.valid) {
      console.log('Form submission:', {
        step1: this.step1Form.value,
        step2: this.step2Form.value
      });
      alert('Formulaires soumis avec succès!');
    }
  }

  basicStepperCode = `<psh-stepper
  [(activeStep)]="activeStep"
  (stepChange)="handleStepChange($event)"
>
  <psh-step title="Étape 1" icon="user">
    Contenu étape 1
  </psh-step>
  <psh-step title="Étape 2" icon="gear">
    Contenu étape 2
  </psh-step>
</psh-stepper>`;

  validationStepperCode = `<psh-stepper
  [linear]="true"
  [beforeStepChange]="validate"
>
  <psh-step
    title="Formulaire"
    [completed]="form.valid"
    [error]="errorMessage"
  >
    <form [formGroup]="form">
      <!-- Champs -->
    </form>
  </psh-step>
</psh-stepper>`;

  async simulateProgressLoading(): Promise<void> {
    if (this.isProgressLoading()) return;

    const currentStep = this.progressActiveStep();
    if (currentStep >= 2) return;

    this.isProgressLoading.set(true);

    await new Promise(resolve => setTimeout(resolve, 2500));

    if (currentStep === 0) {
      this.progressStep1Completed.set(true);
    } else if (currentStep === 1) {
      this.progressStep2Completed.set(true);
    }

    const stepper = this.progressStepperRef();
    if (stepper) {
      await stepper.next();
    }

    this.isProgressLoading.set(false);
  }
}
