# Alert Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
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

### Inputs
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| type | AlertType | 'info' | Type d'alerte |
| iconPosition | IconPosition | 'left' | Position de l'icône |
| closable | boolean | false | Affiche un bouton de fermeture |
| size | AlertSize | 'medium' | Taille de l'alerte |
| showIcon | boolean | true | Affiche ou masque l'icône |
| icon | string | - | Nom de l'icône Phosphor (auto selon type si non défini) |
| role | AlertRole | auto | Rôle ARIA (auto: 'alert' pour warning/danger, 'status' pour info/success) |
| ariaLabel | string | - | Label ARIA personnalisé |
| dismissLabel | string | 'Dismiss alert' | Label du bouton de fermeture |
| ariaLive | 'polite' \| 'assertive' | auto | Niveau de politesse ARIA (auto: 'assertive' pour warning/danger, 'polite' pour info/success) |
| content | string | '' | Contenu de l'alerte (alternative à ng-content) |

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
  showIcon: true
};

const DEFAULT_LABELS = {
  dismiss: 'Dismiss alert'
};

const DEFAULT_ICONS = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'warning-octagon'
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

### Comportement Automatique

Le composant calcule automatiquement les attributs ARIA en fonction du type d'alerte :

| Type | role | aria-live |
|------|------|-----------|
| info | status | polite |
| success | status | polite |
| warning | alert | assertive |
| danger | alert | assertive |

Ces valeurs peuvent être surchargées via les inputs `role` et `ariaLive`.

### Rôles ARIA
- `role="alert"`: Pour les messages importants nécessitant l'attention immédiate (warning, danger)
- `role="status"`: Pour les messages informatifs non critiques (info, success)

### Attributs ARIA
- `aria-label`: Label personnalisé pour les lecteurs d'écran
- `aria-live`: Contrôle la priorité des annonces ('polite' ou 'assertive')

### Bonnes Pratiques
- Laisser le calcul automatique des rôles ARIA sauf besoin specifique
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