# Alert Component Documentation

## Installation et Utilisation

### Installation

```bash
npm install ps-helix
```

### Import du Composant

```typescript
import { PshAlertComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshAlertComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Alerte basique
<psh-alert type="info">
  Message d'information
</psh-alert>

// Alerte avec icône personnalisée
<psh-alert 
  type="success"
  icon="bell"
  iconPosition="right"
  [closable]="true"
  (closed)="handleClose()"
>
  Message de succès avec icône personnalisée
</psh-alert>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| type | AlertType | 'info' | Type d'alerte |
| iconPosition | IconPosition | 'left' | Position de l'icône |
| closable | boolean | false | Affiche un bouton de fermeture |
| size | AlertSize | 'medium' | Taille de l'alerte |
| showIcon | boolean | true | Affiche ou masque l'icône |
| role | AlertRole | 'alert' | Rôle ARIA |

### Regular Inputs (@input)
| Nom | Type | Description |
|-----|------|-------------|
| icon | string | Nom de l'icône Phosphor |
| ariaLabel | string | Label ARIA personnalisé |
| dismissLabel | string | Label du bouton de fermeture |
| ariaLive | 'polite' \| 'assertive' | Niveau de politesse ARIA |
| content | string | Contenu de l'alerte |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| closed | EventEmitter<void> | Émis lors de la fermeture |

### Types

```typescript
type AlertType = 'info' | 'success' | 'warning' | 'danger';
type IconPosition = 'left' | 'right';
type AlertSize = 'small' | 'medium' | 'large';
type AlertRole = 'alert' | 'status';
```

## Configuration par Défaut

Le composant Alert inclut une configuration par défaut intégrée :

```typescript
const DEFAULT_CONFIG = {
  type: 'info',
  iconPosition: 'left',
  closable: false,
  size: 'medium',
  showIcon: true,
  role: 'alert'
};
```

## Variants Overview

### Info Alert
**Description**: Pour les messages informatifs généraux.

**Cas d'utilisation**:
- Messages d'information
- Mises à jour du système
- Conseils et astuces

### Success Alert
**Description**: Pour confirmer une action réussie.

**Cas d'utilisation**:
- Confirmation de soumission
- Actions réussies
- Validations positives

### Warning Alert
**Description**: Pour attirer l'attention sur des points importants.

**Cas d'utilisation**:
- Avertissements préventifs
- Actions nécessitant attention
- Notifications importantes

### Danger Alert
**Description**: Pour signaler des erreurs ou problèmes critiques.

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