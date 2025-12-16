# Modal Component Documentation

## Installation et Utilisation

### Installation

1. Installer le package via npm :
```bash
npm install ps-helix
```

2. Importer le composant dans votre module ou composant standalone :
```typescript
import { LibModalComponent } from 'ps-helix';

@Component({
  // ...
  imports: [LibModalComponent],
  // ...
})
```

### Utilisation de Base

```typescript
@Component({
  template: `
    <!-- Modal basique -->
    <lib-modal
      [(open)]="isOpen"
      title="MODAL.TITLE"
      (confirmed)="handleConfirm()"
    >
      Contenu de la modale
    </lib-modal>

    <!-- Modal avec footer personnalisé -->
    <lib-modal #modal [(open)]="isOpen">
      Contenu de la modale
      <div modal-footer>
        <lib-button variant="text" [fullWidth]="modal.isMobileScreen()" (clicked)="handleCancel()">
          {{ 'MODAL.CANCEL' | translate }}
        </lib-button>
        <lib-button variant="primary" [fullWidth]="modal.isMobileScreen()" (clicked)="handleConfirm()">
          {{ 'MODAL.CONFIRM' | translate }}
        </lib-button>
      </div>
    </lib-modal>
  `
})
export class ExampleComponent {
  isOpen = false;

  handleConfirm() {
    console.log('Modal confirmed');
    this.isOpen = false;
  }
}
```

### Footer Personnalisé et Responsive Design

Le composant Modal gère automatiquement la responsivité des boutons du footer par défaut. Pour les footers personnalisés, vous devez utiliser le signal `isMobileScreen()` pour obtenir le même comportement.

#### Breakpoint Mobile
Le breakpoint mobile est défini à **768px**. En dessous de cette largeur, les boutons doivent être affichés en pleine largeur.

#### Exemple avec Footer Personnalisé Responsive

```typescript
@Component({
  template: `
    <!-- Utilisez #modal pour obtenir une référence au composant -->
    <lib-modal #modal [(open)]="isOpen" title="Mon Modal">
      <p>Contenu de la modale</p>

      <div modal-footer>
        <!-- Utilisez modal.isMobileScreen() pour rendre les boutons responsive -->
        <lib-button
          appearance="text"
          [fullWidth]="modal.isMobileScreen()"
          (clicked)="isOpen = false"
        >
          Annuler
        </lib-button>

        <lib-button
          appearance="filled"
          variant="primary"
          [fullWidth]="modal.isMobileScreen()"
          (clicked)="handleSave()"
        >
          Enregistrer
        </lib-button>

        <lib-button
          appearance="filled"
          variant="success"
          [fullWidth]="modal.isMobileScreen()"
          (clicked)="handlePublish()"
        >
          Publier
        </lib-button>
      </div>
    </lib-modal>
  `
})
```

#### Signal Public `isMobileScreen()`

Le signal `isMobileScreen()` est un computed signal public qui retourne `true` lorsque la largeur de l'écran est inférieure à 768px.

**Caractéristiques:**
- Type: `Signal<boolean>`
- Valeur: `true` si largeur < 768px, `false` sinon
- Mise à jour automatique lors du redimensionnement de la fenêtre
- Disponible via une référence template (`#modal`)

### API

#### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| open | boolean | false | État d'ouverture |
| size | ModalSize | 'medium' | Taille de la modale |

#### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| title | string | '' | Titre de la modale |
| showClose | boolean | true | Affiche le bouton de fermeture |
| closeOnBackdrop | boolean | true | Ferme au clic sur l'arrière-plan |
| closeOnEscape | boolean | true | Ferme avec la touche Échap |
| preventScroll | boolean | true | Empêche le scroll de la page |
| showFooter | boolean | true | Affiche le footer |
| dismissLabel | string | 'MODAL.CLOSE' | Label du bouton de fermeture |
| confirmLabel | string | 'MODAL.CONFIRM' | Label du bouton de confirmation |
| cancelLabel | string | 'MODAL.CANCEL' | Label du bouton d'annulation |

#### Computed Signals (Public)
| Nom | Type | Description |
|-----|------|-------------|
| isMobileScreen | Signal<boolean> | Indique si l'écran est de taille mobile (< 768px) |
| hasCustomFooter | Signal<boolean> | Indique si un footer personnalisé est projeté |
| state | Signal<string> | État actuel de la modale ('open' ou 'closed') |

#### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| closed | EventEmitter<void> | Émis à la fermeture |
| confirmed | EventEmitter<void> | Émis à la confirmation |

### Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: MODAL_CONFIG,
      useValue: {
        size: 'medium',
        showClose: true,
        closeOnBackdrop: true,
        closeOnEscape: true,
        preventScroll: true,
        showFooter: true
      }
    },
    {
      provide: MODAL_STYLES,
      useValue: {
        'custom-modal': {
          borderWidth: '2px'
        }
      },
      multi: true
    }
  ]
})
```

## États et Modificateurs

### Tailles
- `small`: Pour les messages courts
- `medium`: Taille par défaut
- `large`: Pour plus de contenu

### États
- `open`: État d'ouverture
- `loading`: État de chargement
- `disabled`: État désactivé

## Accessibilité

### Attributs ARIA
- `role="dialog"`: Rôle de dialogue
- `aria-modal="true"`: Indique une modale
- `aria-labelledby`: Lien vers le titre
- `aria-hidden`: État de visibilité

### Bonnes Pratiques
- Focus piégé dans la modale
- Retour au focus précédent
- Support de la touche Échap
- Labels traduits

## Bonnes Pratiques

1. **Hiérarchie Visuelle**
   - Titre clair et descriptif
   - Actions principales mises en avant
   - Contenu bien structuré

2. **Accessibilité**
   - Labels descriptifs
   - Support du clavier
   - États ARIA appropriés

3. **Performance**
   - Gestion efficace du scroll
   - Détection de changements OnPush
   - Nettoyage des ressources

4. **Internationalisation**
   - Labels traduits
   - Messages d'erreur traduits
   - Support RTL/LTR

5. **Footer Personnalisé**
   - Toujours utiliser une référence template (`#modal`) pour accéder au composant
   - Appliquer `[fullWidth]="modal.isMobileScreen()"` sur tous les boutons pour une expérience responsive cohérente
   - Maintenir l'ordre des boutons cohérent avec les conventions (annuler à gauche, actions principales à droite)
   - Sur mobile, les boutons sont automatiquement affichés en colonne inversée (action principale en haut)
   - Limiter le nombre de boutons à 3 maximum pour une meilleure lisibilité