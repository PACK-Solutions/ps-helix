import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshMenuComponent } from '@lib/components/menu/menu.component';
import { PshButtonComponent } from '@lib/components/button/button.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { MenuItem } from '@lib/components/menu/menu.types';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-menu-demo',
  imports: [
    TranslateModule,
    PshMenuComponent,
    PshButtonComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent
  ],
  templateUrl: './menu-demo.component.html',
  styleUrls: ['./menu-demo.component.css'],
})
export class MenuDemoComponent {
  controlledCollapsed = signal(false);

  navigationItems: MenuItem[] = [
    {
      id: 'dashboard',
      content: 'Tableau de bord',
      icon: 'chart-line',
      active: true
    },
    {
      id: 'users',
      content: 'Utilisateurs',
      icon: 'users',
      children: [
        { id: 'all-users', content: 'Tous les utilisateurs' },
        { id: 'add-user', content: 'Ajouter un utilisateur' },
        { id: 'user-groups', content: 'Groupes' }
      ]
    },
    {
      id: 'content',
      content: 'Contenu',
      icon: 'file-text',
      children: [
        { id: 'posts', content: 'Articles' },
        { id: 'media', content: 'Médias' }
      ]
    },
    { id: 'divider1', divider: true, content: 'Divider' },
    {
      id: 'settings',
      content: 'Paramètres',
      icon: 'gear'
    },
    {
      id: 'help',
      content: 'Aide',
      icon: 'question'
    }
  ];

  horizontalItems: MenuItem[] = [
    { id: 'home', content: 'Accueil', icon: 'house' },
    { id: 'products', content: 'Produits', icon: 'package' },
    { id: 'services', content: 'Services', icon: 'briefcase' },
    { id: 'about', content: 'À propos', icon: 'info' },
    { id: 'contact', content: 'Contact', icon: 'envelope' }
  ];

  compactItems: MenuItem[] = [
    { id: 'home', content: 'Accueil', icon: 'house' },
    { id: 'analytics', content: 'Analytiques', icon: 'chart-bar' },
    { id: 'reports', content: 'Rapports', icon: 'file-text' },
    { id: 'settings', content: 'Paramètres', icon: 'gear' }
  ];

  expandedItems: MenuItem[] = [
    {
      id: 'workspace',
      content: 'Espace de travail',
      icon: 'folders'
    },
    {
      id: 'projects',
      content: 'Projets',
      icon: 'folder-open'
    },
    {
      id: 'team',
      content: 'Équipe',
      icon: 'users-three'
    }
  ];

  collapsibleItems: MenuItem[] = [
    { id: 'overview', content: 'Vue d\'ensemble', icon: 'house' },
    {
      id: 'workspace',
      content: 'Espace de travail',
      icon: 'folders',
      children: [
        { id: 'my-work', content: 'Mon travail' },
        { id: 'shared', content: 'Partagé' }
      ]
    },
    { id: 'calendar', content: 'Calendrier', icon: 'calendar' },
    { id: 'messages', content: 'Messages', icon: 'chat-circle', badge: '5' },
    { id: 'divider1', divider: true, content: 'Divider' },
    { id: 'settings', content: 'Paramètres', icon: 'gear' }
  ];

  iconItems: MenuItem[] = [
    { id: 'dashboard', content: 'Tableau de bord', icon: 'chart-line' },
    { id: 'analytics', content: 'Analytiques', icon: 'chart-bar' },
    { id: 'calendar', content: 'Calendrier', icon: 'calendar' },
    { id: 'messages', content: 'Messages', icon: 'chat-circle' },
    { id: 'files', content: 'Fichiers', icon: 'folder' }
  ];

  badgeItems: MenuItem[] = [
    { id: 'inbox', content: 'Boîte de réception', icon: 'envelope', badge: '12' },
    { id: 'notifications', content: 'Notifications', icon: 'bell', badge: '3' },
    { id: 'tasks', content: 'Tâches', icon: 'check-square', badge: '8' },
    { id: 'messages', content: 'Messages', icon: 'chat-circle', badge: '25' }
  ];

