# Toast Component Documentation

## Utilisation

### 1. Importer le Service et le Composant
```typescript
import { PshToastService, PshToastComponent } from 'ps-helix';
```

### 2. Ajouter le Conteneur de Toasts
IMPORTANT: Cette etape est OBLIGATOIRE pour que les toasts s'affichent !

```typescript
// app.component.ts
@Component({
  imports: [PshToastComponent],
  template: `
    <router-outlet />
    <psh-toast />
  `
})
export class AppComponent {}
```

### 3. Utilisation dans les Composants

```typescript
import { Component, inject } from '@angular/core';
import { PshToastService } from 'ps-helix';

@Component({
  template: `
    <button (click)="showToast()">Afficher Toast</button>
  `
})
export class ExampleComponent {
  private toastService = inject(PshToastService);

  showBasicToast() {
    this.toastService.show({
      message: 'Message direct sans traduction',
      type: 'info',
      duration: 5000
    });
  }

  showSuccessToast() {
    this.toastService.success('Operation reussie');
  }

  showWithOptions() {
    this.toastService.info('Nouveau message', {
      duration: 3000,
      icon: 'bell'
    });
  }
}
```

## API

### Service Methods

| Methode | Parametres | Retour | Description |
|---------|------------|--------|-------------|
| `show` | `Toast` | `string` | Affiche un nouveau toast et retourne son ID |
| `info` | `message: string, options?: ToastOptions` | `string` | Affiche un toast de type info |
| `success` | `message: string, options?: ToastOptions` | `string` | Affiche un toast de type success |
| `warning` | `message: string, options?: ToastOptions` | `string` | Affiche un toast de type warning |
| `error` | `message: string, options?: ToastOptions` | `string` | Affiche un toast de type danger |
| `danger` | `message: string, options?: ToastOptions` | `string` | Affiche un toast de type danger |
| `remove` | `id: string` | `void` | Supprime un toast specifique par son ID |
| `setPosition` | `ToastPosition` | `void` | Change la position d'affichage des toasts |

### Interface Toast

```typescript
interface Toast {
  id?: string;                    // Identifiant unique (auto-genere)
  message: string;                // Message a afficher
  type: ToastType;                // Type de toast
  duration?: number;              // Duree en ms (0 = persistant, defaut: 5000)
  icon?: string;                  // Icone Phosphor personnalisee
  showCloseButton?: boolean;      // Affiche/masque le bouton de fermeture
  closeButtonAriaLabel?: string;  // Label ARIA pour le bouton de fermeture
}
```

### Interface ToastConfig (Configuration Globale)

```typescript
interface ToastConfig {
  position: ToastPosition;        // Position d'affichage (defaut: 'top-right')
  duration: number;               // Duree par defaut en ms (defaut: 5000)
  maxToasts: number;              // Nombre max de toasts simultanes (defaut: 5)
  pauseOnHover: boolean;          // Pause au survol (defaut: true)
  showIcon: boolean;              // Afficher les icones (defaut: true)
  showCloseButton: boolean;       // Afficher bouton fermeture (defaut: true)
  closeButtonAriaLabel?: string;  // Label ARIA pour le bouton de fermeture
}
```

### Types

```typescript
type ToastType = 'info' | 'success' | 'warning' | 'danger';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
```

## Variantes

### Info Toast
**Description**: Toast d'information pour des messages generaux.

**Cas d'utilisation**:
- Notifications informatives
- Mises a jour du systeme
- Messages de statut

### Success Toast
**Description**: Toast de succes pour confirmer une action reussie.

**Cas d'utilisation**:
- Confirmation de soumission
- Actions completees
- Operations reussies

### Warning Toast
**Description**: Toast d'avertissement pour attirer l'attention.

**Cas d'utilisation**:
- Avertissements
- Actions necessitant attention
- Notifications importantes

### Danger Toast
**Description**: Toast d'erreur pour signaler des problemes.

**Cas d'utilisation**:
- Messages d'erreur
- Echecs d'operation
- Problemes critiques

## Configuration et Options

### Configuration Globale

```typescript
import { TOAST_CONFIG } from 'ps-helix';

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
        showCloseButton: true,
        closeButtonAriaLabel: 'Fermer la notification'
      }
    }
  ]
})
```

### Duree

- Par defaut : 5000ms
- Personnalisable via l'option `duration`
- `duration: 0` pour un toast persistant

### Position

