import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshBadgeComponent } from '@lib/components/badge/badge.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-badges-demo',
  imports: [TranslateModule, PshBadgeComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './badges-demo.component.html',
  styleUrls: ['./badges-demo.component.css']
})
export class BadgesDemoComponent {
  priceFormatter = (value: number) => `${value.toFixed(2)}€`;

  numberFormatter = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  percentageFormatter = (value: number) => `${value}%`;

  demoValues = {
    notifications: 5,
    messages: 1250,
    price: 42.99,
    users: 1500000,
    progress: 85
  };

  badgePrimaryCode = `<psh-badge
  variant="primary"
  displayType="text"
>
  En cours
</psh-badge>`;

  badgeSuccessCode = `<psh-badge
  variant="success"
  displayType="text"
>
  Actif
</psh-badge>`;

  badgeWarningCode = `<psh-badge
  variant="warning"
  displayType="text"
>
  En attente
</psh-badge>`;

  badgeDangerCode = `<psh-badge
  variant="danger"
  displayType="text"
>
  Inactif
</psh-badge>`;

  badgeDisabledCode = `<psh-badge
  variant="disabled"
  displayType="text"
>
  Désactivé
</psh-badge>`;

  priceFormatterCode = `priceFormatter = (value: number) =>
  \`\${value.toFixed(2)}€\`;

<psh-badge
  [value]="42.99"
  [formatter]="priceFormatter"
/>`;

  numberFormatterCode = `numberFormatter = (value: number) => {
  if (value >= 1000000)
    return \`\${(value / 1000000).toFixed(1)}M\`;
  if (value >= 1000)
    return \`\${(value / 1000).toFixed(1)}k\`;
  return value.toString();
};`;

  percentageFormatterCode = `percentageFormatter = (value: number) =>
  \`\${value}%\`;

<psh-badge
  [value]="85"
  [formatter]="percentageFormatter"
/>`;

  overlapBadgeCode = `<div style="position: relative">
  <i class="ph ph-bell"></i>
  <psh-badge
    variant="danger"
    [value]="3"
    [overlap]="true"
    position="top-right"
  />
</div>`;

  fullExampleCode = `import { PshBadgeComponent } from 'ps-helix';

@Component({
  standalone: true,
  imports: [PshBadgeComponent],
  template: \`
    <div style="position: relative">
      <i class="ph ph-bell"></i>
      <psh-badge
        variant="danger"
        displayType="counter"
        size="medium"
        [value]="notificationCount"
        [max]="99"
        [overlap]="true"
        position="top-right"
        [formatter]="customFormatter"
        ariaLabel="Notifications non lues"
      />
    </div>
  \`
})
export class MyComponent {
  notificationCount = 150;

  customFormatter = (value: number) =>
    value > 99 ? '99+' : value.toString();
}`;
}
