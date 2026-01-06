# Horizontal Card Component Documentation

Composant carte horizontale - layout avec contenu lateral et principal, parfait pour les cartes produits, profils utilisateurs et articles avec illustration.

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
- [Bonnes Pratiques](#bonnes-pratiques)

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshHorizontalCardComponent } from 'ps-helix';

@Component({
  imports: [PshHorizontalCardComponent],
})
export class MyComponent {}
```

## Utilisation de Base

### Carte Produit Simple

```html
<psh-horizontal-card variant="elevated" sideWidth="var(--size-40)">
  <div horizontal-side>
    <img src="product.jpg" alt="Product image">
  </div>
  <div horizontal-header>
    <h4>Nom du Produit</h4>
  </div>
  <p>Description du produit avec les details importants.</p>
  <div horizontal-actions>
    <psh-button variant="primary">Acheter</psh-button>
  </div>
</psh-horizontal-card>
```

### Carte Interactive avec Effet de Survol

```html
<psh-horizontal-card
  variant="elevated"
  [interactive]="true"
  [hoverable]="true"
  (clicked)="handleCardClick($event)"
>
  <div horizontal-side>
    <img src="image.jpg" alt="Illustration">
  </div>
  <div horizontal-header>
    <h4>Carte Cliquable</h4>
  </div>
  <p>Cliquez sur cette carte pour interagir</p>
</psh-horizontal-card>
```

## API Complete

### Inputs

| Nom | Type | Defaut | Description |
|-----|------|--------|-------------|
| `variant` | `HorizontalCardVariant` | `'elevated'` | Variante visuelle : `'default'` \| `'elevated'` \| `'outlined'` |
| `interactive` | `boolean` | `false` | Rend la carte cliquable avec cursor pointer et gestion du focus |
| `hoverable` | `boolean` | `false` | Active l'effet de survol (animation translateY) |
| `loading` | `boolean` | `false` | Etat de chargement - affiche un skeleton anime |
| `disabled` | `boolean` | `false` | Etat desactive - reduit l'opacite et bloque les interactions |
| `sideWidth` | `string` | `'var(--size-48)'` | Largeur du contenu lateral (utiliser les design tokens) |
| `gap` | `string` | `'var(--spacing-md)'` | Espacement entre le contenu lateral et principal |
| `sidePadding` | `string` | `'0'` | Padding du contenu lateral |
| `contentPadding` | `string` | `'var(--spacing-md)'` | Padding du contenu principal |
| `mobileHeight` | `string` | `'var(--size-48)'` | Hauteur du contenu lateral sur mobile |
| `cssClass` | `string` | `''` | Classes CSS additionnelles |
| `customStyle` | `Record<string, string>` | `{}` | Styles inline personnalises |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| `clicked` | `EventEmitter<MouseEvent \| KeyboardEvent>` | Emis lors du clic souris ou de l'activation clavier (Enter/Space) sur la carte (si `interactive=true` et non desactivee) |

### Proprietes Calculees (Computed)

| Nom | Type | Description |
|-----|------|-------------|
| `computedClasses` | `Signal<string>` | Classes CSS calculees selon les proprietes (variant, hoverable, interactive, etats) |
| `computedStyles` | `Signal<Record<string, string>>` | Variables CSS personnalisees pour le layout |

### Types TypeScript

```typescript
type HorizontalCardVariant = 'default' | 'elevated' | 'outlined';

interface HorizontalCardOptions {
  sideWidth?: string;
  gap?: string;
  sidePadding?: string;
  contentPadding?: string;
  mobileHeight?: string;
}
```

## Slots de Contenu

Le composant utilise `ng-content` avec des selecteurs pour organiser le contenu.

| Slot | Selecteur | Description | Position |
|------|-----------|-------------|----------|
| **Side** | `[horizontal-side]` | Contenu lateral (image, avatar, icone) | Gauche (desktop) / Haut (mobile) |
| **Header** | `[horizontal-header]` | En-tete avec titre et badges | Haut du contenu principal |
| **Body** | (defaut) | Contenu principal de la carte | Centre du contenu principal |
| **Actions** | `[horizontal-actions]` | Boutons d'action | Bas du contenu principal |

### Exemple Complet avec Tous les Slots

```html
<psh-horizontal-card
  variant="elevated"
  [hoverable]="true"
  sideWidth="var(--size-40)"
  gap="var(--spacing-lg)"
