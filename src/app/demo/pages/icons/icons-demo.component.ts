import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';

@Component({
  selector: 'ds-icons-demo',
  imports: [TranslateModule, DemoPageLayoutComponent],
  templateUrl: './icons-demo.component.html',
  styleUrls: ['./icons-demo.component.css']
})
export class IconsDemoComponent {
  keyFeatures = [
    {
      icon: 'package',
      title: 'Large choix d\'icônes',
      description: 'Plus de 900 icônes couvrant tous les besoins courants.'
    },
    {
      icon: 'palette',
      title: 'Cohérence visuelle',
      description: 'Style uniforme et plusieurs variantes disponibles.'
    },
    {
      icon: 'sliders',
      title: 'Personnalisation facile',
      description: 'Contrôle total via CSS (taille, couleur, etc.).'
    },
    {
      icon: 'code',
      title: 'Intégration flexible',
      description: 'Support SVG, font icons et composants framework.'
    }
  ];

  styleVariants = [
    { type: 'regular', name: 'Regular' },
    { type: 'bold', name: 'Bold' },
    { type: 'fill', name: 'Fill' },
    { type: 'light', name: 'Light' }
  ];

  iconExamples = [
    { name: 'house', category: 'Navigation', usage: 'Accueil, Dashboard' },
    { name: 'user', category: 'Users', usage: 'Profil, Compte' },
    { name: 'gear', category: 'Settings', usage: 'Configuration, Préférences' },
    { name: 'bell', category: 'Notifications', usage: 'Alertes, Messages' },
    { name: 'magnifying-glass', category: 'Actions', usage: 'Recherche' },
    { name: 'plus-circle', category: 'Actions', usage: 'Ajouter, Créer' },
    { name: 'trash', category: 'Actions', usage: 'Supprimer' },
    { name: 'pencil-simple', category: 'Actions', usage: 'Éditer, Modifier' }
  ];

  /**
   * Retourne la classe CSS correcte pour chaque variante d'icône Phosphor
   */
  getIconClass(type: string): string {
    switch (type) {
      case 'regular':
        return 'ph ph-house';
      case 'bold':
        return 'ph-bold ph-house';
      case 'fill':
        return 'ph-fill ph-house';
      case 'light':
        return 'ph-light ph-house';
      default:
        return 'ph ph-house';
    }
  }
}