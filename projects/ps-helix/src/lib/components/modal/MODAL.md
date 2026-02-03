# Modal Component Documentation

## Table des Matières
- [Utilisation](#utilisation)
- [API](#api)
- [Tailles](#tailles)
- [Options de Configuration](#options-de-configuration)
- [Content Slots](#content-slots)
- [Configuration Globale](#configuration-globale)
- [ModalService](#modalservice)
- [Variables CSS](#variables-css)
- [Accessibilité](#accessibilité)
- [Bonnes Pratiques](#bonnes-pratiques)

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshModalComponent, PshButtonComponent } from 'ps-helix';

@Component({
  imports: [PshModalComponent, PshButtonComponent],
})
```

### Utilisation de Base

```html
<psh-button (clicked)="isOpen = true">Ouvrir la modale</psh-button>

<psh-modal
  [(open)]="isOpen"
  title="Titre de la modale"
  (confirmed)="handleConfirm()"
  (closed)="handleClose()"
>
  <p>Contenu de la modale</p>
</psh-modal>
```

### Avec Footer Personnalisé

```html
<psh-modal #modal [(open)]="isOpen" title="Actions Multiples">
  <p>Choisissez une action à effectuer.</p>
  <div modal-footer #modalFooter>
    <psh-button
      appearance="text"
      [fullWidth]="modal.isMobileScreen()"
      (clicked)="isOpen = false"
    >
      Annuler
    </psh-button>
    <psh-button
      appearance="filled"
      variant="success"
      [fullWidth]="modal.isMobileScreen()"
      (clicked)="handleSave()"
    >
      Enregistrer
    </psh-button>
  </div>
</psh-modal>
```

**Important**: Le footer personnalisé nécessite l'attribut `#modalFooter` pour que la détection automatique fonctionne.

## API

### Inputs (Model & Signals)
| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| open | boolean | false | Contrôle la visibilité de la modale (two-way binding) |
| title | string | 'Modal Title' | Titre affiché dans l'en-tête |
| size | ModalSize | 'medium' | Taille de la modale ('small' \| 'medium' \| 'large') |
| showClose | boolean | true | Affiche le bouton de fermeture |
| closeOnBackdrop | boolean | true | Ferme la modale au clic sur l'arrière-plan |
| closeOnEscape | boolean | true | Ferme la modale avec la touche Échap |
| preventScroll | boolean | true | Empêche le défilement de la page |
| showFooter | boolean | true | Affiche le footer par défaut |
| dismissLabel | string | 'Close' | Label accessible pour le bouton de fermeture |
| confirmLabel | string | 'Confirm' | Label du bouton de confirmation |
| cancelLabel | string | 'Cancel' | Label du bouton d'annulation |
| styleClass | string | '' | Classes CSS personnalisées pour le conteneur |
| backdropClass | string | '' | Classes CSS personnalisées pour l'arrière-plan |

### Computed Signals (Public)
| Nom | Type | Description |
|-----|------|-------------|
| isMobileScreen | Signal\<boolean\> | Indique si l'écran est mobile (breakpoint: 768px) |
| hasCustomFooter | Signal\<boolean\> | Indique si un footer personnalisé est projeté |
| state | Signal\<string\> | État actuel de la modale ('open' ou 'closed') |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| closed | OutputEmitterRef\<void\> | Émis lorsque la modale est fermée |
| confirmed | OutputEmitterRef\<void\> | Émis lors du clic sur le bouton de confirmation |
| openChange | OutputEmitterRef\<boolean\> | Émis automatiquement lors du changement de l'état open |

### Types

```typescript
type ModalSize = 'small' | 'medium' | 'large';

interface ModalConfig {
  size: ModalSize;
  showClose: boolean;
  closeOnBackdrop: boolean;
  closeOnEscape: boolean;
  preventScroll: boolean;
  showFooter: boolean;
  dismissLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}
```

## Tailles

### Small (400px max)
Pour les confirmations simples et les messages courts.

```html
<psh-modal [(open)]="isOpen" title="Confirmation" size="small">
  <p>Êtes-vous sûr de vouloir continuer ?</p>
</psh-modal>
```

### Medium (600px max) - Par défaut
Taille équilibrée pour la majorité des cas d'usage.

```html
<psh-modal [(open)]="isOpen" title="Formulaire" size="medium">
  <form>...</form>
</psh-modal>
```

### Large (800px max)
Pour les formulaires complexes et les contenus riches.

```html
<psh-modal [(open)]="isOpen" title="Détails" size="large">
  <div class="complex-content">...</div>
</psh-modal>
```

## Options de Configuration

### Modale Persistante
Empêche la fermeture via le backdrop et la touche Échap :

```html
<psh-modal
  [(open)]="isOpen"
  title="Action Requise"
  [closeOnBackdrop]="false"
  [closeOnEscape]="false"
>
  <p>Cette action nécessite une réponse explicite.</p>
</psh-modal>
```

### Sans Bouton de Fermeture

```html
<psh-modal
  [(open)]="isOpen"
  title="Information"
  [showClose]="false"
>
  <p>Contenu</p>
</psh-modal>
```

### Sans Footer

```html
<psh-modal
  [(open)]="isOpen"
  title="Information"
  [showFooter]="false"
>
  <p>Affichage simple sans boutons d'action.</p>
</psh-modal>
```

### Classes CSS Personnalisées

```html
<psh-modal
  [(open)]="isOpen"
  title="Modale Stylisée"
  styleClass="my-custom-modal highlighted"
>
  <p>Contenu avec style personnalisé.</p>
</psh-modal>
```

### Modales Superposées

Pour gérer plusieurs modales superposées avec des z-index différents, utilisez `backdropClass` :

```html
<!-- Modale principale -->
<psh-modal [(open)]="isPrimaryOpen" title="Modale Principale">
  <p>Contenu principal</p>
  <psh-button (clicked)="isSecondaryOpen = true">Ouvrir sous-modale</psh-button>
</psh-modal>

<!-- Modale secondaire avec z-index plus élevé -->
<psh-modal
  [(open)]="isSecondaryOpen"
  title="Sous-modale"
  backdropClass="stacked-modal"
>
  <p>Cette modale apparaît au-dessus de la première.</p>
</psh-modal>
```

```css
.stacked-modal {
  z-index: calc(var(--z-index-modal-backdrop) + 10);
}

.stacked-modal .modal-container {
  z-index: calc(var(--z-index-modal-backdrop) + 11);
}
```

Vous pouvez également personnaliser l'opacité ou le flou du backdrop :

```css
.lighter-backdrop {
  --modal-backdrop-opacity: 0.3;
  --modal-backdrop-blur: 2px;
}
```

## Content Slots

### Slot par défaut
Le contenu principal projeté dans la zone scrollable.

```html
<psh-modal [(open)]="isOpen" title="Titre">
  <p>Ce contenu est projeté dans le body de la modale.</p>
</psh-modal>
```

### [modal-title]
Personnalise le titre avec du HTML ou des composants.

```html
<psh-modal [(open)]="isOpen">
  <span modal-title>
    <i class="ph ph-warning"></i>
    Titre avec icône
  </span>
  <p>Contenu</p>
</psh-modal>
```

### [modal-footer]
Remplace le footer par défaut. **Nécessite `#modalFooter`** pour la détection automatique.

```html
<psh-modal #modal [(open)]="isOpen" title="Actions">
  <p>Contenu</p>
  <div modal-footer #modalFooter>
    <psh-button [fullWidth]="modal.isMobileScreen()">Annuler</psh-button>
    <psh-button [fullWidth]="modal.isMobileScreen()">Confirmer</psh-button>
  </div>
</psh-modal>
```

## Configuration Globale

Utilisez `MODAL_CONFIG` pour définir les valeurs par défaut :

```typescript
import { MODAL_CONFIG } from 'ps-helix';

// Dans app.config.ts ou providers
providers: [
  {
    provide: MODAL_CONFIG,
    useValue: {
      size: 'medium',
      showClose: true,
      closeOnBackdrop: true,
      closeOnEscape: true,
      preventScroll: true,
      showFooter: true,
      dismissLabel: 'Fermer',
      confirmLabel: 'Confirmer',
      cancelLabel: 'Annuler'
    }
  }
]
```

## ModalService

Le service permet de gérer les instances de modales globalement.

```typescript
import { ModalService } from 'ps-helix';

@Component({ ... })
export class MyComponent {
  private modalService = inject(ModalService);

  get hasOpenModals(): boolean {
    return this.modalService.activeModalsCount() > 0;
  }

  getGlobalConfig() {
    return this.modalService.getConfig();
  }
}
```

### Membres du Service
| Membre | Type | Description |
|--------|------|-------------|
| activeModalsCount | Signal\<number\> | Nombre de modales actuellement ouvertes |
| getConfig() | Partial\<ModalConfig\> | Retourne la configuration globale |
| isRegistered(id) | boolean | Vérifie si une modale est ouverte |

## Variables CSS

Les modales utilisent des variables CSS personnalisables :

```css
:root {
  --modal-max-width-sm: 25rem;      /* 400px */
  --modal-max-width-md: 37.5rem;    /* 600px */
  --modal-max-width-lg: 50rem;      /* 800px */
  --modal-backdrop-opacity: 0.6;
  --modal-backdrop-blur: 4px;
  --modal-animation-distance: 20px;
  --modal-animation-scale: 0.95;
}
```

### Exemple de Personnalisation

```css
:root {
  --modal-backdrop-opacity: 0.8;
  --modal-backdrop-blur: 8px;
  --modal-max-width-lg: 60rem;
}
```

### Gestion du Scroll Lock

Lorsqu'une modale est ouverte avec `preventScroll="true"`, le composant :
1. Ajoute la classe `modal-open` au `<body>`
2. Définit `--scrollbar-width` pour éviter les décalages de mise en page

Assurez-vous que vos styles globaux incluent :

```css
body.modal-open {
  overflow: hidden;
  padding-right: var(--scrollbar-width);
}
```

## Accessibilité

### Attributs ARIA
Le composant génère automatiquement :
- `role="dialog"` sur le backdrop
- `aria-modal="true"` indiquant une modale
- `aria-labelledby` lié au titre
- `aria-describedby` lié au contenu
- `aria-hidden` basé sur l'état ouvert/fermé

### Focus Management
- Le focus est automatiquement déplacé sur le premier élément focusable à l'ouverture
- Le focus est restauré à l'élément précédent à la fermeture
- La navigation Tab reste confinée dans la modale (focus trap)

### Support Clavier
- **Échap** : Ferme la modale (si `closeOnEscape="true"`)
- **Tab** : Navigation entre les éléments focusables
- **Shift+Tab** : Navigation inverse
- **Entrée/Espace** : Active les boutons

## Bonnes Pratiques

### Utilisation Appropriée
1. **Confirmations critiques** : Utilisez les modales pour les actions irréversibles
2. **Formulaires focalisés** : Pour les saisies nécessitant l'attention complète
3. **Informations importantes** : Messages qui ne doivent pas être ignorés

### À Éviter
1. **Modales imbriquées** : Évitez d'ouvrir une modale depuis une autre modale
2. **Contenu trop long** : Préférez une page dédiée pour les contenus complexes
3. **Usage excessif** : Les modales interrompent le flux utilisateur

### Footer Responsive
Pour les footers personnalisés, utilisez toujours `isMobileScreen()` :

```html
<psh-modal #modal [(open)]="isOpen" title="Actions">
  <p>Contenu</p>
  <div modal-footer #modalFooter>
    <psh-button [fullWidth]="modal.isMobileScreen()">Annuler</psh-button>
    <psh-button [fullWidth]="modal.isMobileScreen()">Confirmer</psh-button>
  </div>
</psh-modal>
```

**Caractéristiques du breakpoint mobile (768px):**
- Les boutons du footer passent en pleine largeur
- L'ordre est inversé (action principale en haut)
- Espacement réduit entre les éléments

### Labels Descriptifs
- Utilisez des titres clairs et concis
- Les labels de boutons doivent décrire l'action ("Supprimer" plutôt que "OK")
- Fournissez des `dismissLabel` descriptifs pour l'accessibilité

### Hiérarchie Visuelle
- Titre clair et descriptif
- Actions principales mises en avant
- Contenu bien structuré

## Exemple Complet

```typescript
import { Component, signal } from '@angular/core';
import { PshModalComponent, PshButtonComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshModalComponent, PshButtonComponent],
  template: `
    <psh-button (clicked)="isOpen.set(true)">
      Supprimer l'élément
    </psh-button>

    <psh-modal
      #modal
      [(open)]="isOpen"
      title="Confirmer la suppression"
      size="small"
      [closeOnBackdrop]="false"
      confirmLabel="Supprimer"
      cancelLabel="Annuler"
      (confirmed)="handleDelete()"
      (closed)="handleCancel()"
    >
      <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
      <p><strong>Cette action est irréversible.</strong></p>
    </psh-modal>
  `
})
export class ExampleComponent {
  isOpen = signal(false);

  handleDelete() {
    console.log('Élément supprimé');
    this.isOpen.set(false);
  }

  handleCancel() {
    console.log('Suppression annulée');
  }
}
```
