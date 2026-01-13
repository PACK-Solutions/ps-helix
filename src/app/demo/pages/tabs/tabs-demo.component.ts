import { Component, signal } from '@angular/core';
import { PshTabsComponent, PshTabComponent, Tab, TabChangeEvent } from '@lib/components';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-tabs-demo',
  imports: [PshTabsComponent, PshTabComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './tabs-demo.component.html',
  styleUrls: ['./tabs-demo.component.css']
})
export class TabsDemoComponent {
  activeIndex = signal(0);
  activeIndex2 = signal(0);
  lastChange = signal<string>('');

  programmaticTabs: Tab[] = [
    { header: 'Dashboard', icon: 'squares-four', content: 'Vue d\'ensemble de vos donnees' },
    { header: 'Analytics', icon: 'chart-line', content: 'Statistiques detaillees' },
    { header: 'Settings', icon: 'gear', content: 'Configuration de l\'application' },
    { header: 'Disabled', icon: 'prohibit', content: 'Cet onglet est desactive', disabled: true }
  ];

  twoWayBindingCode = `<psh-tabs [(activeIndex)]="activeIndex">
  <psh-tab header="Accueil" icon="house">
    Contenu de l'onglet
  </psh-tab>
  <psh-tab header="Profil" icon="user">
    Autre contenu
  </psh-tab>
</psh-tabs>`;

  withoutIconsCode = `<psh-tabs>
  <psh-tab header="Informations">
    Contenu
  </psh-tab>
</psh-tabs>`;

  programmaticCode = `tabs: Tab[] = [
  {
    header: 'Dashboard',
    icon: 'squares-four',
    content: 'Contenu du dashboard'
  },
  {
    header: 'Disabled',
    icon: 'prohibit',
    content: 'Contenu desactive',
    disabled: true
  }
];

handleTabChange(event: TabChangeEvent): void {
  console.log(event.previousIndex, event.currentIndex);
}`;

  defaultVariantCode = `<psh-tabs variant="default">
  <psh-tab header="Accueil">
    Contenu
  </psh-tab>
</psh-tabs>`;

  underlineVariantCode = `<psh-tabs variant="underline">
  <psh-tab header="Information">
    Contenu
  </psh-tab>
</psh-tabs>`;

  pillsVariantCode = `<psh-tabs variant="pills">
  <psh-tab header="Vue d'ensemble">
    Contenu
  </psh-tab>
</psh-tabs>`;

  handleTabChange(event: TabChangeEvent): void {
    const prevTab = this.programmaticTabs[event.previousIndex];
    if (prevTab) {
      this.lastChange.set(
        `Changement de "${prevTab.header}" vers "${event.tab.header}"`
      );
    }
  }
}