>
  <!-- Contenu lateral -->
  <div horizontal-side>
    <img src="product.jpg" alt="Photo du produit">
  </div>

  <!-- En-tete -->
  <div horizontal-header>
    <div class="header-row">
      <h4>Produit Premium</h4>
      <psh-tag variant="success">En stock</psh-tag>
    </div>
  </div>

  <!-- Contenu principal -->
  <p>Description detaillee du produit avec toutes les informations necessaires.</p>
  <div class="meta">
    <span>Categorie: Electronique</span>
    <span>Prix: 149,99 EUR</span>
  </div>

  <!-- Actions -->
  <div horizontal-actions>
    <psh-button variant="primary">Acheter</psh-button>
    <psh-button appearance="outline">Details</psh-button>
  </div>
</psh-horizontal-card>
```

## Variantes Visuelles

### Elevated (Defaut)

Style avec ombre portee pour creer de la profondeur. Recommande pour les contenus importants.

```html
<psh-horizontal-card variant="elevated">
  <div horizontal-side>
    <img src="image.jpg" alt="Image">
  </div>
  <div horizontal-header>
    <h4>Carte Elevated</h4>
  </div>
  <p>Ombre douce pour mise en avant</p>
</psh-horizontal-card>
```

### Outlined

Style avec bordure pour delimiter clairement la carte. Ideal pour les interfaces epurees.

```html
<psh-horizontal-card variant="outlined">
  <div horizontal-side>
    <img src="image.jpg" alt="Image">
  </div>
  <div horizontal-header>
    <h4>Carte Outlined</h4>
  </div>
  <p>Bordure subtile pour definition claire</p>
</psh-horizontal-card>
```

### Default

Style minimaliste sans bordure ni ombre. Utilise pour les contenus integres.

```html
<psh-horizontal-card variant="default">
  <div horizontal-side>
    <img src="image.jpg" alt="Image">
  </div>
  <div horizontal-header>
    <h4>Carte Default</h4>
  </div>
  <p>Style minimaliste sans effets visuels</p>
</psh-horizontal-card>
```

## Etats

### Interactive + Hoverable

Carte cliquable avec effet de survol et support du clavier.

```html
<psh-horizontal-card
  [interactive]="true"
  [hoverable]="true"
  (clicked)="handleCardClick($event)"
>
  <div horizontal-side>
    <img src="image.jpg" alt="Image">
  </div>
  <div horizontal-header>
    <h4>Carte Interactive</h4>
  </div>
  <p>Cliquez ou appuyez sur Entree/Espace</p>
</psh-horizontal-card>
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
<psh-horizontal-card [loading]="isLoading">
  <div horizontal-side>
    <img src="image.jpg" alt="Image">
  </div>
  <div horizontal-header>
    <h4>Titre</h4>
  </div>
  <p>Ce contenu ne sera pas visible pendant le chargement</p>
</psh-horizontal-card>
```

### Disabled

Desactive la carte avec opacite reduite et interactions bloquees.

```html
<psh-horizontal-card
  [disabled]="true"
  [interactive]="true"
>
  <div horizontal-side>
    <img src="image.jpg" alt="Image">
  </div>
  <div horizontal-header>
    <h4>Carte Desactivee</h4>
  </div>
  <p>Cette carte est desactivee</p>
