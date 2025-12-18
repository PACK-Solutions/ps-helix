import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshButtonComponent } from '@lib/components/button/button.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-buttons-demo',
  imports: [TranslateModule, PshButtonComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './buttons-demo.component.html',
  styleUrls: ['./buttons-demo.component.css']
})
export class ButtonsDemoComponent {
  isFormInvalid = false;
  isSubmitting = false;
  isMobile = false;

  filledAppearanceCode = `<psh-button
  appearance="filled"
  variant="primary"
>
  Action principale
</psh-button>`;

  outlineAppearanceCode = `<psh-button
  appearance="outline"
  variant="primary"
>
  Action secondaire
</psh-button>`;

  roundedAppearanceCode = `<psh-button
  appearance="rounded"
  variant="primary"
>
  Action spéciale
</psh-button>`;

  textAppearanceCode = `<psh-button
  appearance="text"
  variant="primary"
>
  Action tertiaire
</psh-button>`;

  iconLeftCode = `<psh-button
  icon="arrow-right"
  iconPosition="left"
>
  Continuer
</psh-button>`;

  iconRightCode = `<psh-button
  icon="arrow-right"
  iconPosition="right"
>
  Suivant
</psh-button>`;

  iconOnlyCode = `<psh-button
  icon="plus"
  iconPosition="only"
  iconOnlyText="Ajouter"
/>`;

  statesCode = `<psh-button
  appearance="filled"
  variant="primary"
  [disabled]="isFormInvalid"
  [loading]="isSubmitting"
  [fullWidth]="isMobile"
  (clicked)="handleSubmit($event)"
>
  Enregistrer
</psh-button>`;

  handleClick(event: MouseEvent): void {
    console.log('Button clicked:', event);
  }

  handleSubmit(event: MouseEvent): void {
    this.isSubmitting = true;
    console.log('Submitting form:', event);

    setTimeout(() => {
      this.isSubmitting = false;
      console.log('Form submitted successfully');
    }, 2000);
  }
}