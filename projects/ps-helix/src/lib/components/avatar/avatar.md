# Avatar Component Documentation

## Installation et Utilisation

### Installation

```bash
npm install ps-helix
```

### Import du Composant

```typescript
import { PshAvatarComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshAvatarComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Avatar avec image
<psh-avatar
  src="path/to/image.jpg"
  alt="John Doe"
  ariaLabel="Photo de profil de John Doe"
></psh-avatar>

// Avatar avec initiales
<psh-avatar
  initials="JD"
  alt="John Doe"
></psh-avatar>

// Avatar avec statut
<psh-avatar
  src="path/to/image.jpg"
  alt="John Doe"
  status="online"
></psh-avatar>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| size | AvatarSize | 'medium' | Taille de l'avatar |
| shape | AvatarShape | 'circle' | Forme de l'avatar |
| src | string | undefined | URL de l'image |
| alt | string | 'User avatar' | Texte alternatif |

### Regular Inputs (@input)
| Nom | Type | Description |
|-----|------|-------------|
| initials | string | Initiales à afficher |
| icon | string | Icône Phosphor |
| status | AvatarStatus | Statut de l'utilisateur |
| ariaLabel | string | Label ARIA personnalisé |

### Types

```typescript
type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';
type AvatarShape = 'circle' | 'square';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';
```

## Configuration par Défaut

Le composant Avatar inclut une configuration par défaut intégrée :

```typescript
const DEFAULT_CONFIG = {
  size: 'medium',
  shape: 'circle',
  alt: 'User avatar',
  icon: 'user'
};

const DEFAULT_STATUS_COLORS = {
  online: 'var(--success-color)',
  offline: 'var(--surface-400)',
  away: 'var(--warning-color)',
  busy: 'var(--danger-color)'
};
```

## Variants Overview

### Image Avatar
**Description**: Affiche une image de profil.

**Cas d'utilisation**:
- Photos de profil utilisateur
- Images de compte
- Avatars personnalisés

### Initials Avatar
**Description**: Affiche les initiales quand aucune image n'est disponible.

**Cas d'utilisation**:
- Fallback quand pas d'image
- Représentation textuelle de l'identité
- Placeholder temporaire

### Icon Avatar
**Description**: Affiche une icône comme avatar.

**Cas d'utilisation**:
- Avatars par défaut
- Icônes de système
- Représentations génériques

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses (32px)
- `medium`: Taille par défaut (40px)
- `large`: Pour plus de visibilité (48px)
- `xlarge`: Pour les avatars mis en avant (64px)

### Formes
- `circle`: Style circulaire (par défaut)
- `square`: Style carré avec coins arrondis

### États
- `status`: Indicateur de statut en ligne
- Gestion des erreurs de chargement d'image

## Accessibilité

### Attributs ARIA
- `role="img"`: Indique que c'est une image
- `aria-label`: Description détaillée de l'avatar
- `aria-hidden="true"`: Pour les icônes décoratives

### Bonnes Pratiques
- Toujours fournir un texte alternatif
- Utiliser des contrastes suffisants
- Support des lecteurs d'écran

## Bonnes Pratiques

1. **Hiérarchie Visuelle**
   - Utiliser la taille appropriée selon le contexte
   - Maintenir une cohérence dans l'utilisation des formes
   - Limiter l'utilisation des grands avatars

2. **Accessibilité**
   - Fournir des textes descriptifs
   - Utiliser des contrastes suffisants
   - Support des lecteurs d'écran

3. **Performance**
   - Optimiser les images
   - Utiliser des tailles appropriées
   - Gérer les fallbacks

4. **Internationalisation**
   - Support des textes traduits
   - Gestion des directions RTL/LTR
   - Messages d'état localisés