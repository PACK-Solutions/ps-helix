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
  commentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(200)]
  });

  bioValue = signal('Je suis passionné par le design système.');
  feedbackValue = signal('');
  autoSizeValue = signal('Écrivez plusieurs lignes pour voir la hauteur s\'adapter automatiquement...');
  fullWidthValue = signal('');
  readonlyValue = signal('Contenu affiché en lecture seule, sélectionnable mais non modifiable.');

  outlinedVariantCode = `<psh-textarea
  variant="outlined"
  label="Commentaire"
  placeholder="Partagez votre avis..."
  [(value)]="commentValue"
/>`;

  filledVariantCode = `<psh-textarea
  variant="filled"
  label="Commentaire"
  placeholder="Partagez votre avis..."
  [(value)]="commentValue"
/>`;

  sizesCode = `<psh-textarea size="small" label="Compact" />
<psh-textarea size="medium" label="Standard" />
<psh-textarea size="large" label="Confortable" />`;

  statesCode = `<psh-textarea
  [disabled]="isSubmitting"
  [readonly]="isReadonly"
  [error]="errorMessage"
  [required]="true"
  label="Description"
/>`;

  fullWidthCode = `<psh-textarea
  [fullWidth]="true"
  label="Description complète"
  placeholder="Occupe toute la largeur du conteneur..."
  [rows]="5"
  [(value)]="descriptionValue"
/>`;

  counterCode = `<psh-textarea
  label="Commentaire"
  [maxLength]="200"
  [showCharacterCount]="true"
  helperText="200 caractères maximum"
  [(value)]="commentValue"
/>`;

  autoSizeCode = `<psh-textarea
  label="Message"
  [autoSize]="true"
  resize="none"
  [(value)]="messageValue"
/>`;

  reactiveCode = `// Component
commentControl = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.maxLength(200)]
});

// Template
<psh-textarea
  label="Votre commentaire"
  [maxLength]="200"
  [showCharacterCount]="true"
  [required]="true"
  [formControl]="commentControl"
/>`;

  usageCode = `import { PshTextareaComponent } from 'ps-helix';

@Component({
  imports: [PshTextareaComponent],
  template: \`
    <psh-textarea
      variant="outlined"
      size="medium"
      label="Votre commentaire"
      placeholder="Partagez votre avis..."
      helperText="200 caracteres maximum"
      [rows]="4"
      [maxLength]="200"
      [showCharacterCount]="true"
      [required]="true"
      [(value)]="commentValue"
      (valueChange)="handleChange($event)"
    />
  \`
})
export class MyComponent {
  commentValue = signal('');

  handleChange(value: string): void {
    // ...
  }
}`;

  signalCode = `// Signal two-way (Angular 20+)
bioValue = signal('');

<psh-textarea
  label="Biographie"
  [(value)]="bioValue"
  [rows]="5"
  [showCharacterCount]="true"
  [maxLength]="500"
/>

// Signal Forms (Angular 21+)
// <psh-textarea [field]="myForm.bio" label="Biographie" />`;
}
