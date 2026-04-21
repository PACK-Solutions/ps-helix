import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PshTabBarComponent } from '@lib/components/tab-bar/tab-bar.component';
import { TabBarItem, TabBarChangeEvent } from '@lib/components/tab-bar/tab-bar.types';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-tab-bar-demo',
  imports: [CommonModule, PshTabBarComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './tab-bar-demo.component.html',
  styleUrls: ['./tab-bar-demo.component.css']
})
export class TabBarDemoComponent {
  activeTabIndex = 0;
  tabChangeCount = 0;

  defaultTabs: TabBarItem[] = [
    { id: 'home', label: 'Accueil', icon: 'house' },
    { id: 'search', label: 'Rechercher', icon: 'magnifying-glass' },
    { id: 'add', label: 'Ajouter', icon: 'plus' },
    { id: 'notifications', label: 'Notifications', icon: 'bell', badge: '3' },
    { id: 'profile', label: 'Profil', icon: 'user' }
  ];

  simpleTabs: TabBarItem[] = [
    { id: 'home', label: 'Accueil', icon: 'house' },
    { id: 'search', label: 'Rechercher', icon: 'magnifying-glass' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'profile', label: 'Profil', icon: 'user' }
  ];

  tabsWithDisabled: TabBarItem[] = [
    { id: 'home', label: 'Accueil', icon: 'house' },
    { id: 'search', label: 'Rechercher', icon: 'magnifying-glass', disabled: true },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'profile', label: 'Profil', icon: 'user' }
  ];

  handleTabChange(event: TabBarChangeEvent): void {
    this.tabChangeCount++;
    console.log('Tab changed:', event);
  }

  basicTabBarCode = `<psh-tab-bar
  [items]="tabs"
></psh-tab-bar>`;

  badgesTabBarCode = `<psh-tab-bar
  [items]="tabs"
  [(activeIndex)]="activeIndex"
  (tabChange)="handleChange($event)"
></psh-tab-bar>

// TabBarItem avec badge
{
  id: 'notifications',
  label: 'Notifications',
  icon: 'bell',
  badge: '3'
}`;

  disabledTabBarCode = `// Désactiver toute la barre
<psh-tab-bar
  [items]="tabs"
  [disabled]="true"
></psh-tab-bar>

// Désactiver un onglet spécifique
{
  id: 'profile',
  label: 'Profil',
  icon: 'user',
  disabled: true
}`;

  getCurrentTabLabel(): string {
    const currentTab = this.defaultTabs[this.activeTabIndex];
    return currentTab ? currentTab.label : 'Aucun';
  }
}