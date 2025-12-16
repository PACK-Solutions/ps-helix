import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshRadioComponent } from '@lib/components/radio/radio.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-radios-demo',
  imports: [TranslateModule, PshRadioComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './radios-demo.component.html',
  styleUrls: ['./radios-demo.component.css']
})
export class RadiosDemoComponent {
  labelPositionChecked = false;

  stateChecked = false;

  sizeSmallChecked = false;
  sizeMediumChecked = false;
  sizeLargeChecked = false;

  paymentCardChecked = false;
  paymentPaypalChecked = false;
  paymentTransferChecked = false;
  paymentCashChecked = false;

  themeLightChecked = true;
  themeDarkChecked = false;
  themeAutoChecked = false;

  notificationEmailChecked = true;
  notificationSmsChecked = false;
  notificationPushChecked = false;
  notificationNoneChecked = false;

  get paymentMethod(): string {
    if (this.paymentCardChecked) return 'card';
    if (this.paymentPaypalChecked) return 'paypal';
    if (this.paymentTransferChecked) return 'transfer';
    if (this.paymentCashChecked) return 'cash';
    return 'Aucune';
  }

  get theme(): string {
    if (this.themeLightChecked) return 'light';
    if (this.themeDarkChecked) return 'dark';
    if (this.themeAutoChecked) return 'auto';
    return 'light';
  }

  get notification(): string {
    if (this.notificationEmailChecked) return 'email';
    if (this.notificationSmsChecked) return 'sms';
    if (this.notificationPushChecked) return 'push';
    if (this.notificationNoneChecked) return 'none';
    return 'email';
  }

  labelRightCode = `<psh-radio
  name="choice"
  value="option1"
  labelPosition="right"
>
  Option 1
</psh-radio>`;

  labelLeftCode = `<psh-radio
  name="choice"
  value="option1"
  labelPosition="left"
>
  Option 1
</psh-radio>`;

  noLabelCode = `<psh-radio
  name="choice"
  value="option1"
  ariaLabel="Sélectionner l'option 1"
/>`;

  disabledCode = `<psh-radio
  [disabled]="true"
  name="choice"
  value="option1"
>
  Option désactivée
</psh-radio>`;

  errorCode = `<psh-radio
  [error]="'Veuillez sélectionner une option'"
  name="choice"
  value="option1"
>
  Option 1
</psh-radio>`;

  successCode = `<psh-radio
  [success]="'Validation réussie'"
  name="choice"
  value="option1"
>
  Option validée
</psh-radio>`;

  requiredCode = `<psh-radio
  [required]="true"
  name="choice"
  value="option1"
>
  Option 1
</psh-radio>`;

  paymentGroupCode = `<psh-radio
  name="payment"
  value="card"
  [(checked)]="paymentMethod"
>
  Carte bancaire
</psh-radio>
<psh-radio
  name="payment"
  value="paypal"
>
  PayPal
</psh-radio>`;

  themeGroupCode = `<psh-radio
  name="theme"
  value="light"
  [(checked)]="theme"
>
  Clair
</psh-radio>
<psh-radio
  name="theme"
  value="dark"
>
  Sombre
</psh-radio>`;

  notificationGroupCode = `<psh-radio
  name="notification"
  value="email"
  [(checked)]="notification"
  size="large"
>
  Email
</psh-radio>`;

  handleValueChange(value: any): void {
    console.log('Radio value changed:', value);
  }
}
