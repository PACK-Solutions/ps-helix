import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PshTextareaComponent } from '@lib/components/textarea/textarea.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-textarea-demo',
  imports: [
    ReactiveFormsModule,
    PshTextareaComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent
  ],
  templateUrl: './textarea-demo.component.html',
  styleUrls: ['./textarea-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaDemoComponent {
  // Reactive Forms binding
  commentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(200)]
  });

  // Signal-based two-way binding (Signal Forms compatible pattern)
  bioValue = signal('Je suis passionné par le design système.');
  feedbackValue = signal('');
  autoSizeValue = signal('Écris plusieurs lignes pour voir la hauteur s\'adapter automatiquement...');

  reactiveCode = `// Component
commentControl = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.maxLength(200)]
});

// Template
<psh-textarea
  label="Votre commentaire"
  placeholder="Écrivez ici..."
  helperText="200 caractères maximum"
  [maxLength]="200"
  [showCharacterCount]="true"
  [formControl]="commentControl"
/>`;

  signalCode = `// Component - compatible Signal Forms (Angular 21+)
// ou binding signal via two-way [(value)]
bioValue = signal('');

// Template
<psh-textarea
  label="Biographie"
  [(value)]="bioValue"
  [rows]="5"
  [showCharacterCount]="true"
  [maxLength]="500"
/>

// Signal Forms (Angular 21+)
// <psh-textarea [field]="myForm.bio" label="Biographie" />`;

  autoSizeCode = `<psh-textarea
  label="Message"
  [autoSize]="true"
  [(value)]="messageValue"
/>`;
}
