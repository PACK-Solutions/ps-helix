import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { TranslateModule } from '@ngx-translate/core';
import { PshCheckboxComponent } from '@lib/components/checkbox/checkbox.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-checkboxes-demo',
  standalone: true,
  imports: [
    TranslateModule, 
    PshCheckboxComponent, 
    DemoPageLayoutComponent, 
    CodeSnippetComponent, 
    ReactiveFormsModule, 
    JsonPipe, 
    FormField
  ],
  templateUrl: './checkboxes-demo.component.html',
  styleUrls: ['./checkboxes-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxesDemoComponent {
  standardChecked = false;
  leftLabelChecked = false;
  noLabelChecked = false;

  disabledChecked = true;
  errorChecked = false;

  smallChecked = false;
  mediumChecked = true;
  largeChecked = false;

  // Signal Forms - Typage explicite requis pour le build
  settingsModel = signal<{ terms: boolean; newsletter: boolean }>({ 
    terms: false, 
    newsletter: true 
  });
  
  settingsForm = form(this.settingsModel);

  termsControl = new FormControl(false);

  toggleTerms(): void {
    this.termsControl.setValue(!this.termsControl.value);
  }

  labelRightCode = `<psh-checkbox
  [(checked)]="isChecked"
  labelPosition="right"
>
  Label à droite
</psh-checkbox>`;

  labelLeftCode = `<psh-checkbox
  [(checked)]="isChecked"
  labelPosition="left"
>
  Label à gauche
</psh-checkbox>`;

  noLabelCode = `<psh-checkbox
  [(checked)]="isChecked"
  ariaLabel="Sélectionner l'élément"
/>`;

  disabledCode = `<psh-checkbox
  [disabled]="true"
  [(checked)]="isChecked"
>
  Option désactivée
</psh-checkbox>`;

  errorCode = `<psh-checkbox
  [error]="'Champ requis'"
  [(checked)]="isChecked"
>
  Option avec erreur
</psh-checkbox>`;

  successCode = `<psh-checkbox
  [checked]="true"
  [success]="'Sélection valide'"
>
  Option validée
</psh-checkbox>`;

  indeterminateCode = `<psh-checkbox
  [indeterminate]="true"
>
  Sélection partielle
</psh-checkbox>`;

  reactiveFormsCode = `import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PshCheckboxComponent } from 'ps-helix';

@Component({
  imports: [PshCheckboxComponent, ReactiveFormsModule],
  template: \`
    <psh-checkbox
      [formControl]="termsControl"
      label="J'accepte les conditions"
    />
  \`
})
export class MyComponent {
  termsControl = new FormControl(false);
}`;

  signalFormsCode = `import { signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { PshCheckboxComponent } from 'ps-helix';

@Component({
  imports: [PshCheckboxComponent, FormField],
  template: \`
    <psh-checkbox
      [formField]="settingsForm.terms"
      label="J'accepte les conditions"
    />
  \`
})
export class MyComponent {
  settingsModel = signal({ terms: false });
  settingsForm = form(this.settingsModel);
}`;
}