  dividerItems: MenuItem[] = [
    { id: 'profile', content: 'Profil', icon: 'user' },
    { id: 'settings', content: 'Paramètres', icon: 'gear' },
    { id: 'divider1', divider: true, content: 'Général' },
    { id: 'security', content: 'Sécurité', icon: 'lock' },
    { id: 'privacy', content: 'Confidentialité', icon: 'shield' },
    { id: 'divider2', divider: true, content: 'Compte' },
    { id: 'billing', content: 'Facturation', icon: 'credit-card' },
    { id: 'logout', content: 'Déconnexion', icon: 'sign-out' }
  ];

  submenuItems: MenuItem[] = [
    { id: 'home', content: 'Accueil', icon: 'house' },
    {
      id: 'admin',
      content: 'Administration',
      icon: 'shield-check',
      children: [
        { id: 'users', content: 'Utilisateurs', icon: 'users' },
        { id: 'roles', content: 'Rôles', icon: 'key' },
        {
          id: 'settings-sub',
          content: 'Paramètres',
          children: [
            { id: 'general', content: 'Général' },
            { id: 'advanced', content: 'Avancé' }
          ]
        }
      ]
    },
    { id: 'reports', content: 'Rapports', icon: 'file-text' }
  ];

  stateItems: MenuItem[] = [
    { id: 'active', content: 'Item actif', icon: 'check', active: true },
    { id: 'normal', content: 'Item normal', icon: 'circle' },
    { id: 'disabled', content: 'Item désactivé', icon: 'x', disabled: true }
  ];

  handleItemClick(item: MenuItem): void {
    console.log('Menu item clicked:', item);
  }

  verticalModeCode = `<psh-menu
  [items]="navigationItems"
  mode="vertical"
  (itemClick)="handleItemClick($event)"
></psh-menu>`;

  horizontalModeCode = `<psh-menu
  [items]="horizontalItems"
  mode="horizontal"
  (itemClick)="handleItemClick($event)"
></psh-menu>`;

  collapsibleCode = `<psh-menu
  [items]="items"
  [collapsible]="true"
  [(collapsed)]="isCollapsed"
  (itemClick)="handleClick($event)"
></psh-menu>`;

  defaultVariantCode = `<psh-menu
  [items]="items"
  variant="default"
></psh-menu>`;

  compactVariantCode = `<psh-menu
  [items]="items"
  variant="compact"
></psh-menu>`;

  expandedVariantCode = `<psh-menu
  [items]="items"
  variant="expanded"
></psh-menu>`;

  iconItemsCode = `items = [
  {
    id: 'dashboard',
    content: 'Tableau de bord',
    icon: 'chart-line'
  },
  {
    id: 'users',
    content: 'Utilisateurs',
    icon: 'users'
  }
];`;

  badgeItemsCode = `items = [
  {
    id: 'inbox',
    content: 'Boîte de réception',
    icon: 'envelope',
    badge: '12'
  },
  {
    id: 'notifications',
    content: 'Notifications',
    icon: 'bell',
    badge: '3'
  }
];`;

  dividerItemsCode = `items = [
  { id: 'profile', content: 'Profil', icon: 'user' },
  { id: 'settings', content: 'Paramètres', icon: 'gear' },
  { id: 'divider1', divider: true, content: 'Compte' },
  { id: 'billing', content: 'Facturation', icon: 'credit-card' }
];`;

  submenuItemsCode = `items = [
  {
    id: 'admin',
    content: 'Administration',
    icon: 'shield-check',
    children: [
      { id: 'users', content: 'Utilisateurs' },
      {
        id: 'settings',
        content: 'Paramètres',
        children: [
          { id: 'general', content: 'Général' }
        ]
      }
    ]
  }
];`;

  statesCode = `items = [
  {
    id: 'active-page',
    content: 'Page active',
    active: true
  },
  {
    id: 'normal',
    content: 'Page normale'
  },
  {
    id: 'disabled',
    content: 'Page désactivée',
    disabled: true
  }
];`;

  toggleControlled(): void {
    this.controlledCollapsed.update(v => !v);
  }
}
