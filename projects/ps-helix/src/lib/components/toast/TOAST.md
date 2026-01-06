# Toast Component Documentation

## Utilisation

### 1. Importer le Service et le Composant
```typescript
import { ToastService, ToastComponent } from 'ps-helix';
```

### 2. Ajouter le Conteneur de Toasts
IMPORTANT: Cette etape est OBLIGATOIRE pour que les toasts s'affichent !

```typescript
// app.component.html
<psh-toast></psh-toast>
```

### 3. Utilisation dans les Composants

```typescript
@Component({
  template: `
    <button (click)="showToast()">Afficher Toast</button>
  `
})
export class ExampleComponent {
  constructor(private toastService: ToastService) {}

  // Toast basique sans traduction
  showBasicToast() {
    this.toastService.show({
      message: 'Message direct sans traduction',
      type: 'info',
      duration: 5000
    });
  }

  // Toast avec traduction
  showTranslatedToast() {
    this.toastService.show({
      message: 'TOAST.SUCCESS',  // Clé de traduction
      type: 'success',
      duration: 3000
    });
  }
}
```

## API

### Service Methods
| Nom | Paramètres | Description |
|-----|------------|-------------|
| show | Toast | Affiche un nouveau toast |
| remove | id: string | Supprime un toast spécifique |
| setPosition | ToastPosition | Change la position des toasts |

### Interface Toast
```typescript
interface Toast {
  message: string;     // Message à afficher (direct ou clé de traduction)
  type: ToastType;     // Type de toast
  duration?: number;   // Durée en ms (0 = persistant)
  icon?: string;      // Icône Phosphor
}
```

### Types
```typescript
type ToastType = 'info' | 'success' | 'warning' | 'danger';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
```

## Variants Overview

### Info Toast
**Description**: Toast d'information pour des messages généraux.

**Cas d'utilisation**:
- Notifications informatives
- Mises à jour du système
- Messages de statut

### Success Toast
**Description**: Toast de succès pour confirmer une action réussie.

**Cas d'utilisation**:
- Confirmation de soumission
- Actions complétées
- Opérations réussies

### Warning Toast
**Description**: Toast d'avertissement pour attirer l'attention.

**Cas d'utilisation**:
- Avertissements
- Actions nécessitant attention
- Notifications importantes

### Danger Toast
**Description**: Toast d'erreur pour signaler des problèmes.

**Cas d'utilisation**:
- Messages d'erreur
- Échecs d'opération
- Problèmes critiques

## Configuration et Options

### Configuration Globale
```typescript
@Component({
  providers: [
    {
      provide: TOAST_CONFIG,
      useValue: {
        position: 'top-right',
        duration: 5000,
        maxToasts: 5,
        pauseOnHover: true,
        showIcon: true,
        showCloseButton: true
      }
    }
  ]
})
```

### Durée
- Par défaut : 5000ms
- Personnalisable via l'option `duration`
- `duration: 0` pour un toast persistant

### Position
```typescript
// Changer la position des toasts
toastService.setPosition('top-right');
```

Positions disponibles :
- `top-right` (défaut)
- `top-left`
- `bottom-right`
- `bottom-left`

### Icônes
- Icônes par défaut selon le type
- Possibilité d'utiliser une icône personnalisée
- Utilise les icônes Phosphor

## Bonnes Pratiques

1. **Utilisation Appropriée**
   - Limiter le nombre de toasts simultanés
   - Messages courts et concis
   - Durée adaptée au contenu
   - Utiliser le type approprié selon le contexte

2. **Accessibilité**
   - Rôles ARIA appropriés
   - Support des lecteurs d'écran
   - Contraste suffisant
   - Durée d'affichage suffisante

3. **Responsive Design**
   - S'adapte à toutes les tailles d'écran
   - Position optimisée sur mobile
   - Gestion des longs contenus
   - Lisibilité garantie

4. **Performance**
   - Nettoyage automatique des toasts
   - Utilisation des signals pour la réactivité
   - Animations optimisées
   - Gestion efficace de la mémoire

5. **Internationalisation**
   - Support des messages directs et traduits
   - Traductions cohérentes
   - Support RTL/LTR
   - Messages adaptés au contexte culturel

## Exemple Complet

```typescript
import { Component } from '@angular/core';
import { ToastService } from 'ps-helix';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-toast-demo',
  template: `
    <!-- Toast basique sans traduction -->
    <button (click)="showBasicToast()">Toast Basique</button>

    <!-- Toast avec traduction -->
    <button (click)="showTranslatedToast()">Toast Traduit</button>

    <!-- Toast personnalisé -->
    <button (click)="showCustomToast()">Toast Personnalisé</button>

    <!-- Toast persistant -->
    <button (click)="showPersistentToast()">Toast Persistant</button>

    <!-- Changer la position -->
    <button (click)="changePosition('top-left')">Changer Position</button>
  `
})
export class ToastDemoComponent {
  constructor(
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  showBasicToast() {
    this.toastService.show({
      message: 'Ceci est un message direct',
      type: 'info'
    });
  }

  showTranslatedToast() {
    const message = this.translateService.instant('TOAST.SUCCESS');
    this.toastService.show({
      message,
      type: 'success',
      duration: 3000
    });
  }

  showCustomToast() {
    const message = this.translateService.instant('TOAST.CUSTOM');
    this.toastService.show({
      message,
      type: 'info',
      icon: 'bell',
      duration: 5000
    });
  }

  showPersistentToast() {
    const message = this.translateService.instant('TOAST.PERSISTENT');
    this.toastService.show({
      message,
      type: 'warning',
      duration: 0
    });
  }

  changePosition(position: ToastPosition) {
    this.toastService.setPosition(position);
  }
}
```