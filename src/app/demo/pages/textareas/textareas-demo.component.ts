import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, maxLength } from '@angular/forms/signals';
import { PshTextareaComponent } from '@lib/components/textarea/textarea.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-textareas-demo',
  imports: [
    PshTextareaComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent,
    ReactiveFormsModule,
    FormField,
    JsonPipe,
  ],
  templateUrl: './textareas-demo.component.html',
  styleUrls: ['./textareas-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareasDemoComponent {
  readonly defaultValue = signal('');
  readonly autoSizeValue = signal('');
  readonly counterValue = signal('');
  readonly resizeValue = signal('');
  readonly fullWidthValue = signal('');

  readonly reactiveControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(140)],
  });

  readonly signalModel = signal({ description: '' });
  readonly signalForm = form(this.signalModel, (p) => {
    required(p.description, { message: 'Description requise' });
    maxLength(p.description, 200, { message: 'Maximum 200 caracteres' });
  });

  readonly outlinedCode = `<psh-textarea
  variant="outlined"
  label="Commentaire"
  placeholder="Votre message..."
></psh-textarea>`;

  readonly filledCode = `<psh-textarea
  variant="filled"
  label="Commentaire"
  placeholder="Votre message..."
></psh-textarea>`;

  readonly sizeSmallCode = `<psh-textarea size="small" label="Note" />`;
  readonly sizeMediumCode = `<psh-textarea size="medium" label="Note" />`;
  readonly sizeLargeCode = `<psh-textarea size="large" label="Note" />`;

  readonly autoSizeCode = `<psh-textarea
  label="Description"
  [autoSize]="true"
  hint="La hauteur s'adapte automatiquement"
></psh-textarea>`;

  readonly counterCode = `<psh-textarea
  label="Message"
  [maxLength]="140"
  [showCharacterCount]="true"
></psh-textarea>`;

  readonly resizeCode = `<psh-textarea
  label="Libre"
  resize="both"
></psh-textarea>`;

  readonly fullWidthCode = `<psh-textarea
  label="Description"
  [fullWidth]="true"
  placeholder="Occupe toute la largeur"
></psh-textarea>`;

  readonly reactiveCode = `control = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.maxLength(140)],
});

// Template
<psh-textarea
  [formControl]="control"
  label="Commentaire"
  [maxLength]="140"
  [showCharacterCount]="true"
  [required]="true"
></psh-textarea>`;

  readonly signalFormsCode = `model = signal({ description: '' });
descriptionForm = form(this.model, (p) => {
  required(p.description, { message: 'Description requise' });
  maxLength(p.description, 200, { message: 'Max 200 caracteres' });
});

// Template
<psh-textarea
  [formField]="descriptionForm.description"
  label="Description"
  [maxLength]="200"
  [showCharacterCount]="true"
></psh-textarea>`;

  readonly statesCode = `<psh-textarea label="Avec erreur" error="Ce champ est requis" />
<psh-textarea label="Avec succes" success="Votre saisie est valide" />
<psh-textarea label="Avec aide" hint="Maximum 500 caracteres" />
<psh-textarea label="Desactive" [disabled]="true" />
<psh-textarea label="Lecture seule" [readonly]="true" />`;
}
