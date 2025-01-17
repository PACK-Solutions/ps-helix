# Avatar Component Documentation

## Installation et Utilisation

### Installation

1. Installer le package via npm :
```bash
npm install @ps/helix
```

2. Importer le composant dans votre module ou composant standalone :
```typescript
import { LibAvatarComponent } from '@ps/helix';

@Component({
  // ...
  imports: [LibAvatarComponent],
  // ...
})
```

### Utilisation de Base

```typescript
import { Component } from '@angular/core';
import { LibAvatarComponent } from '@ps/helix';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [LibAvatarComponent],
  template: `
    <!-- Avatar avec image -->
    <lib-avatar
      src="path/to/image.jpg"
      alt="John Doe"
      ariaLabel="Photo de profil de John Doe"
    ></lib-avatar>

    <!-- Avatar avec initiales -->
    <lib-avatar
      initials="JD"
      alt="John Doe"
    ></lib-avatar>

    <!-- Avatar avec icône -->
    <lib-avatar
      icon="user"
      alt="Utilisateur"
    ></lib-avatar>

    <!-- Avatar avec statut -->
    <lib-avatar
      src="path/to/image.jpg"
      alt="John Doe"
      status="online"
    ></lib-avatar>
  `
})
export class ExampleComponent {}
```

### Configuration par Défaut

Vous pouvez utiliser la directive DefaultAvatarDirective pour appliquer une configuration par défaut :

```typescript
import { DefaultAvatarDirective } from '@ps/helix';

@Component({
  template: `
    <lib-avatar libDefaultAvatar>
      Default Configuration
    </lib-avatar>
  `,
  imports: [LibAvatarComponent, DefaultAvatarDirective]
})
```

La directive appliquera automatiquement :
- Taille: medium
- Forme: circle
- Alt: "User avatar"

### API

#### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| size | AvatarSize | 'medium' | Taille de l'avatar ('small', 'medium', 'large', 'xlarge') |
| shape | AvatarShape | 'circle' | Forme de l'avatar ('circle', 'square') |
| src | string | undefined | URL de l'image |
| alt | string | '' | Texte alternatif |

#### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| initials | string | '' | Initiales à afficher |
| icon | string | undefined | Nom de l'icône Phosphor |
| status | AvatarStatus | undefined | Statut ('online', 'offline', 'away', 'busy') |
| ariaLabel | string | undefined | Label ARIA personnalisé |

### Configuration Globale

Vous pouvez personnaliser la configuration globale via les tokens d'injection :

```typescript
import { AVATAR_CONFIG, AVATAR_STATUS_COLORS, AVATAR_STYLES } from '@ps/helix';

@Component({
  providers: [
    {
      provide: AVATAR_CONFIG,
      useValue: {
        size: 'medium',
        shape: 'circle',
        alt: 'User avatar'
      }
    },
    {
      provide: AVATAR_STATUS_COLORS,
      useValue: {
        online: '#22C55E',
        offline: '#94A3B8',
        away: '#F97316',
        busy: '#EF4444'
      }
    },
    {
      provide: AVATAR_STYLES,
      useValue: {
        'custom-avatar': {
          border: '2px solid var(--primary-color)'
        }
      },
      multi: true
    }
  ]
})
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