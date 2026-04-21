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
    { header: 'Dashboard', icon: 'squares-four', content: '<p>Vue d\'ensemble de vos données</p>' },
    { header: 'Analytics', icon: 'chart-line', content: '<p>Statistiques détaillées</p>' },
    { header: 'Settings', icon: 'gear', content: '<p>Configuration de l\'application</p>' },
    { header: 'Disabled', icon: 'prohibit', content: '<p>Cet onglet est désactivé</p>', disabled: true }
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
    content: '<p>Contenu</p>'
  },
  {
    header: 'Disabled',
    icon: 'prohibit',
    content: '...',
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