```typescript
toastService.setPosition('top-right');
```

Positions disponibles :
- `top-right` (defaut)
- `top-left`
- `bottom-right`
- `bottom-left`

### Controle de Fermeture

| Configuration | Comportement |
|---------------|--------------|
| `duration: 5000, showCloseButton: true` | Fermeture auto + manuelle (standard) |
| `duration: 5000, showCloseButton: false` | Fermeture auto uniquement |
| `duration: 0, showCloseButton: true` | Fermeture manuelle obligatoire |

**Important**: Ne jamais creer de toast avec `duration: 0` et `showCloseButton: false` car l'utilisateur ne pourrait pas le fermer.

### Icones

- Icones par defaut selon le type
- Possibilite d'utiliser une icone personnalisee via la propriete `icon`
- Utilise les icones Phosphor

## Accessibilite

### Attributs ARIA

Les toasts utilisent les attributs ARIA suivants pour l'accessibilite :
- `role="status"` : Indique une zone de statut
- `aria-live="polite"` : Annonce le contenu sans interrompre
- `aria-atomic="true"` : Lit l'ensemble du contenu

### Navigation Clavier

- **Tab** : Navigue vers le bouton de fermeture
- **Enter/Space** : Active le bouton de fermeture
- **Escape** : Ferme le toast actif

### Bonnes Pratiques d'Accessibilite

- Utiliser des messages clairs et concis
- Assurer une duree suffisante pour la lecture (min 3 secondes)
- Maintenir un contraste suffisant (WCAG AA 4.5:1)
- Activer `pauseOnHover` pour permettre la lecture sans pression
- Fournir un `closeButtonAriaLabel` descriptif

## Bonnes Pratiques

1. **Utilisation Appropriee**
   - Limiter le nombre de toasts simultanes
   - Messages courts et concis
   - Duree adaptee au contenu
   - Utiliser le type approprie selon le contexte

2. **Quand Utiliser les Toasts**
   - Confirmations d'actions
   - Notifications non-bloquantes
   - Mises a jour de statut
   - Feedback temporaire

3. **Quand NE PAS Utiliser les Toasts**
   - Erreurs critiques bloquantes (utiliser des modales)
   - Informations permanentes (utiliser des alertes)
   - Contenu necessitant une action immediate

4. **Responsive Design**
   - S'adapte a toutes les tailles d'ecran
   - Position optimisee sur mobile
   - Gestion des longs contenus
   - Lisibilite garantie

5. **Performance**
   - Nettoyage automatique des toasts
   - Utilisation des signals pour la reactivite
   - Animations optimisees
   - Gestion efficace de la memoire

## Exemples

### Toast Simple

```typescript
import { Component, inject } from '@angular/core';
import { PshToastService } from 'ps-helix';

@Component({
  selector: 'app-example'
})
export class ExampleComponent {
  private toastService = inject(PshToastService);

  showInfo() {
    this.toastService.info('Nouvelle information disponible');
  }

  showSuccess() {
    this.toastService.success('Operation effectuee avec succes');
  }

  showWarning() {
    this.toastService.warning('Veuillez verifier avant de continuer');
  }

  showError() {
    this.toastService.error('Une erreur est survenue');
  }
}
```

### Toast avec Options

```typescript
showCustomToast() {
  this.toastService.show({
    message: 'Fichier telecharge avec succes',
    type: 'success',
    duration: 3000,
    icon: 'check-circle',
    showCloseButton: true
  });
}
```

### Toast Persistant

```typescript
showPersistentToast() {
  const toastId = this.toastService.show({
    message: 'Action requise: veuillez confirmer',
    type: 'warning',
    duration: 0,
    showCloseButton: true
  });

  // Fermer manuellement plus tard
  this.toastService.remove(toastId);
}
```

### Gestion de Processus Asynchrone

```typescript
uploadFile() {
  const toastId = this.toastService.show({
    message: 'Telechargement en cours...',
    type: 'info',
    duration: 0,
    showCloseButton: false
  });

  this.uploadService.upload().subscribe({
    next: () => {
      this.toastService.remove(toastId);
      this.toastService.success('Telechargement termine');
    },
    error: () => {
      this.toastService.remove(toastId);
      this.toastService.error('Echec du telechargement');
    }
  });
}
```

### Changer la Position

```typescript
changePosition() {
  this.toastService.setPosition('bottom-right');
  this.toastService.info('Position changee');
}
```
