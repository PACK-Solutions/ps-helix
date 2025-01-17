# Alert Component Documentation

## Installation et Utilisation

### Installation

1. Installer le package via npm :
```bash
npm install @ps/helix
```

2. Importer le composant dans votre module ou composant standalone :
```typescript
import { LibAlertComponent } from '@ps/helix';

@Component({
  // ...
  imports: [LibAlertComponent],
  // ...
})
```

### Utilisation de Base

```typescript
import { Component } from '@angular/core';
import { LibAlertComponent } from '@ps/helix';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [LibAlertComponent],
  template: `
    <!-- Alerte basique -->
    <lib-alert type="info">
      Message d'information
    </lib-alert>

    <!-- Alerte avec icône personnalisée -->
    <lib-alert 
      type="success"
      icon="bell"
      iconPosition="right"
      [closable]="true"
      (closed)="handleClose()"
    >
      Message de succès avec icône personnalisée
    </lib-alert>

    <!-- Alerte avec configuration par défaut -->
    <lib-alert libDefaultAlert>
      Alerte avec configuration par défaut
    </lib-alert>
  `
})
export class ExampleComponent {
  handleClose() {
    console.log('Alert closed!');
  }
}
```

### API

#### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| type | AlertType | required | Type d'alerte ('info', 'success', 'warning', 'danger') |
| iconPosition | IconPosition | 'left' | Position de l'icône ('left', 'right') |
| closable | boolean | false | Affiche un bouton de fermeture |
| size | AlertSize | 'medium' | Taille de l'alerte ('small', 'medium', 'large') |
| showIcon | boolean | true | Affiche ou masque l'icône |
| role | AlertRole | 'alert' | Rôle ARIA ('alert', 'status') |

#### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| icon | string | undefined | Nom de l'icône Phosphor à afficher |
| ariaLabel | string | undefined | Label ARIA personnalisé |
| ariaLive | 'polite' \| 'assertive' | undefined | Politesse de l'annonce ARIA |

#### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| closed | EventEmitter<void> | Émis lors de la fermeture de l'alerte |

### Configuration par Défaut

Vous pouvez utiliser la directive DefaultAlertDirective pour appliquer une configuration par défaut :

```typescript
import { DefaultAlertDirective } from '@ps/helix';

@Component({
  template: `
    <lib-alert libDefaultAlert>
      Configuration par défaut
    </lib-alert>
  `,
  imports: [LibAlertComponent, DefaultAlertDirective]
})
```

La directive appliquera automatiquement :
- Type: info
- Position de l'icône: left
- Closable: true
- Taille: medium
- Affichage de l'icône: true
- Rôle: alert

## Variants Overview

### Info Alert
**Description**: L'alerte d'information est utilisée pour des messages informatifs généraux.

**Cas d'utilisation**:
- Messages d'information généraux
- Mises à jour du système
- Conseils et astuces

### Success Alert
**Description**: L'alerte de succès confirme qu'une action s'est bien déroulée.

**Cas d'utilisation**:
- Confirmation de soumission
- Actions réussies
- Validations positives

### Warning Alert
**Description**: L'alerte d'avertissement attire l'attention sur des points importants.

**Cas d'utilisation**:
- Avertissements préventifs
- Actions nécessitant attention
- Notifications importantes

### Danger Alert
**Description**: L'alerte de danger signale des erreurs ou des problèmes critiques.

**Cas d'utilisation**:
- Messages d'erreur
- Actions destructives
- Problèmes critiques

## États et Modificateurs

### Tailles
- `small`: Pour les messages courts et discrets
- `medium`: Taille par défaut
- `large`: Pour les messages importants

### Positions d'Icône
- `left`: Icône à gauche du texte (défaut)
- `right`: Icône à droite du texte

### États
- `closable`: Permet la fermeture de l'alerte
- `showIcon`: Contrôle l'affichage de l'icône

## Accessibilité

### Rôles ARIA
- `role="alert"`: Pour les messages importants nécessitant l'attention immédiate
- `role="status"`: Pour les messages informatifs non critiques

### Attributs ARIA
- `aria-label`: Label personnalisé pour les lecteurs d'écran
- `aria-live`: Contrôle la priorité des annonces ('polite' ou 'assertive')
- `aria-describedby`: Relie l'alerte à des descriptions supplémentaires

### Bonnes Pratiques
- Utiliser le rôle approprié selon l'importance du message
- Fournir des labels clairs et descriptifs
- Gérer correctement la fermeture avec le clavier

## Bonnes Pratiques

1. **Hiérarchie Visuelle**
   - Utiliser le type approprié selon l'importance du message
   - Maintenir une cohérence dans l'utilisation des types
   - Limiter le nombre d'alertes simultanées

2. **Accessibilité**
   - Utilisation appropriée des rôles ARIA
   - Support des lecteurs d'écran
   - Messages clairs et concis

3. **Responsive Design**
   - Les alertes s'adaptent à la largeur du conteneur
   - Texte lisible sur toutes les tailles d'écran
   - Gestion appropriée des longs contenus

4. **Performance**
   - Utilisation des signals pour la réactivité
   - Détection de changements OnPush
   - Animations optimisées