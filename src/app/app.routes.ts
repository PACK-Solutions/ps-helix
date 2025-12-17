import { Routes } from '@angular/router';
import { DemoLayoutComponent } from './demo';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'demo',
    component: DemoLayoutComponent,
    children: [
      {
        path: 'introduction',
        loadComponent: () => import('./demo/pages/introduction/introduction-demo.component').then(m => m.IntroductionDemoComponent)
      },
      {
        path: 'design-principles',
        loadComponent: () => import('./demo/pages/design-principles/design-principles-demo.component').then(m => m.DesignPrinciplesDemoComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/pages/typography/typography-demo.component').then(m => m.TypographyDemoComponent)
      },
      {
        path: 'colors',
        loadComponent: () => import('./demo/pages/colors/colors-demo.component').then(m => m.ColorsDemoComponent)
      },
      {
        path: 'grid',
        loadComponent: () => import('./demo/pages/grid/grid-demo.component').then(m => m.GridDemoComponent)
      },
      {
        path: 'progressbar',
        loadComponent: () => import('./demo/pages/progressbar/progressbar-demo.component').then(m => m.ProgressbarDemoComponent)
      },
      {
        path: 'spinloader',
        loadComponent: () => import('./demo/pages/spinloader/spinloader-demo.component').then(m => m.SpinLoaderDemoComponent)
      },
      {
        path: 'tooltips',
        loadComponent: () => import('./demo/pages/tooltips/tooltips-demo.component').then(m => m.TooltipsDemoComponent)
      },
      {
        path: 'pagination',
        loadComponent: () => import('./demo/pages/pagination/pagination-demo.component').then(m => m.PaginationDemoComponent)
      },
      {
        path: 'collapse',
        loadComponent: () => import('./demo/pages/collapse/collapse-demo.component').then(m => m.CollapseDemoComponent)
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/pages/tables/tables-demo.component').then(m => m.TablesDemoComponent)
      },
      {
        path: 'buttons',
        loadComponent: () => import('./demo/pages/buttons/buttons-demo.component').then(m => m.ButtonsDemoComponent)
      },
      {
        path: 'inputs',
        loadComponent: () => import('./demo/pages/inputs/inputs-demo.component').then(m => m.InputsDemoComponent)
      },
      {
        path: 'select',
        loadComponent: () => import('./demo/pages/select/select-demo.component').then(m => m.SelectDemoComponent)
      },
      {
        path: 'alerts',
        loadComponent: () => import('./demo/pages/alerts/alerts-demo.component').then(m => m.AlertsDemoComponent)
      },
      {
        path: 'toasts',
        loadComponent: () => import('./demo/pages/toasts/toasts-demo.component').then(m => m.ToastsDemoComponent)
      },
      {
        path: 'modals',
        loadComponent: () => import('./demo/pages/modals/modals-demo.component').then(m => m.ModalsDemoComponent)
      },
      {
        path: 'menu',
        loadComponent: () => import('./demo/pages/menu/menu-demo.component').then(m => m.MenuDemoComponent)
      },
      {
        path: 'dropdowns',
        loadComponent: () => import('./demo/pages/dropdowns/dropdowns-demo.component').then(m => m.DropdownsDemoComponent)
      },
      {
        path: 'checkboxes',
        loadComponent: () => import('./demo/pages/checkboxes/checkboxes-demo.component').then(m => m.CheckboxesDemoComponent)
      },
      {
        path: 'radios',
        loadComponent: () => import('./demo/pages/radios/radios-demo.component').then(m => m.RadiosDemoComponent)
      },
      {
        path: 'switches',
        loadComponent: () => import('./demo/pages/switches/switches-demo.component').then(m => m.SwitchesDemoComponent)
      },
      {
        path: 'tabs',
        loadComponent: () => import('./demo/pages/tabs/tabs-demo.component').then(m => m.TabsDemoComponent)
      },
      {
        path: 'stepper',
        loadComponent: () => import('./demo/pages/stepper/stepper-demo.component').then(m => m.StepperDemoComponent)
      },
      {
        path: 'badges',
        loadComponent: () => import('./demo/pages/badges/badges-demo.component').then(m => m.BadgesDemoComponent)
      },
      {
        path: 'cards',
        loadComponent: () => import('./demo/pages/cards/cards-demo.component').then(m => m.CardsDemoComponent)
      },
      {
        path: 'horizontal-cards',
        loadComponent: () => import('./demo/pages/horizontal-cards/horizontal-cards-demo.component').then(m => m.HorizontalCardsDemoComponent)
      },
      {
        path: 'info-cards',
        loadComponent: () => import('./demo/pages/info-cards/info-cards-demo.component').then(m => m.InfoCardsDemoComponent)
      },
      {
        path: 'stat-cards',
        loadComponent: () => import('./demo/pages/stat-cards/stat-cards-demo.component').then(m => m.StatCardsDemoComponent)
      },
      {
        path: 'tags',
        loadComponent: () => import('./demo/pages/tags/tags-demo.component').then(m => m.TagsDemoComponent)
      },
      {
        path: 'icons',
        loadComponent: () => import('./demo/pages/icons/icons-demo.component').then(m => m.IconsDemoComponent)
      },
      {
        path: 'tone-and-voice',
        loadComponent: () => import('./demo/pages/tone-and-voice/tone-and-voice-demo.component').then(m => m.ToneAndVoiceDemoComponent)
      },
      {
        path: 'i18n',
        loadComponent: () => import('./demo/pages/i18n/i18n-demo.component').then(m => m.I18nDemoComponent)
      },
      {
        path: 'terminology',
        loadComponent: () => import('./demo/pages/terminology/terminology-demo.component').then(m => m.TerminologyDemoComponent)
      },
      {
        path: 'avatar',
        loadComponent: () => import('./demo/pages/avatar/avatar-demo.component').then(m => m.AvatarDemoComponent)
      },
      {
        path: 'tab-bar',
        loadComponent: () => import('./demo/pages/tab-bar/tab-bar-demo.component').then(m => m.TabBarDemoComponent)
      },
      {
        path: 'sidebar',
        loadComponent: () => import('./demo/pages/sidebar/sidebar-demo.component').then(m => m.SidebarDemoComponent)
      },
      {
        path: '',
        redirectTo: 'introduction',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];