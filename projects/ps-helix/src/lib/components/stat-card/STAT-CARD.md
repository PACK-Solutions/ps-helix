# Stat Card Component Documentation

Composant carte statistique - affichage compact de metriques cles avec icone, valeur, description et indicateur d'evolution optionnel.

## Table des Matieres

- [Utilisation](#utilisation)
- [Utilisation de Base](#utilisation-de-base)
- [API Complete](#api-complete)
- [Variantes Visuelles](#variantes-visuelles)
- [Dispositions](#dispositions)
- [Tag d'Evolution](#tag-devolution)
- [Etats](#etats)
- [Exemples Pratiques](#exemples-pratiques)
- [Accessibilite](#accessibilite)
- [Personnalisation CSS](#personnalisation-css)
- [Bonnes Pratiques](#bonnes-pratiques)

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshStatCardComponent } from 'ps-helix';

@Component({
  imports: [PshStatCardComponent],
})
export class MyComponent {}
```

> **Note**: Le composant utilise la bibliotheque Phosphor Icons pour les icones. Assurez-vous que `@phosphor-icons/web` est installe et configure.

## Utilisation de Base

### Carte Statistique Simple

```html
<psh-stat-card
  value="1,234"
  description="Utilisateurs actifs"
  icon="users"
>
</psh-stat-card>
```

### Carte avec Indicateur d'Evolution

```html
<psh-stat-card
  value="12,847"
  description="Revenus mensuels"
  icon="currency-eur"
  tagVariant="success"
  tagLabel="+12.6%"
>
</psh-stat-card>
```

### Carte Interactive Cliquable

```html
<psh-stat-card
  value="156"
  description="Commandes en attente"
  icon="shopping-cart"
  [interactive]="true"
  [hoverable]="true"
  (clicked)="openOrdersPanel()"
>
</psh-stat-card>
```

## API Complete

### Inputs Principaux

| Nom | Type | Defaut | Description |
|-----|------|--------|-------------|
| `value` | `string \| number` | `undefined` | Valeur principale de la statistique (nombre ou texte formate) |
| `description` | `string` | `undefined` | Description de la statistique |
| `icon` | `string` | `undefined` | Nom de l'icone Phosphor (sans le prefixe 'ph-') |

### Inputs de Tag

| Nom | Type | Defaut | Description |
|-----|------|--------|-------------|
| `tagVariant` | `StatTagVariant` | `undefined` | Variante du tag d'evolution : `'success'` \| `'danger'` \| `'warning'` \| `'primary'` |
| `tagLabel` | `string` | `undefined` | Label du tag d'evolution (ex: '+12.6%', '-8.1%') |

### Inputs de Style

| Nom | Type | Defaut | Description |
|-----|------|--------|-------------|
| `variant` | `StatCardVariant` | `'elevated'` | Variante visuelle : `'default'` \| `'elevated'` \| `'outlined'` |
| `iconBackground` | `string` | Auto | Couleur de fond personnalisee pour l'icone (CSS gradient ou couleur). Par defaut, utilise un gradient base sur `tagVariant` |
| `cssClass` | `string` | `''` | Classes CSS additionnelles |
| `customStyle` | `Record<string, string>` | `{}` | Styles inline personnalises |

### Inputs de Disposition

| Nom | Type | Defaut | Description |
|-----|------|--------|-------------|
| `layout` | `StatCardLayout` | `'horizontal'` | Disposition : `'horizontal'` (icone a gauche) \| `'vertical'` (icone en haut) |
| `rowDirection` | `boolean` | `false` | Active la direction row pour le card-body (maintient l'alignement horizontal sur mobile) |

### Inputs d'Etat

| Nom | Type | Defaut | Description |
|-----|------|--------|-------------|
| `interactive` | `boolean` | `false` | Rend la carte cliquable avec cursor pointer et gestion du focus |
| `hoverable` | `boolean` | `false` | Active l'effet de survol (animation translateY) |
| `loading` | `boolean` | `false` | Etat de chargement - affiche un skeleton anime |
| `disabled` | `boolean` | `false` | Etat desactive - reduit l'opacite et bloque les interactions |

### Inputs d'Accessibilite

| Nom | Type | Defaut | Description |
|-----|------|--------|-------------|
| `ariaLabel` | `string` | Auto | Label ARIA personnalise. Par defaut genere automatiquement depuis `description` et `value` |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| `clicked` | `OutputEmitterRef<MouseEvent \| KeyboardEvent>` | Emis lors du clic souris ou de l'activation clavier (Enter/Space) sur la carte (si `interactive=true` et non desactivee) |

### Types TypeScript

```typescript
type StatTagVariant = 'success' | 'danger' | 'warning' | 'primary';

type StatCardLayout = 'horizontal' | 'vertical';

type StatCardVariant = 'default' | 'elevated' | 'outlined';
```

### Computed Signals

| Nom | Type | Description |
|-----|------|-------------|
| `hasTag` | `Signal<boolean>` | Indique si un tag doit etre affiche (tagVariant ET tagLabel definis) |
| `hasIcon` | `Signal<boolean>` | Indique si une icone doit etre affichee |
| `iconStyle` | `Signal<object \| null>` | Style de l'icone avec gradient de fond |
| `computedClasses` | `Signal<string>` | Classes CSS calculees selon les proprietes |
| `computedAriaLabel` | `Signal<string>` | Label ARIA genere automatiquement |

## Variantes Visuelles

### Elevated (Defaut)

Style avec ombre portee pour creer de la profondeur.

```html
<psh-stat-card
  variant="elevated"
  value="2,456"
  description="Visiteurs"
  icon="eye"
>
</psh-stat-card>
```

### Outlined

Style avec bordure pour delimiter clairement la carte.

```html
<psh-stat-card
  variant="outlined"
  value="89%"
  description="Taux de satisfaction"
  icon="smiley"
>
</psh-stat-card>
```

### Default

Style de base sans bordure ni ombre - fond neutre.

```html
<psh-stat-card
  variant="default"
  value="42"
  description="Projets actifs"
  icon="folder-open"
>
</psh-stat-card>
```

## Dispositions

### Horizontal (Defaut)

Icone a gauche, contenu a droite. S'adapte en vertical sur mobile (< 480px).

```html
<psh-stat-card
  layout="horizontal"
  value="1,234"
  description="Utilisateurs"
  icon="users"
>
</psh-stat-card>
```

### Vertical

Icone en haut, contenu centre en dessous.

```html
<psh-stat-card
  layout="vertical"
  value="99.9%"
  description="Disponibilite"
  icon="check-circle"
>
</psh-stat-card>
```

### Row Direction

Maintient l'alignement horizontal meme sur mobile (utile pour les grilles de dashboard).

```html
<psh-stat-card
  [rowDirection]="true"
  value="567"
  description="Taches completees"
  icon="check-square"
>
</psh-stat-card>
```

## Tag d'Evolution

Le tag affiche un indicateur d'evolution avec une couleur semantique. La couleur de fond de l'icone s'adapte automatiquement a la variante du tag.

### Gradients par Defaut

| Variante | Gradient | Utilisation |
|----------|----------|-------------|
| `success` | Vert (#34D399 → #059669) | Evolution positive, objectif atteint |
| `danger` | Rouge (#F87171 → #DC2626) | Evolution negative, alerte |
| `warning` | Orange (#FBBF24 → #D97706) | Attention requise |
| `primary` | Bleu (#60A5FA → #2563EB) | Information neutre |

### Exemples

```html
<!-- Evolution positive -->
<psh-stat-card
  value="45,230"
  description="Chiffre d'affaires"
  icon="chart-line-up"
  tagVariant="success"
  tagLabel="+23.5%"
>
</psh-stat-card>

<!-- Evolution negative -->
<psh-stat-card
  value="127"
  description="Tickets ouverts"
  icon="ticket"
  tagVariant="danger"
  tagLabel="+15"
>
</psh-stat-card>

<!-- Attention -->
<psh-stat-card
  value="3"
  description="Jours restants"
  icon="calendar"
  tagVariant="warning"
  tagLabel="Urgent"
>
</psh-stat-card>
```

### Couleur d'Icone Personnalisee

Vous pouvez surcharger le gradient automatique avec une couleur personnalisee.

```html
<psh-stat-card
  value="100%"
  description="Progression"
  icon="trophy"
  iconBackground="linear-gradient(135deg, #FFD700, #FFA500)"
  tagVariant="success"
  tagLabel="Complete"
>
</psh-stat-card>
```

## Etats

### Interactive + Hoverable

Carte cliquable avec effet de survol et support du clavier.

```html
<psh-stat-card
  value="24"
  description="Notifications"
  icon="bell"
  [interactive]="true"
  [hoverable]="true"
  (clicked)="openNotifications()"
>
</psh-stat-card>
```

**Comportement :**
- Cursor pointer au survol
- Animation translateY(-2px) avec hoverable
- Focusable avec tabindex="0"
- Support clavier (Enter et Space)
- Focus ring visible (box-shadow)

### Loading

Affiche un skeleton anime pendant le chargement des donnees.

```html
<psh-stat-card
  [loading]="isLoading"
  value="--"
  description="Chargement..."
  icon="spinner"
>
</psh-stat-card>
```

### Disabled

Desactive la carte avec opacite reduite et interactions bloquees.

```html
<psh-stat-card
  value="N/A"
  description="Donnees indisponibles"
  icon="warning"
  [disabled]="true"
>
</psh-stat-card>
```

## Exemples Pratiques

### 1. Dashboard de Metriques

```html
<div class="stats-grid">
  <psh-stat-card
    value="12,847"
    description="Revenus"
    icon="currency-eur"
    tagVariant="success"
    tagLabel="+12.6%"
    [hoverable]="true"
  >
  </psh-stat-card>

  <psh-stat-card
    value="1,234"
    description="Utilisateurs"
    icon="users"
    tagVariant="success"
    tagLabel="+8.2%"
    [hoverable]="true"
  >
  </psh-stat-card>

  <psh-stat-card
    value="89%"
    description="Satisfaction"
    icon="smiley"
    tagVariant="primary"
    tagLabel="Stable"
    [hoverable]="true"
  >
  </psh-stat-card>

  <psh-stat-card
    value="156"
    description="Commandes"
    icon="shopping-cart"
    tagVariant="warning"
    tagLabel="-3.1%"
    [hoverable]="true"
  >
  </psh-stat-card>
</div>
```

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}
```

### 2. Carte Interactive avec Navigation

```typescript
@Component({
  template: `
    <psh-stat-card
      value="24"
      description="Messages non lus"
      icon="envelope"
      tagVariant="danger"
      tagLabel="Nouveau"
      [interactive]="true"
      [hoverable]="true"
      (clicked)="navigateToMessages()"
    >
    </psh-stat-card>
  `
})
export class InboxComponent {
  private router = inject(Router);

  navigateToMessages(): void {
    this.router.navigate(['/messages']);
  }
}
```

### 3. Chargement Conditionnel

```typescript
@Component({
  template: `
    <psh-stat-card
      [loading]="isLoading()"
      [value]="stats()?.revenue"
      description="Revenus du mois"
      icon="chart-bar"
      [tagVariant]="stats()?.trend > 0 ? 'success' : 'danger'"
      [tagLabel]="formatTrend(stats()?.trend)"
    >
    </psh-stat-card>
  `
})
export class RevenueCardComponent {
  isLoading = signal(true);
  stats = signal<Stats | null>(null);

  formatTrend(trend?: number): string {
    if (!trend) return '';
    return trend > 0 ? `+${trend}%` : `${trend}%`;
  }
}
```

### 4. Disposition Verticale pour Widget

```html
<div class="widget-container">
  <psh-stat-card
    layout="vertical"
    value="99.9%"
    description="Uptime"
    icon="check-circle"
    tagVariant="success"
    tagLabel="Excellent"
    variant="outlined"
  >
  </psh-stat-card>
</div>
```

### 5. Grille Compacte avec Row Direction

```html
<div class="compact-grid">
  @for (stat of stats; track stat.id) {
    <psh-stat-card
      [value]="stat.value"
      [description]="stat.label"
      [icon]="stat.icon"
      [tagVariant]="stat.variant"
      [tagLabel]="stat.change"
      [rowDirection]="true"
      variant="outlined"
    >
    </psh-stat-card>
  }
</div>
```

## Accessibilite

Le composant suit les meilleures pratiques ARIA et WCAG 2.1.

### Attributs ARIA Automatiques

| Attribut | Valeur | Condition |
|----------|--------|-----------|
| `role` | `"article"` | Par defaut |
| `role` | `"button"` | Si `interactive=true` |
| `tabindex` | `"0"` | Si `interactive=true` et non desactive |
| `tabindex` | `"-1"` | Si non interactif ou desactive |
| `aria-label` | Auto-genere | Combine description, value et tagLabel |
| `aria-disabled` | `"true"` | Si `disabled=true` |
| `aria-busy` | `"true"` | Si `loading=true` |

### Generation Automatique du Label ARIA

Le label ARIA est genere automatiquement selon le format :

- Sans tag : `"{description}: {value}"`
- Avec tag : `"{description}: {value}, {tagLabel}"`

Exemple : `"Revenus mensuels: 12,847, +12.6%"`

### Navigation Clavier

| Touche | Action |
|--------|--------|
| `Tab` | Deplace le focus vers la carte (si interactive) |
| `Enter` | Active la carte (emet `clicked`) |
| `Space` | Active la carte (emet `clicked`) |
| `Shift+Tab` | Focus precedent |

### Label ARIA Personnalise

```html
<psh-stat-card
  value="156"
  description="Commandes"
  icon="shopping-cart"
  ariaLabel="156 commandes en attente de traitement, cliquez pour voir les details"
  [interactive]="true"
>
</psh-stat-card>
```

### Recommandations

1. Toujours fournir une `description` claire et concise
2. Utiliser `ariaLabel` pour des contextes specifiques necessitant plus de details
3. S'assurer que les couleurs des tags ont un contraste suffisant
4. Tester la navigation au clavier
5. Les icones sont decoratives (`aria-hidden="true"`) - le sens est porte par le texte

## Personnalisation CSS

### Variables CSS Utilisees

```css
/* Espacement */
--spacing-lg    /* Padding de la carte */
--spacing-md    /* Gap entre elements */
--spacing-sm    /* Gap dans le contenu */
--spacing-xs    /* Petit espacement */

/* Tailles */
--size-16       /* Taille de l'icone (desktop) */
--size-14       /* Taille de l'icone (tablet) */
--size-12       /* Taille de l'icone (mobile) */
--size-32       /* Hauteur minimale (horizontal) */
--size-28       /* Hauteur minimale (tablet) */

/* Bordures */
--border-radius-lg  /* Rayon de bordure */
--radius-lg         /* Rayon de l'icone */

/* Typographie */
--font-size-2xl     /* Taille de la valeur */
--font-size-xl      /* Taille de la valeur (tablet) */
--font-size-lg      /* Taille de la valeur (mobile) */
--font-size-sm      /* Taille de la description */
--font-size-xs      /* Taille de la description (mobile) */
--font-weight-semibold  /* Poids de la valeur */

/* Couleurs */
--surface-card      /* Fond de la carte */
--surface-ground    /* Fond variant default */
--surface-border    /* Bordure variant outlined */
--text-color        /* Couleur de la valeur */
--text-color-secondary  /* Couleur de la description */
--surface-0         /* Couleur de l'icone */

/* Icones */
--icon-size-xl      /* Taille de l'icone (desktop) */
--icon-size-lg      /* Taille de l'icone (tablet) */
--icon-size-md      /* Taille de l'icone (mobile) */
```

### Exemple de Personnalisation

```css
/* Personnalisation globale */
psh-stat-card {
  --font-size-2xl: 2.5rem;
}

/* Personnalisation d'une instance */
.custom-stat-card {
  --surface-card: #f0f9ff;
}
```

## Bonnes Pratiques

### 1. Choix de la Variante de Tag

- **success** : Metriques en hausse, objectifs atteints, etats positifs
- **danger** : Metriques en baisse, alertes, erreurs
- **warning** : Attention requise, delais proches, seuils approches
- **primary** : Information neutre, valeurs stables

### 2. Formatage des Valeurs

```html
<!-- Nombres avec separateurs -->
<psh-stat-card value="1,234,567" ...>

<!-- Pourcentages -->
<psh-stat-card value="89.5%" ...>

<!-- Devises -->
<psh-stat-card value="12,847 EUR" ...>

<!-- Temps -->
<psh-stat-card value="2h 34min" ...>
```

### 3. Choix de la Disposition

- **horizontal** : Dashboards standards, listes de metriques
- **vertical** : Widgets isoles, cartes empilees
- **rowDirection** : Grilles compactes devant rester horizontales sur mobile

### 4. Cartes Interactives

Toujours combiner `interactive` et `hoverable` pour un feedback visuel clair :

```html
<psh-stat-card [interactive]="true" [hoverable]="true" (clicked)="...">
```

### 5. Performance

Le composant utilise `ChangeDetectionStrategy.OnPush` et Signals :

```typescript
// Les Signals sont trackes automatiquement
statCard.value.set('2,000');

// Les inputs reguliers declenchent la detection
<psh-stat-card [value]="dynamicValue()">
```

### 6. Quand Utiliser Stat Card

**Bonnes utilisations :**
- KPIs et metriques cles
- Tableaux de bord
- Resumes de donnees
- Indicateurs de performance

**A eviter :**
- Contenu textuel long
- Listes detaillees
- Formulaires
- Navigation principale

---

**Version :** 2.0
**Derniere mise a jour :** Janvier 2026
**Compatibilite :** Angular 20+
