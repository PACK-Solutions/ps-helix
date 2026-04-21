import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshAlertComponent } from '@lib/components/alert/alert.component';
import { PshButtonComponent } from '@lib/components/button/button.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-alerts-demo',
  imports: [
    TranslateModule,
    PshAlertComponent,
    PshButtonComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent
  ],
  templateUrl: './alerts-demo.component.html',
  styleUrls: ['./alerts-demo.component.css']
})
export class AlertsDemoComponent {
  showDismissibleAlert = true;

  infoCode = `<psh-alert
  type="info"
  role="status"
  ariaLive="polite"
>
  Message d'information
</psh-alert>`;

  successCode = `<psh-alert
  type="success"
  role="status"
  ariaLive="polite"
>
  Opération réussie
</psh-alert>`;

  warningCode = `<psh-alert
  type="warning"
  role="alert"
  ariaLive="assertive"
>
  Attention requise
</psh-alert>`;

  dangerCode = `<psh-alert
  type="danger"
  role="alert"
  ariaLive="assertive"
>
  Erreur critique
</psh-alert>`;

  dismissibleCode = `<psh-alert
  type="info"
  [closable]="true"
  (closed)="handleDismiss()"
>
  Message fermable
</psh-alert>`;

  fullExampleCode = `import { PshAlertComponent } from 'ps-helix';

@Component({
  imports: [PshAlertComponent],
  template: \`
    <psh-alert
      type="success"
      icon="check-circle"
      size="large"
      ariaLabel="Profil mis a jour avec succes"
      [closable]="true"
      (closed)="handleAlertClose()"
    >
      Votre profil a ete mis a jour avec succes
    </psh-alert>
  \`
})
export class MyComponent {
  handleAlertClose(): void {
    console.log('Alert closed');
  }
}`;

  handleDismiss(): void {
    this.showDismissibleAlert = false;
  }

  resetDismissibleAlert(): void {
    this.showDismissibleAlert = true;
  }
}