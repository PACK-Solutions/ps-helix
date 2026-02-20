import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { PshSwitchComponent } from '@lib/components/switch/switch.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-switches-demo',
  imports: [
    CommonModule,
    PshSwitchComponent,
    DemoPageLayoutComponent,
    ReactiveFormsModule,
    CodeSnippetComponent,
    FormField
  ],
  templateUrl: './switches-demo.component.html',
  styleUrls: ['./switches-demo.component.css']
})
export class SwitchesDemoComponent {
  rightLabelChecked = false;
  leftLabelChecked = false;
  defaultChecked = true;

  disabledUnchecked = false;
  disabledChecked = true;
  errorChecked = false;
  successChecked = true;
  requiredChecked = false;

  smallChecked = false;
  mediumChecked = true;
  largeChecked = false;

  settingsForm = new FormGroup({
    notifications: new FormControl(true),
    emailAlerts: new FormControl(false),
    darkMode: new FormControl(true, Validators.requiredTrue),
    analytics: new FormControl(false)
  });

  rightLabelCode = `<psh-switch
  [(checked)]="isEnabled"
  labelPosition="right"
>
  Activer les notifications
</psh-switch>`;

  leftLabelCode = `<psh-switch
  [(checked)]="isEnabled"
  labelPosition="left"
>
  Activer les notifications
</psh-switch>`;

  projectedContentCode = `<psh-switch [(checked)]="isEnabled">
  <strong>Mode sombre</strong>
  <span>Thème sombre activé</span>
</psh-switch>`;

  disabledCode = `<psh-switch
  [disabled]="true"
  [(checked)]="isEnabled"
>
  Option désactivée
</psh-switch>`;

  errorCode = `<psh-switch
  [(checked)]="isEnabled"
  error="Ce champ est requis"
>
  Accepter les conditions
</psh-switch>`;

  successCode = `<psh-switch
  [(checked)]="isEnabled"
  success="Configuration enregistrée"
>
  Mode sombre
</psh-switch>`;

  requiredCode = `<psh-switch
  [(checked)]="isEnabled"
  [required]="true"
>
  Accepter les CGU
</psh-switch>`;

  reactiveFormsCode = `// Dans le component
settingsForm = new FormGroup({
  notifications: new FormControl(true),
  darkMode: new FormControl(false,
    Validators.requiredTrue)
});

// Dans le template
<psh-switch
  formControlName="notifications"
>
  Activer les notifications
</psh-switch>`;

  preferencesModel = signal({ notifications: true, darkMode: false, analytics: false });
  preferencesForm = form(this.preferencesModel);

  signalFormsCode = `import { signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

preferencesModel = signal({
  notifications: true,
  darkMode: false,
  analytics: false
});
preferencesForm = form(this.preferencesModel);

// Template :
<psh-switch [formField]="preferencesForm.notifications">
  Activer les notifications
</psh-switch>
<psh-switch [formField]="preferencesForm.darkMode">
  Mode sombre
</psh-switch>`;

  onFormSubmit(): void {
    if (this.settingsForm.valid) {
      console.log('Form values:', this.settingsForm.value);
    }
  }
}
