import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StepComponent } from './step.component';
import { StepperOrientation, StepperVariant } from './stepper.types';

@Component({
  selector: 'lib-stepper',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibStepperComponent {
  @Input() activeStep = 0;
  @Input() orientation: StepperOrientation = 'horizontal';
  @Input() variant: StepperVariant = 'default';
  @Input() linear = true;

  @Output() stepChange = new EventEmitter<number>();
  @Output() activeStepChange = new EventEmitter<number>();
  @Output() completed = new EventEmitter<void>();

  @ContentChildren(StepComponent) steps!: QueryList<StepComponent>;

  isStepValid(index: number): boolean {
    const step = this.steps.toArray()[index];
    return step ? step.completed : false;
  }

  canActivateStep(index: number): boolean {
    if (!this.linear) return true;
    if (index === 0) return true;
    const step = this.steps.toArray()[index];
    if (step?.disabled) return false;
    
    // Vérifier que toutes les étapes précédentes sont complétées
    return this.steps.toArray()
      .slice(0, index)
      .every(step => step.completed && !step.error);
  }

  goToStep(index: number): void {
    const step = this.steps.toArray()[index];
    if (this.canActivateStep(index) && !step?.disabled && index !== this.activeStep) {
      this.activeStep = index;
      this.activeStepChange.emit(index);
      this.stepChange.emit(index);
    }
  }

  completeStep(index: number): void {
    const step = this.steps.toArray()[index];
    if (step) {
      if (step.error || step.disabled) return;
      
      step.completed = true;
      
      // Si c'est la dernière étape, émettre l'événement completed
      if (index === this.steps.length - 1) {
        this.completed.emit();
      } else {
        // Passer à l'étape suivante
        this.goToStep(index + 1);
      }
    }
  }
}