</psh-horizontal-card>
```

## Comportement Responsive

Le composant bascule automatiquement en layout vertical sur les petits ecrans.

### Breakpoints

| Viewport | Layout | Comportement |
|----------|--------|--------------|
| > 48em (768px) | Horizontal | Contenu lateral a gauche, contenu principal a droite |
| <= 48em (768px) | Vertical | Contenu lateral en haut avec hauteur `mobileHeight` |
| <= 30em (480px) | Vertical compact | Padding reduit, boutons en pleine largeur |

### Configuration Mobile

```html
<psh-horizontal-card
  sideWidth="var(--size-40)"
  mobileHeight="var(--size-48)"
>
  <!-- La hauteur du contenu lateral sur mobile sera var(--size-48) -->
</psh-horizontal-card>
```

## Exemples Pratiques

### 1. Carte Produit E-commerce

```html
<psh-horizontal-card
  variant="elevated"
  [interactive]="true"
  [hoverable]="true"
  sideWidth="var(--size-40)"
  (clicked)="viewProduct(product)"
>
  <div horizontal-side>
    <img [src]="product.image" [alt]="product.name">
  </div>
  <div horizontal-header>
    <div class="product-header">
      <h4>{{ product.name }}</h4>
      <psh-tag [variant]="product.inStock ? 'success' : 'warning'">
        {{ product.inStock ? 'En stock' : 'Rupture' }}
      </psh-tag>
    </div>
  </div>
  <p class="product-description">{{ product.description }}</p>
  <div class="product-meta">
    <span class="category">{{ product.category }}</span>
    <span class="price">{{ product.price | currency:'EUR' }}</span>
  </div>
  <div horizontal-actions>
    <psh-button variant="primary">Acheter</psh-button>
    <psh-button appearance="outline">Details</psh-button>
  </div>
</psh-horizontal-card>
```

### 2. Carte Profil Utilisateur

```html
<psh-horizontal-card
  variant="outlined"
  [interactive]="true"
  [hoverable]="true"
  sideWidth="var(--size-32)"
  gap="var(--spacing-lg)"
  (clicked)="viewProfile(user)"
>
  <div horizontal-side>
    <div class="avatar-wrapper">
      <psh-avatar [initials]="user.initials" size="xlarge"></psh-avatar>
    </div>
  </div>
  <div horizontal-header>
    <div class="user-header">
      <h4>{{ user.name }}</h4>
      <psh-tag [variant]="user.isActive ? 'success' : 'secondary'">
        {{ user.isActive ? 'Actif' : 'Inactif' }}
      </psh-tag>
    </div>
  </div>
  <p class="user-role">{{ user.role }}</p>
  <div class="user-meta">
    <div class="info-item">
      <i class="ph ph-envelope"></i>
      <span>{{ user.email }}</span>
    </div>
    <div class="info-item">
      <i class="ph ph-map-pin"></i>
      <span>{{ user.location }}</span>
    </div>
  </div>
  <div horizontal-actions>
    <psh-button variant="primary">Contacter</psh-button>
    <psh-button appearance="text">Voir profil</psh-button>
  </div>
</psh-horizontal-card>
```

### 3. Carte Article Blog

```html
<psh-horizontal-card
  variant="elevated"
  [interactive]="true"
  [hoverable]="true"
  sideWidth="var(--size-48)"
  gap="var(--spacing-lg)"
  (clicked)="readArticle(article)"
>
  <div horizontal-side>
    <img [src]="article.coverImage" [alt]="article.title">
  </div>
  <div horizontal-header>
    <psh-tag variant="primary" size="small">{{ article.category }}</psh-tag>
  </div>
  <h4 class="article-title">{{ article.title }}</h4>
  <p class="article-excerpt">{{ article.excerpt }}</p>
  <div class="article-meta">
    <span class="date">
      <i class="ph ph-calendar"></i>
      {{ article.date | date:'dd MMM yyyy' }}
    </span>
    <span class="read-time">
      <i class="ph ph-clock"></i>
      {{ article.readTime }} min de lecture
    </span>
  </div>
  <div horizontal-actions>
    <psh-button variant="primary">Lire l'article</psh-button>
    <psh-button appearance="text">Partager</psh-button>
  </div>
