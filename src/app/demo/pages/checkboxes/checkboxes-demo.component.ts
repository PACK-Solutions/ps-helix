import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { TranslateModule } from '@ngx-translate/core';
import { PshCheckboxComponent } from '@lib/components/checkbox/checkbox.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-checkboxes-demo',
  imports: [TranslateModule, PshCheckboxComponent, DemoPageLayoutComponent, CodeSnippetComponent, ReactiveFormsModule, FormField, JsonPipe],
  templateUrl: './checkboxes-demo.component.html',
  styleUrls: ['./checkboxes-demo.component.css']
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

  labelRightCode = `<psh-checkbox
  [(checked)]="isChecked"
  labelPosition="right"
>
  Accepter les conditions
</psh-checkbox>`;

  labelLeftCode = `<psh-checkbox
  [(checked)]="isChecked"
  labelPosition="left"
>
  Accepter les conditions
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
  [error]="'Ce champ est requis'"
  [(checked)]="isChecked"
>
  Accepter les conditions
</psh-checkbox>`;

  successCode = `<psh-checkbox
  [success]="'Validation réussie'"
  [(checked)]="isChecked"
>
  Option validée
</psh-checkbox>`;

  indeterminateCode = `<psh-checkbox
  [indeterminate]="true"
>
  Sélection partielle
</psh-checkbox>`;

  settingsModel = signal({ terms: false, newsletter: true });
  settingsForm = form(this.settingsModel);

  signalFormsCode = `import { signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

model = signal({ terms: false, newsletter: true });
settingsForm = form(this.model);

// Template :
<psh-checkbox [formField]="settingsForm.terms" label="J'accepte les conditions" />
<psh-checkbox [formField]="settingsForm.newsletter" label="Recevoir la newsletter" />`;

  termsControl = new FormControl(false);

  reactiveFormsCode = `import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [PshCheckboxComponent, ReactiveFormsModule],
  template: \`
    <psh-checkbox
      [formControl]="termsControl"
      label="J'accepte les conditions"
    />
    <p>Valeur: {{ termsControl.value }}</p>
  \`
})
export class MyComponent {
  termsControl = new FormControl(false);

  toggleProgrammatically() {
    this.termsControl.setValue(!this.termsControl.value);
  }
}`;

  toggleTerms(): void {
    this.termsControl.setValue(!this.termsControl.value);
  }
}