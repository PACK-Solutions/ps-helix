import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  PshHorizontalCardComponent,
  PshButtonComponent,
  PshTagComponent,
  PshAvatarComponent,
} from '@lib/components';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-horizontal-cards-demo',
  templateUrl: './horizontal-cards-demo.component.html',
  styleUrls: ['./horizontal-cards-demo.component.css'],
  imports: [
    CommonModule,
    TranslateModule,
    PshHorizontalCardComponent,
    PshButtonComponent,
    PshTagComponent,
    PshAvatarComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent,
  ],
})
export class HorizontalCardsDemoComponent {
  products = [
    {
      id: 1,
      name: 'Casque Audio Premium',
      description: 'Casque sans fil avec réduction de bruit active et autonomie de 30 heures',
      price: '299€',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      imageAlt: 'Casque audio noir premium avec design moderne',
      stock: 'En stock',
      category: 'Audio'
    },
    {
      id: 2,
      name: 'Montre Connectée Sport',
      description: 'Suivi d\'activité avancé avec GPS intégré et résistance à l\'eau',
      price: '349€',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
      imageAlt: 'Montre connectée sport avec écran tactile',
      stock: 'Stock limité',
      category: 'Wearables'
    },
    {
      id: 3,
      name: 'Clavier Mécanique RGB',
      description: 'Switches mécaniques tactiles avec rétroéclairage personnalisable',
      price: '159€',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
      imageAlt: 'Clavier mécanique gaming avec rétroéclairage RGB',
      stock: 'En stock',
      category: 'Périphériques'
    }
  ];

  users = [
    {
      id: 1,
      name: 'Sophie Martin',
      role: 'Lead Designer',
      email: 'sophie.martin@example.com',
      location: 'Paris, France',
      projects: 12,
      status: 'Actif',
      avatar: 'SM'
    },
    {
      id: 2,
      name: 'Thomas Dubois',
      role: 'Senior Developer',
      email: 'thomas.dubois@example.com',
      location: 'Lyon, France',
      projects: 8,
      status: 'En congé',
      avatar: 'TD'
    }
  ];

  articles = [
    {
      id: 1,
      title: 'Guide complet du Design System',
      excerpt: 'Découvrez comment créer et maintenir un design system évolutif pour votre organisation.',
      date: '15 Déc 2025',
      readTime: '8 min',
      category: 'Design',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      imageAlt: 'Palette de couleurs et outils de design'
    },
    {
      id: 2,
      title: 'Angular 20 et les Signals',
      excerpt: 'Les nouveautés d\'Angular 20 et comment les signals révolutionnent la gestion d\'état.',
      date: '10 Déc 2025',
      readTime: '12 min',
      category: 'Développement',
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      imageAlt: 'Code source sur ecran de developpeur'
    }
  ];

  productCardCode = `<psh-horizontal-card
  [variant]="'elevated'"
  [interactive]="true"
  [hoverable]="true"
  [sideWidth]="'var(--size-40)'"
>
  <div horizontal-side>
    <img src="product.jpg" alt="Product">
  </div>
  <div horizontal-header>
    <h4>Casque Audio Premium</h4>
    <psh-tag>En stock</psh-tag>
  </div>
  <p>Description du produit</p>
  <div horizontal-actions>
    <psh-button>Acheter</psh-button>
  </div>
</psh-horizontal-card>`;

  userCardCode = `<psh-horizontal-card
  [variant]="'outlined'"
  [interactive]="true"
  [sideWidth]="'var(--size-32)'"
>
  <div horizontal-side>
    <psh-avatar [initials]="'SM'" [size]="'xlarge'"></psh-avatar>
  </div>
  <div horizontal-header>
    <h4>Sophie Martin</h4>
    <psh-tag>Actif</psh-tag>
  </div>
  <p>Lead Designer</p>
  <div horizontal-actions>
    <psh-button>Contacter</psh-button>
  </div>
</psh-horizontal-card>`;

  articleCardCode = `<psh-horizontal-card
  [variant]="'elevated'"
  [interactive]="true"
  [sideWidth]="'var(--size-48)'"
>
  <div horizontal-side>
    <img src="article.jpg" alt="Article">
  </div>
  <div horizontal-header>
    <psh-tag>Design</psh-tag>
  </div>
  <h4>Guide complet du Design System</h4>
  <p>Découvrez comment créer et maintenir un design system évolutif.</p>
  <div horizontal-actions>
    <psh-button>Lire l'article</psh-button>
  </div>
</psh-horizontal-card>`;

  statesCode = `<!-- État Loading -->
<psh-horizontal-card [loading]="true">
  <div horizontal-side>
    <img src="image.jpg" alt="Image">
  </div>
  <div horizontal-header>
    <h4>Titre</h4>
  </div>
  <p>Contenu masqué pendant le chargement</p>
</psh-horizontal-card>

<!-- État Disabled -->
<psh-horizontal-card
  [interactive]="true"
  [disabled]="true"
>
  <div horizontal-side>
    <img src="image.jpg" alt="Image">
  </div>
  <div horizontal-header>
    <h4>Carte désactivée</h4>
  </div>
  <p>Cette carte ne peut pas être cliquée</p>
</psh-horizontal-card>`;

  handleCardClick(event: MouseEvent | KeyboardEvent, item: string): void {
    console.log(`${item} clicked:`, event);
  }
}