</psh-horizontal-card>
```

### 4. Liste de Cartes avec Chargement

```html
@if (isLoading) {
  @for (i of [1, 2, 3]; track i) {
    <psh-horizontal-card [loading]="true" sideWidth="var(--size-40)">
    </psh-horizontal-card>
  }
} @else {
  @for (item of items; track item.id) {
    <psh-horizontal-card
      variant="elevated"
      [interactive]="true"
      [hoverable]="true"
      sideWidth="var(--size-40)"
      (clicked)="selectItem(item)"
    >
      <div horizontal-side>
        <img [src]="item.image" [alt]="item.title">
      </div>
      <div horizontal-header>
        <h4>{{ item.title }}</h4>
      </div>
      <p>{{ item.description }}</p>
    </psh-horizontal-card>
  }
}
```

## Accessibilite

Le composant suit les meilleures pratiques ARIA et WCAG 2.1.

### Attributs ARIA Automatiques

- `role="article"` : Definit la carte comme un article semantique
- `[attr.tabindex]="0"` : Focusable si interactive et non desactivee
- `[attr.aria-disabled]="true"` : Indique l'etat desactive
- `[attr.aria-busy]="true"` : Indique l'etat de chargement

### Navigation Clavier

Pour les cartes interactives (`interactive=true`) :

- **Tab** : Focus sur la carte
- **Enter** : Active la carte (emet `clicked`)
- **Space** : Active la carte (emet `clicked`)
- **Shift+Tab** : Focus precedent

### Recommandations

1. Toujours fournir un texte alternatif (`alt`) pour les images dans `horizontal-side`
2. Utiliser des titres semantiques (`h3`, `h4`) dans `horizontal-header`
3. S'assurer que le texte a un contraste suffisant (min 4.5:1)
4. Tester la navigation au clavier
5. Fournir un feedback visuel clair pour l'etat de focus

## Bonnes Pratiques

### 1. Utilisation des Design Tokens

**A privilegier :**
```html
<psh-horizontal-card
  sideWidth="var(--size-40)"
  gap="var(--spacing-lg)"
  contentPadding="var(--spacing-md)"
>
```

**A eviter :**
```html
<psh-horizontal-card
  sideWidth="200px"
  gap="24px"
  contentPadding="16px"
>
```

### 2. Choix de la Largeur Laterale

- **var(--size-32)** : Avatars, petites icones
- **var(--size-40)** : Images produits, illustrations moyennes
- **var(--size-48)** : Images d'articles, grandes illustrations

### 3. Cartes Interactives

Toujours combiner `interactive` et `hoverable` pour un feedback visuel clair :

```html
<psh-horizontal-card [interactive]="true" [hoverable]="true" (clicked)="...">
```

### 4. Contenu Lateral

- Privilegier des contenus visuels carres ou avec ratio 1:1
- Utiliser `object-fit: cover` pour les images (applique automatiquement)
- Pour les avatars, centrer le contenu dans le slot

### 5. Actions

- Limiter a 2-3 boutons maximum dans `horizontal-actions`
- Placer l'action principale en premier
- Utiliser des variantes de boutons coherentes (primary + outline/text)

### 6. Performance

Le composant utilise `ChangeDetectionStrategy.OnPush` :

```typescript
// Les inputs signals sont trackes automatiquement
<psh-horizontal-card
  [loading]="isLoading()"
  [variant]="cardVariant()"
>
```

### 7. Quand Utiliser Horizontal Card vs Card

| Cas d'usage | Composant recommande |
|-------------|---------------------|
| Contenu avec image laterale importante | `psh-horizontal-card` |
| Produits, profils, articles | `psh-horizontal-card` |
| Contenu principalement textuel | `psh-card` |
| Formulaires, notifications | `psh-card` |
| Tableaux de bord, statistiques | `psh-card` |

---

**Version :** 1.0
**Derniere mise a jour :** Decembre 2025
**Compatibilite :** Angular 20+
