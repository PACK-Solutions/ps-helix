# Button Component Documentation

## Installation et Utilisation

### Installation

1. Installer le package via npm :
```bash
npm install @ps/helix
```

2. Importer le composant dans votre module ou composant standalone :
```typescript
import { LibButtonComponent } from '@ps/helix';

@Component({
  // ...
  imports: [LibButtonComponent],
  // ...
})
```

### Utilisation de Base

```typescript
import { Component } from '@angular/core';
import { LibButtonComponent } from '@ps/helix';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [LibButtonComponent],
  template: `
    <!-- Bouton basique -->
    <lib-button 
      variant="primary"
      (clicked)="handleClick()"
    >
      Click me
    </lib-button>

    <!-- Bouton avec icône -->
    <lib-button 
      variant="primary"
      icon="arrow-right"
      iconPosition="right"
      (clicked)="handleClick()"
    >
      Continue
    </lib-button>

    <!-- Bouton avec états -->
    <lib-button
      variant="primary"
      [loading]="isLoading"
      [disabled]="isDisabled"
      (clicked)="handleSubmit()"
    >
      Submit
    </lib-button>
  `
})
export class ExampleComponent {
  handleClick() {
    console.log('Button clicked!');
  }
}
```

### Configuration par Défaut

Vous pouvez utiliser la directive DefaultButtonDirective pour appliquer une configuration par défaut :

```typescript
import { DefaultButtonDirective } from '@ps/helix';

@Component({
  template: `
    <lib-button libDefaultButton>
      Default Configuration
    </lib-button>
  `,
  imports: [LibButtonComponent, DefaultButtonDirective]
})
```

La directive appliquera automatiquement :
- Variante: primary
- Taille: medium
- Position de l'icône: left
- État: non désactivé
- Chargement: false
- Largeur complète: false
- Affichage du label: false

### Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: BUTTON_CONFIG,
      useValue: {
        variant: 'primary',
        size: 'medium',
        iconPosition: 'left',
        disabled: false,
        loading: false,
        fullWidth: false,
        showLabel: false
      }
    },
    {
      provide: BUTTON_STYLES,
      useValue: {
        'custom-button': {
          borderWidth: '2px'
        }
      },
      multi: true
    }
  ]
})
```

### API

#### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | ButtonVariant | required | Style du bouton |
| size | ButtonSize | 'medium' | Taille du bouton |
| disabled | boolean | false | État désactivé |
| loading | boolean | false | État de chargement |
| fullWidth | boolean | false | Largeur complète |
| showLabel | boolean | false | Affiche le label traduit |
| iconPosition | ButtonIconPosition | 'left' | Position de l'icône |

#### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| icon | string | undefined | Nom de l'icône Phosphor |
| ariaLabel | string | undefined | Label ARIA personnalisé |

#### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| clicked | EventEmitter<MouseEvent> | Émis lors du clic |
| sizeChange | EventEmitter<ButtonSize> | Émis lors du changement de taille |
| variantChange | EventEmitter<ButtonVariant> | Émis lors du changement de variante |
| disabledChange | EventEmitter<boolean> | Émis lors du changement d'état désactivé |

## Variants Overview

### Primary Button
**Description**: Le bouton principal est la variante la plus visible, utilisée pour les actions principales ou Call-to-Action (CTA).

**Cas d'utilisation**:
- Actions principales dans un formulaire
- Call-to-Action principaux
- Actions qui initient un processus important

### Secondary Button
**Description**: Version moins accentuée que le bouton principal.

**Cas d'utilisation**:
- Actions alternatives
- Options secondaires
- Actions de support

### Outline Button
**Description**: Variante subtile avec uniquement une bordure.

**Cas d'utilisation**:
- Actions secondaires nécessitant une visibilité modérée
- Interfaces déjà chargées visuellement
- Actions optionnelles

### Text Button
**Description**: La variante la plus légère, sans fond ni bordure.

**Cas d'utilisation**:
- Actions de navigation
- Liens inline
- Actions tertiaires ou utilitaires

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses
- `medium`: Taille par défaut
- `large`: Pour les CTA importants

### Icônes
- `iconPosition="left"`: Icône à gauche du texte
- `iconPosition="right"`: Icône à droite du texte
- `iconPosition="only"`: Uniquement l'icône

### États
- `disabled`: Pour les actions indisponibles
- `loading`: Pour indiquer un traitement

## Accessibilité

### Attributs ARIA
- `role="button"`: Rôle sémantique
- `aria-disabled`: État désactivé
- `aria-label`: Description pour les boutons icône seule
- `aria-busy`: État de chargement

### Bonnes Pratiques
- Fournir des labels descriptifs
- Gérer la navigation au clavier
- Indiquer clairement les états

## Bonnes Pratiques

1. **Hiérarchie Visuelle**
   - Un seul bouton primaire par vue
   - Grouper les actions similaires
   - Maintenir une hiérarchie cohérente

2. **Accessibilité**
   - Fournir un texte descriptif
   - Utiliser des contrastes suffisants
   - Assurer la navigation au clavier

3. **Responsive Design**
   - Adapter la taille sur mobile
   - Privilégier les icônes seules sur petits écrans
   - Maintenir des zones de touch suffisantes

4. **Performance**
   - Utilisation des signals pour la réactivité
   - Gestion efficace des états
   - Détection de changements OnPush