# Info Card Component Documentation

Composant carte d'information - affiche des donnees structurees sous forme de paires label/valeur avec support complet de l'accessibilite et design responsive.

## Table des Matieres

- [Utilisation](#utilisation)
- [Utilisation de Base](#utilisation-de-base)
- [API Complete](#api-complete)
- [Slots de Contenu](#slots-de-contenu)
- [Variantes Visuelles](#variantes-visuelles)
- [Etats](#etats)
- [Comportement Responsive](#comportement-responsive)
- [Exemples Pratiques](#exemples-pratiques)
- [Accessibilite](#accessibilite)
- [Comportement de Layout](#comportement-de-layout)
- [Bonnes Pratiques](#bonnes-pratiques)

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshInfoCardComponent } from 'ps-helix';

@Component({
  imports: [PshInfoCardComponent],
})
export class MyComponent {}
```

## Utilisation de Base

### Carte d'Information Simple

```typescript
// Dans le composant
userData: InfoCardData[] = [
  { label: 'Nom', value: 'Jean Dupont' },
  { label: 'Email', value: 'jean.dupont@example.com' },
  { label: 'Telephone', value: '+33 6 12 34 56 78' }
];
```

```html
<psh-info-card
  title="Informations Utilisateur"
  [data]="userData"
  icon="user"
  variant="outlined"
></psh-info-card>
```

### Carte Interactive Cliquable

```html
<psh-info-card
  title="Details du Projet"
  [data]="projectData"
  icon="folder"
  [interactive]="true"
  [hoverable]="true"
  (clicked)="handleCardClick($event)"
></psh-info-card>
```

## API Complete

### Inputs

| Nom | Type | Defaut | Description |
|-----|------|--------|-------------|
| `title` | `string` | `''` | Titre affiche dans l'en-tete de la carte |
| `data` | `InfoCardData[]` | `[]` | Tableau de paires label/valeur a afficher |
| `options` | `InfoCardOptions` | voir ci-dessous | Options de configuration de la carte |
| `variant` | `InfoCardVariant` | `'outlined'` | Variante visuelle : `'default'` \| `'elevated'` \| `'outlined'` |
| `icon` | `string` | `'circle-dashed'` | Nom de l'icone Phosphor (sans le prefixe 'ph-') |
| `ariaLabel` | `string` | `undefined` | Label ARIA personnalise pour l'accessibilite |
| `cssClass` | `string` | `''` | Classes CSS additionnelles |
| `customStyle` | `Record<string, string>` | `{}` | Styles inline personnalises |
| `interactive` | `boolean` | `false` | Rend la carte cliquable avec cursor pointer et gestion du focus |
| `hoverable` | `boolean` | `false` | Active l'effet de survol (animation translateY) |
| `loading` | `boolean` | `false` | Etat de chargement - affiche un skeleton anime |
| `disabled` | `boolean` | `false` | Etat desactive - reduit l'opacite et bloque les interactions |
| `autoFullWidthOnMobile` | `boolean` | `true` | Active automatiquement les boutons pleine largeur sur mobile |

### Options par Defaut

```typescript
const defaultOptions: InfoCardOptions = {
  showEmptyState: true,
  emptyStateMessage: 'Aucune information disponible',
  labelWidth: undefined,
  valueWidth: undefined
};
```

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| `clicked` | `EventEmitter<MouseEvent \| KeyboardEvent>` | Emis lors du clic souris ou de l'activation clavier (Enter/Space) sur la carte (si `interactive=true` et non desactivee) |

### Signals Publics

| Nom | Type | Description |
|-----|------|-------------|
| `isMobile` | `Signal<boolean>` | Indique si le viewport est en mode mobile (<= 640px). Utilise un `ResizeObserver` pour la detection. |

### Proprietes Calculees (Computed)

| Nom | Type | Description |
|-----|------|-------------|
| `shouldShowEmptyState` | `Signal<boolean>` | Indique si l'etat vide doit etre affiche |
| `getEmptyStateMessage` | `Signal<string>` | Message a afficher dans l'etat vide |
| `titleIcon` | `Signal<string>` | Classe complete de l'icone Phosphor (avec prefixe 'ph-') |
| `computedAriaLabel` | `Signal<string>` | Label ARIA calcule automatiquement |
| `computedClasses` | `Signal<string>` | Classes CSS calculees selon les proprietes |
| `computedStyles` | `Signal<Record<string, string>>` | Styles inline fusionnes avec `customStyle` |
| `getActionsClasses` | `Signal<string>` | Classes CSS pour la zone d'actions incluant `mobile-full-width-buttons` sur mobile |

### Types TypeScript

```typescript
interface InfoCardData {
  label: string;
  value: string | number | boolean | null | undefined;
  labelWidth?: string;
  valueWidth?: string;
  customClass?: string;
}

interface InfoCardOptions {
  showEmptyState?: boolean;
  emptyStateMessage?: string;
  labelWidth?: string;
  valueWidth?: string;
}

type InfoCardVariant = 'default' | 'elevated' | 'outlined';
```

## Slots de Contenu

Le composant utilise `ng-content` avec des selecteurs pour organiser le contenu.

| Slot | Selecteur | Description | Position |
|------|-----------|-------------|----------|
| **Header Actions** | `[card-header-actions]` | Actions dans l'en-tete | En-tete de carte (a droite du titre) |
| **Actions** | `[card-actions]` | Boutons d'action | Pied de carte |

### Exemple avec Zone d'Actions Header

```html
<psh-info-card
  title="Profil Utilisateur"
  [data]="userData"
  icon="user-circle"
>
  <div card-header-actions>
    <psh-button appearance="text" size="small">
      <i class="ph ph-pencil"></i>
    </psh-button>
    <psh-button appearance="text" size="small" variant="danger">
      <i class="ph ph-trash"></i>
    </psh-button>
  </div>
</psh-info-card>
```

### Exemple avec Zone d'Actions Footer

```html
<psh-info-card
  title="Profil Utilisateur"
  [data]="userData"
  icon="user-circle"
>
  <div card-actions>
    <psh-button appearance="outline">Modifier</psh-button>
    <psh-button variant="primary">Enregistrer</psh-button>
  </div>
</psh-info-card>
```

### Exemple avec Actions Header et Footer

```html
<psh-info-card
  title="Details du Projet"
  [data]="projectData"
  icon="folder"
>
  <div card-header-actions>
    <psh-badge variant="success">Actif</psh-badge>
  </div>
  <div card-actions>
    <psh-button appearance="outline">Annuler</psh-button>
    <psh-button variant="primary">Sauvegarder</psh-button>
  </div>
</psh-info-card>
```

**Note sur le responsive :** Les boutons places dans `card-actions` deviennent automatiquement pleine largeur sur mobile (<= 640px) grace a la propriete `autoFullWidthOnMobile`. Le slot `card-header-actions` reste aligne a droite du titre sur tous les breakpoints, mais peut passer sous le titre sur mobile (<= 480px) si l'espace est insuffisant.

## Variantes Visuelles

### Outlined (Defaut)

Style avec bordure pour delimiter clairement la carte. Ideal pour les interfaces epurees.

```html
<psh-info-card
  title="Information"
  [data]="data"
  variant="outlined"
>
</psh-info-card>
```

### Elevated

Style avec ombre portee pour creer de la profondeur. Recommande pour les contenus importants.

```html
<psh-info-card
  title="Information"
  [data]="data"
  variant="elevated"
>
</psh-info-card>
```

### Default

Style minimaliste sans bordure ni ombre. Utilise pour les contenus integres.

```html
<psh-info-card
  title="Information"
  [data]="data"
  variant="default"
>
</psh-info-card>
```

## Etats

### Interactive + Hoverable

Carte cliquable avec effet de survol et support du clavier.

```html
<psh-info-card
  title="Carte Interactive"
  [data]="data"
  [interactive]="true"
  [hoverable]="true"
  (clicked)="handleCardClick($event)"
>
</psh-info-card>
```

**Comportement :**
- Cursor pointer au survol
- Animation translateY(-2px) avec hoverable
- Focusable avec tabindex="0"
- Support clavier (Enter et Space)
- Emet l'evenement `clicked` avec `MouseEvent` ou `KeyboardEvent`

### Loading

Affiche un skeleton anime pendant le chargement.

```html
<psh-info-card
  title="Chargement"
  [data]="data"
  [loading]="isLoading"
>
</psh-info-card>
```

### Disabled

Desactive la carte avec opacite reduite et interactions bloquees.

```html
<psh-info-card
  title="Carte Desactivee"
  [data]="data"
  [disabled]="true"
>
</psh-info-card>
```

### Etat Vide

Affiche un message lorsque les donnees sont vides.

```html
<psh-info-card
  title="Aucune Donnee"
  [data]="[]"
  [options]="{ showEmptyState: true, emptyStateMessage: 'Aucune information a afficher' }"
>
</psh-info-card>
```

## Comportement Responsive

Le composant s'adapte automatiquement aux differentes tailles d'ecran.

### Breakpoints

| Viewport | Comportement |
|----------|--------------|
| > 768px | Layout horizontal standard avec label a gauche et valeur a droite |
| <= 768px | Tailles de police reduites, padding ajuste |
| <= 480px | Layout vertical - label au-dessus de la valeur, boutons pleine largeur |

### Configuration Mobile

```html
<psh-info-card
  title="Information"
  [data]="data"
  [autoFullWidthOnMobile]="true"
>
  <div card-actions>
    <!-- Ces boutons seront pleine largeur sur mobile -->
    <psh-button variant="primary">Action</psh-button>
  </div>
</psh-info-card>
```

## Exemples Pratiques

### 1. Carte Profil Utilisateur

```typescript
userProfile: InfoCardData[] = [
  { label: 'Nom complet', value: 'Marie Martin' },
  { label: 'Email', value: 'marie.martin@example.com' },
  { label: 'Telephone', value: '+33 6 98 76 54 32' },
  { label: 'Departement', value: 'Ressources Humaines' },
  { label: 'Date d\'embauche', value: '15/03/2022' }
];
```

```html
<psh-info-card
  title="Profil Employe"
  [data]="userProfile"
  icon="identification-card"
  variant="elevated"
>
  <div card-actions>
    <psh-button appearance="outline">Modifier</psh-button>
    <psh-button variant="primary">Contacter</psh-button>
  </div>
</psh-info-card>
```

### 2. Carte Details Commande

```typescript
orderDetails: InfoCardData[] = [
  { label: 'Numero de commande', value: 'CMD-2025-001234' },
  { label: 'Date', value: '02/01/2025' },
  { label: 'Statut', value: 'En cours de livraison' },
  { label: 'Montant total', value: '149,99 EUR' },
  { label: 'Mode de paiement', value: 'Carte bancaire' }
];
```

```html
<psh-info-card
  title="Details de la Commande"
  [data]="orderDetails"
  icon="package"
  variant="outlined"
  [interactive]="true"
  [hoverable]="true"
  (clicked)="viewOrderDetails()"
>
</psh-info-card>
```

### 3. Carte avec Largeurs Personnalisees

```typescript
technicalSpecs: InfoCardData[] = [
  { label: 'Processeur', value: 'Intel Core i7-12700H', labelWidth: '40%' },
  { label: 'Memoire RAM', value: '32 Go DDR5', labelWidth: '40%' },
  { label: 'Stockage', value: 'SSD NVMe 1 To', labelWidth: '40%' },
  { label: 'Ecran', value: '15.6" QHD 165Hz', labelWidth: '40%' }
];
```

```html
<psh-info-card
  title="Specifications Techniques"
  [data]="technicalSpecs"
  icon="cpu"
  variant="elevated"
>
</psh-info-card>
```

### 4. Carte avec Classes Personnalisees

```typescript
statusData: InfoCardData[] = [
  { label: 'Serveur Principal', value: 'En ligne', customClass: 'status-success' },
  { label: 'Base de Donnees', value: 'En ligne', customClass: 'status-success' },
  { label: 'Service API', value: 'Maintenance', customClass: 'status-warning' },
  { label: 'CDN', value: 'Hors ligne', customClass: 'status-danger' }
];
```

```html
<psh-info-card
  title="Etat des Services"
  [data]="statusData"
  icon="activity"
  variant="outlined"
>
</psh-info-card>
```

### 5. Liste de Cartes avec Chargement

```html
@if (isLoading) {
  @for (i of [1, 2, 3]; track i) {
    <psh-info-card
      title="Chargement..."
      [loading]="true"
      icon="spinner"
    >
    </psh-info-card>
  }
} @else {
  @for (item of items; track item.id) {
    <psh-info-card
      [title]="item.title"
      [data]="item.details"
      [icon]="item.icon"
      variant="elevated"
      [interactive]="true"
      [hoverable]="true"
      (clicked)="selectItem(item)"
    >
    </psh-info-card>
  }
}
```

## Accessibilite

Le composant suit les meilleures pratiques ARIA et WCAG 2.1.

### Attributs ARIA Automatiques

- `role="region"` : Definit la carte comme une region semantique
- `role="list"` : Le conteneur de donnees est un liste
- `role="listitem"` : Chaque paire label/valeur est un element de liste
- `role="status"` + `aria-live="polite"` : L'etat vide annonce les changements aux lecteurs d'ecran
- `[attr.tabindex]="0"` : Focusable si interactive et non desactivee
- `[attr.aria-disabled]="true"` : Indique l'etat desactive
- `[attr.aria-busy]="true"` : Indique l'etat de chargement
- `[attr.aria-label]` : Label descriptif calcule automatiquement

### Navigation Clavier

Pour les cartes interactives (`interactive=true`) :

- **Tab** : Focus sur la carte
- **Enter** : Active la carte (emet `clicked`)
- **Space** : Active la carte (emet `clicked`)
- **Shift+Tab** : Focus precedent

### Recommandations

1. Toujours fournir un `title` descriptif pour les cartes d'information
2. Utiliser `ariaLabel` pour personnaliser la description si necessaire
3. S'assurer que le texte a un contraste suffisant (min 4.5:1)
4. Tester la navigation au clavier
5. Fournir un feedback visuel clair pour l'etat de focus

## Comportement de Layout

### Host Element

Le composant utilise `ViewEncapsulation.None` et definit des styles sur son element hote :

```typescript
host: {
  style: 'display: block; height: 100%;'
}
```

**Implications :**
- **display: block** : Le composant occupe toute la largeur disponible par defaut
- **height: 100%** : Le composant remplit la hauteur de son conteneur parent

### Hauteur Egale dans les Grilles

Grace a `height: 100%`, les cartes s'alignent automatiquement en hauteur dans une grille CSS :

```html
<div class="cards-grid">
  <psh-info-card title="Carte 1" [data]="data1"></psh-info-card>
  <psh-info-card title="Carte 2" [data]="data2"></psh-info-card>
  <psh-info-card title="Carte 3" [data]="data3"></psh-info-card>
</div>
```

```css
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
  gap: var(--size-4);
}
```

**Resultat :** Toutes les cartes auront la meme hauteur, determinee par la carte la plus haute de chaque ligne.

### ViewEncapsulation.None

Le composant utilise `ViewEncapsulation.None`, ce qui permet :
- Les styles du composant s'appliquent globalement
- Les styles externes peuvent facilement personnaliser l'apparence
- Les selecteurs CSS du composant ne sont pas encapsules

**Note importante :** Utilisez les classes CSS fournies (`.info-card`, `.variant-elevated`, etc.) ou les inputs (`cssClass`, `customStyle`) pour personnaliser le composant plutot que de cibler directement les elements internes.

## Bonnes Pratiques

### 1. Utilisation des Design Tokens

**A privilegier :**
```html
<psh-info-card
  [options]="{ labelWidth: 'var(--size-40)' }"
>
</psh-info-card>
```

**A eviter :**
```html
<psh-info-card
  [options]="{ labelWidth: '200px' }"
>
</psh-info-card>
```

### 2. Choix du Variant selon le Contexte

- **outlined** (defaut) : Interfaces epurees, tableaux de bord
- **elevated** : Mise en avant, informations importantes
- **default** : Integration dans un contexte existant

### 3. Cartes Interactives

Toujours combiner `interactive` et `hoverable` pour un feedback visuel clair :

```html
<psh-info-card [interactive]="true" [hoverable]="true" (clicked)="...">
```

### 4. Gestion des Valeurs Vides

Les valeurs `null` ou `undefined` affichent automatiquement "Non renseigne". Personnalisez ce comportement via les options :

```typescript
[options]="{ showEmptyState: true, emptyStateMessage: 'Aucune donnee disponible' }"
```

### 5. Performance

Le composant utilise `ChangeDetectionStrategy.OnPush` et Signals :

```typescript
// Les Signals sont trackes automatiquement
<psh-info-card
  [loading]="isLoading()"
  [data]="userData()"
>
```

### 6. Quand Utiliser Info Card vs Card

| Cas d'usage | Composant recommande |
|-------------|---------------------|
| Affichage de paires label/valeur structurees | `psh-info-card` |
| Details utilisateur, commande, produit | `psh-info-card` |
| Specifications techniques | `psh-info-card` |
| Contenu libre avec formulaires | `psh-card` |
| Notifications, alertes | `psh-card` |
| Contenu avec image laterale | `psh-horizontal-card` |

---

**Version :** 1.2
**Derniere mise a jour :** Janvier 2026
**Compatibilite :** Angular 21+
