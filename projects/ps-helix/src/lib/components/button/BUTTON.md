# Button Component Documentation

## Table des Matières
- [Installation et Utilisation](#installation-et-utilisation)
- [API](#api)
- [Apparences](#apparences)
- [Tailles](#tailles)
- [Variantes de Couleur](#variantes-de-couleur)
- [États](#états)
- [Icônes](#icônes)
- [Combinaisons Courantes](#combinaisons-courantes)
- [Accessibilité](#accessibilité)
- [Bonnes Pratiques](#bonnes-pratiques)

## Installation et Utilisation

### Installation

```typescript
import { PshButtonComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshButtonComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Button basique
<psh-button>Mon bouton</psh-button>

// Button avec apparence et variante
<psh-button appearance="filled" variant="primary">
  Bouton Principal
</psh-button>

// Button avec icône
<psh-button
  appearance="filled"
  variant="primary"
  icon="arrow-right"
  iconPosition="right"
>
  Suivant
</psh-button>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| appearance | ButtonAppearance | 'filled' | Apparence du bouton |
| variant | ButtonVariant | 'primary' | Style du bouton |
| size | ButtonSize | 'medium' | Taille du bouton |
| disabled | boolean | false | État désactivé |
| loading | boolean | false | État de chargement |
| fullWidth | boolean | false | Largeur complète |
| iconPosition | ButtonIconPosition | 'left' | Position de l'icône |

### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| icon | string | undefined | Nom de l'icône Phosphor |
| ariaLabel | string | undefined | Label ARIA personnalisé |
| loadingText | string | 'Loading...' | Texte de chargement |
| disabledText | string | 'Unavailable' | Texte désactivé |
| iconOnlyText | string | undefined | Label pour icône seule |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| clicked | EventEmitter<MouseEvent> | Émis lors du clic |

### Types

```typescript
type ButtonAppearance = 'filled' | 'outline' | 'rounded' | 'text';
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonIconPosition = 'left' | 'right' | 'only';
```

## Apparences

### Filled (Par défaut)
**Description**: Style avec fond plein et couleur d'accent.

**Cas d'utilisation**:
- Actions principales
- CTA (Call-to-Action)
- Validation de formulaires

**Exemple**:
```html
<psh-button appearance="filled" variant="primary">Enregistrer</psh-button>
<psh-button appearance="filled" variant="secondary">Annuler</psh-button>
<psh-button appearance="filled" variant="success">Valider</psh-button>
<psh-button appearance="filled" variant="warning">Attention</psh-button>
<psh-button appearance="filled" variant="danger">Supprimer</psh-button>
```

### Outline
**Description**: Style avec bordure de couleur sans fond.

**Cas d'utilisation**:
- Actions secondaires
- Options alternatives
- Interfaces épurées

**Exemple**:
```html
<psh-button appearance="outline" variant="primary">Modifier</psh-button>
<psh-button appearance="outline" variant="secondary">Retour</psh-button>
<psh-button appearance="outline" variant="success">Approuver</psh-button>
```

### Rounded
**Description**: Style avec coins complètement arrondis (border-radius: 50px).

**Cas d'utilisation**:
- Design moderne
- Interfaces ludiques
- Actions spéciales
- Floating action buttons

**Exemple**:
```html
<psh-button appearance="rounded" variant="primary">Commencer</psh-button>
<psh-button appearance="rounded" variant="secondary">Explorer</psh-button>
```

### Text
**Description**: Style minimaliste sans fond ni bordure, uniquement la couleur du texte.

**Cas d'utilisation**:
- Navigation
- Actions tertiaires
- Liens dans le contenu
- Menus

**Exemple**:
```html
<psh-button appearance="text" variant="primary">En savoir plus</psh-button>
<psh-button appearance="text" variant="secondary">Fermer</psh-button>
<psh-button appearance="text" variant="danger">Supprimer</psh-button>
```

## Tailles

### Small (32px)
Utilisé pour les interfaces denses ou les actions secondaires.

**Exemple**:
```html
<psh-button size="small" variant="primary">Petit</psh-button>
<psh-button size="small" appearance="outline" variant="secondary">Annuler</psh-button>
<psh-button size="small" appearance="text" variant="primary">Lien</psh-button>
```

### Medium (40px) - Par défaut
Taille standard pour la majorité des cas d'utilisation.

**Exemple**:
```html
<psh-button size="medium" variant="primary">Moyen</psh-button>
<psh-button size="medium" appearance="outline" variant="secondary">Annuler</psh-button>
<psh-button size="medium" appearance="rounded" variant="primary">Action</psh-button>
```

### Large (48px)
Utilisé pour les actions importantes ou les interfaces tactiles.

**Exemple**:
```html
<psh-button size="large" variant="primary">Grand</psh-button>
<psh-button size="large" appearance="outline" variant="success">Valider</psh-button>
<psh-button size="large" appearance="rounded" variant="primary">Confirmer</psh-button>
```

## Variantes de Couleur

### Primary
Couleur principale de l'application. Utilisé pour les actions primaires.

```html
<psh-button variant="primary" appearance="filled">Primary Filled</psh-button>
<psh-button variant="primary" appearance="outline">Primary Outline</psh-button>
<psh-button variant="primary" appearance="text">Primary Text</psh-button>
```

### Secondary
Couleur secondaire. Utilisé pour les actions moins importantes.

```html
<psh-button variant="secondary" appearance="filled">Secondary Filled</psh-button>
<psh-button variant="secondary" appearance="outline">Secondary Outline</psh-button>
<psh-button variant="secondary" appearance="text">Secondary Text</psh-button>
```

### Success
Couleur de succès (vert). Utilisé pour les actions positives.

```html
<psh-button variant="success" appearance="filled">Valider</psh-button>
<psh-button variant="success" appearance="outline">Approuver</psh-button>
<psh-button variant="success" appearance="text">Confirmer</psh-button>
```

### Warning
Couleur d'avertissement (orange). Utilisé pour les actions nécessitant attention.

```html
<psh-button variant="warning" appearance="filled">Attention</psh-button>
<psh-button variant="warning" appearance="outline">Modifier</psh-button>
<psh-button variant="warning" appearance="text">Avertir</psh-button>
```

### Danger
Couleur de danger (rouge). Utilisé pour les actions destructives.

```html
<psh-button variant="danger" appearance="filled">Supprimer</psh-button>
<psh-button variant="danger" appearance="outline">Retirer</psh-button>
<psh-button variant="danger" appearance="text">Annuler</psh-button>
```

## États

### Disabled (Désactivé)
Empêche toute interaction avec le bouton.

```html
<psh-button [disabled]="true" variant="primary">Désactivé</psh-button>
<psh-button [disabled]="isFormInvalid" variant="primary">Enregistrer</psh-button>
```

### Loading (Chargement)
Affiche un spinner de chargement et désactive les interactions.

```html
<psh-button [loading]="true" variant="primary">En cours...</psh-button>
<psh-button
  [loading]="isSubmitting"
  loadingText="Enregistrement..."
  variant="primary"
>
  Enregistrer
</psh-button>
```

### Full Width (Largeur complète)
Occupe toute la largeur du conteneur parent.

```html
<psh-button [fullWidth]="true" variant="primary">Largeur complète</psh-button>
<psh-button [fullWidth]="true" appearance="outline" variant="secondary">
  S'inscrire
</psh-button>
```

## Bonnes Pratiques

### Choix de l'Apparence
1. **Filled**: Utilisez pour l'action principale d'une page ou d'un formulaire
2. **Outline**: Utilisez pour les actions secondaires ou alternatives
3. **Rounded**: Utilisez pour des actions spéciales ou des FAB (Floating Action Buttons)
4. **Text**: Utilisez pour les actions tertiaires, les liens ou la navigation

### Choix de la Variante
1. **Primary**: Action principale de la page (ex: Enregistrer, Continuer)
2. **Secondary**: Actions secondaires (ex: Annuler, Retour)
3. **Success**: Actions de validation ou confirmation (ex: Valider, Approuver)
4. **Warning**: Actions nécessitant attention (ex: Modifier avec prudence)
5. **Danger**: Actions destructives (ex: Supprimer, Retirer définitivement)

### Hiérarchie Visuelle
```html
<!-- Une seule action primaire par contexte -->
<psh-button variant="primary">Action Principale</psh-button>

<!-- Actions secondaires en outline ou text -->
<psh-button appearance="outline" variant="secondary">Action Secondaire</psh-button>
<psh-button appearance="text" variant="secondary">Action Tertiaire</psh-button>
```

### Groupes de Boutons
```html
<!-- Alignez les boutons de manière logique -->
<div style="display: flex; gap: 12px; justify-content: flex-end;">
  <psh-button appearance="outline" variant="secondary">Annuler</psh-button>
  <psh-button variant="primary">Confirmer</psh-button>
</div>
```

### Textes des Boutons
- **Utilisez des verbes d'action**: "Enregistrer", "Continuer", "Supprimer"
- **Soyez concis**: Maximum 2-3 mots
- **Soyez descriptif**: "Créer un compte" plutôt que "Ok"
- **Évitez le jargon technique**: "Supprimer" plutôt que "Delete"

### États Interactifs
```typescript
// Désactivez pendant le chargement
<psh-button
  [loading]="isSubmitting"
  [disabled]="!form.valid"
  variant="primary"
>
  Enregistrer
</psh-button>

// Fournissez un feedback
handleSubmit() {
  this.isSubmitting = true;
  this.api.save(this.data).subscribe({
    next: () => {
      this.isSubmitting = false;
      this.toastService.success('Enregistré avec succès');
    },
    error: () => {
      this.isSubmitting = false;
      this.toastService.error('Erreur lors de l\'enregistrement');
    }
  });
}
```

### Icônes
- **Soyez cohérent**: Utilisez toujours la même icône pour la même action
- **Position logique**: Flèches à droite pour "Suivant", à gauche pour "Retour"
- **Icône seule**: Uniquement si l'action est universellement comprise (ex: ✕, +, ⚙️)
- **Label accessible**: Toujours fournir `iconOnlyText` pour les icônes seules

## Accessibilité

### Attributs ARIA Générés Automatiquement
Le composant génère automatiquement les attributs ARIA appropriés:

- `role="button"`: Rôle sémantique du bouton
- `aria-disabled="true"`: Lorsque le bouton est désactivé
- `aria-busy="true"`: Lorsque le bouton est en chargement
- `aria-label`: Utilise `ariaLabel` ou génère automatiquement à partir du contenu

### Labels Accessibles

**Pour les boutons avec texte**:
```html
<!-- Le texte du bouton est utilisé comme label -->
<psh-button variant="primary">Enregistrer</psh-button>
```

**Pour les boutons avec icône seule**:
```html
<!-- Toujours fournir iconOnlyText pour l'accessibilité -->
<psh-button
  icon="x"
  iconPosition="only"
  iconOnlyText="Fermer la fenêtre"
  variant="secondary"
></psh-button>
```

**Pour les boutons ambigus**:
```html
<!-- Fournir un ariaLabel descriptif -->
<psh-button
  icon="arrow-right"
  ariaLabel="Passer à l'étape suivante du formulaire"
  variant="primary"
>
  Suivant
</psh-button>
```

### Support Clavier
Le composant supporte nativement:
- **Espace** ou **Entrée**: Active le bouton
- **Tab**: Navigation entre les boutons
- **Focus visible**: Indicateur visuel lors de la navigation au clavier

### États Visuels
```html
<!-- États distincts pour tous les utilisateurs -->
<psh-button variant="primary">Normal</psh-button>
<psh-button variant="primary" [disabled]="true">Désactivé</psh-button>
<psh-button variant="primary" [loading]="true">Chargement</psh-button>
```

### Contraste des Couleurs
Le design system garantit:
- **Ratio de contraste WCAG AA**: Minimum 4.5:1 pour le texte
- **Focus visible**: Outline de 2px avec contraste suffisant
- **États désactivés**: Réduction d'opacité maintenant un contraste acceptable

### Messages d'État pour les Lecteurs d'Écran
```html
<!-- Le loadingText est annoncé aux lecteurs d'écran -->
<psh-button
  [loading]="isSubmitting"
  loadingText="Enregistrement en cours, veuillez patienter"
  variant="primary"
>
  Enregistrer
</psh-button>

<!-- Le disabledText explique pourquoi le bouton est désactivé -->
<psh-button
  [disabled]="!hasPermission"
  disabledText="Vous n'avez pas les permissions nécessaires"
  variant="primary"
>
  Modifier
</psh-button>
```

## Icônes

### Position de l'icône

**Left (Par défaut)**:
```html
<psh-button
  icon="arrow-left"
  iconPosition="left"
  variant="primary"
>
  Retour
</psh-button>
```

**Right**:
```html
<psh-button
  icon="arrow-right"
  iconPosition="right"
  variant="primary"
>
  Suivant
</psh-button>
```

**Icon Only (Icône seule)**:
```html
<psh-button
  icon="plus"
  iconPosition="only"
  iconOnlyText="Ajouter un élément"
  variant="primary"
  appearance="rounded"
></psh-button>
```

### Icônes Phosphor
Utilisez n'importe quelle icône de [Phosphor Icons](https://phosphoricons.com/):

```html
<psh-button icon="check" variant="success">Valider</psh-button>
<psh-button icon="x" variant="danger">Fermer</psh-button>
<psh-button icon="download-simple" variant="primary">Télécharger</psh-button>
<psh-button icon="trash" variant="danger" appearance="outline">Supprimer</psh-button>
<psh-button icon="pencil-simple" variant="secondary">Modifier</psh-button>
```

## Combinaisons Courantes

### Boutons de formulaire
```html
<!-- Formulaire basique -->
<div class="form-actions">
  <psh-button
    appearance="outline"
    variant="secondary"
    (clicked)="onCancel()"
  >
    Annuler
  </psh-button>
  <psh-button
    variant="primary"
    [disabled]="!form.valid"
    [loading]="isSubmitting"
    (clicked)="onSubmit()"
  >
    Enregistrer
  </psh-button>
</div>
```

### Boutons d'action de table
```html
<psh-button
  size="small"
  appearance="text"
  variant="primary"
  icon="pencil-simple"
  (clicked)="onEdit(row)"
>
  Modifier
</psh-button>
<psh-button
  size="small"
  appearance="text"
  variant="danger"
  icon="trash"
  (clicked)="onDelete(row)"
>
  Supprimer
</psh-button>
```

### Boutons de navigation
```html
<psh-button
  appearance="text"
  variant="primary"
  icon="arrow-left"
  iconPosition="left"
  (clicked)="goBack()"
>
  Retour
</psh-button>
<psh-button
  appearance="rounded"
  variant="primary"
  icon="arrow-right"
  iconPosition="right"
  (clicked)="goNext()"
>
  Continuer
</psh-button>
```

### Floating Action Button (FAB)
```html
<psh-button
  appearance="rounded"
  variant="primary"
  icon="plus"
  iconPosition="only"
  iconOnlyText="Ajouter un nouvel élément"
  size="large"
  (clicked)="onCreate()"
></psh-button>
```

## Exemple Complet avec Toutes les Options

```typescript
import { Component } from '@angular/core';
import { PshButtonComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [PshButtonComponent],
  template: `
    <psh-button
      appearance="filled"
      variant="primary"
      size="medium"
      icon="arrow-right"
      iconPosition="right"
      [disabled]="isDisabled"
      [loading]="isLoading"
      [fullWidth]="false"
      ariaLabel="Continuer vers la prochaine étape"
      loadingText="Chargement en cours..."
      (clicked)="handleClick($event)"
    >
      Continuer
    </psh-button>
  `
})
export class ExampleComponent {
  isDisabled = false;
  isLoading = false;

  handleClick(event: MouseEvent) {
    this.isLoading = true;
    // Logique métier ici
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
```