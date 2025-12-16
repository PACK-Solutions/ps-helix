# Card Component Documentation

Composant carte métier - conteneur structuré pour contenu professionnel avec support complet des titres, descriptions, et zones d'actions.

## Table des Matières

- [Installation](#installation)
- [Utilisation de Base](#utilisation-de-base)
- [API Complète](#api-complète)
- [Ajout de Boutons](#ajout-de-boutons)
- [Slots de Contenu](#slots-de-contenu)
- [Variantes Visuelles](#variantes-visuelles)
- [Variantes de Couleur](#variantes-de-couleur)
- [Densités](#densités)
- [États](#états)
- [Exemples Pratiques](#exemples-pratiques)
- [Accessibilité](#accessibilité)
- [Bonnes Pratiques](#bonnes-pratiques)

## Installation

```typescript
import { PshCardComponent } from 'ps-helix';

@Component({
  standalone: true,
  imports: [PshCardComponent],
})
export class MyComponent {}
```

## Utilisation de Base

### Carte Simple avec Titre et Description

```html
<psh-card
  title="Bienvenue sur la plateforme"
  description="Commencez votre parcours dès maintenant"
  variant="elevated"
>
  <p>Cette carte utilise les propriétés title et description pour un rendu cohérent.</p>
  <div card-actions>
    <psh-button variant="primary">Démarrer</psh-button>
  </div>
</psh-card>
```

### Carte Interactive Cliquable

```html
<psh-card
  title="Carte Interactive"
  [interactive]="true"
  [hoverable]="true"
  (clicked)="handleCardClick($event)"
>
  <p>Cliquez sur cette carte pour interagir</p>
</psh-card>
```

## API Complète

### Model Inputs

Propriétés modifiables (lecture/écriture)

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| `variant` | `CardVariant` | `'default'` | Variante visuelle : `'default'` \| `'elevated'` \| `'outlined'` |
| `hoverable` | `boolean` | `false` | Active l'effet de survol (animation translateY) |
| `interactive` | `boolean` | `false` | Rend la carte cliquable avec cursor pointer et gestion du focus |

### Regular Inputs

Propriétés en lecture seule

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| `title` | `string` | `''` | Titre principal de la carte |
| `description` | `string` | `''` | Description/sous-titre optionnel |
| `colorVariant` | `CardColorVariant` | `'default'` | Variante de couleur : `'default'` \| `'info'` \| `'success'` \| `'warning'` \| `'danger'` |
| `density` | `CardDensity` | `'normal'` | Niveau de densité : `'compact'` (16px) \| `'normal'` (24px) \| `'spacious'` (32px) |
| `actionsAlignment` | `CardActionsAlignment` | `'right'` | Alignement des actions : `'left'` \| `'center'` \| `'right'` \| `'space-between'` |
| `showHeaderDivider` | `boolean` | `true` | Afficher le divider entre header et body |
| `showFooterDivider` | `boolean` | `true` | Afficher le divider entre body et footer |
| `showActionsDivider` | `boolean` | `true` | Afficher le divider avant les actions |
| `cssClass` | `string` | `''` | Classes CSS additionnelles |
| `customStyle` | `Record<string, string>` | `{}` | Styles inline personnalisés |
| `loading` | `boolean` | `false` | État de chargement - affiche un skeleton animé |
| `disabled` | `boolean` | `false` | État désactivé - réduit l'opacité et bloque les interactions |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| `clicked` | `EventEmitter<MouseEvent>` | Émis lors du clic sur la carte (si `interactive=true` et non désactivée) |

### Types TypeScript

```typescript
type CardVariant = 'default' | 'elevated' | 'outlined';
type CardColorVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';
type CardDensity = 'compact' | 'normal' | 'spacious';
type CardActionsAlignment = 'left' | 'center' | 'right' | 'space-between';
```

## Ajout de Boutons

L'ajout de boutons est très simple grâce au slot `card-actions`.

### Option 1 : Zone d'Actions (Recommandé)

Zone dédiée en bas de la carte avec alignement configurable.

```html
<psh-card title="Confirmation" actionsAlignment="space-between">
  <p>Êtes-vous sûr de vouloir continuer ?</p>
  <div card-actions>
    <psh-button appearance="outline">Annuler</psh-button>
    <psh-button variant="primary">Confirmer</psh-button>
  </div>
</psh-card>
```

### Option 2 : Boutons dans le Header

Pour des actions secondaires ou des boutons de gestion.

```html
<psh-card title="Mon projet">
  <div card-header-extra>
    <psh-button size="small" appearance="ghost">
      <i class="ph ph-pencil"></i>
      Éditer
    </psh-button>
  </div>
  <p>Description du projet...</p>
</psh-card>
```

### Option 3 : Multiples Zones de Boutons

Combiner plusieurs emplacements pour des interfaces complexes.

```html
<psh-card title="Paramètres du compte">
  <div card-header-extra>
    <psh-button size="small" appearance="ghost">
      <i class="ph ph-gear"></i>
    </psh-button>
  </div>

  <p>Gérez vos préférences et paramètres de compte.</p>

  <div card-footer>
    <span>Dernière modification : il y a 2 heures</span>
  </div>

  <div card-actions>
    <psh-button appearance="outline">Réinitialiser</psh-button>
    <psh-button variant="primary">Enregistrer</psh-button>
  </div>
</psh-card>
```

## Slots de Contenu

Le composant utilise `ng-content` avec des sélecteurs pour organiser le contenu.

| Slot | Sélecteur | Description | Position |
|------|-----------|-------------|----------|
| **Header Icon** | `[card-header-icon]` | Icône ou avatar avant le titre | Header - gauche |
| **Header Content** | `[card-header-content]` | Contenu personnalisé du header (remplace title/description) | Header - centre |
| **Header Extra** | `[card-header-extra]` | Badge, tag ou actions secondaires | Header - droite |
| **Body** | (défaut) | Contenu principal de la carte | Corps principal |
| **Footer** | `[card-footer]` | Métadonnées, dates, informations complémentaires | Avant actions |
| **Actions** | `[card-actions]` | Boutons d'action principaux | Pied de carte |

### Exemple Complet avec Tous les Slots

```html
<psh-card
  title="Projet Design System"
  description="Version 2.0 en cours"
  variant="elevated"
  [hoverable]="true"
>
  <!-- Icône dans le header -->
  <div card-header-icon>
    <i class="ph ph-folder-open" style="font-size: 1.5rem; color: var(--primary-color);"></i>
  </div>

  <!-- Badge dans le header -->
  <div card-header-extra>
    <psh-tag variant="success">Actif</psh-tag>
  </div>

  <!-- Contenu principal -->
  <p>Développement du nouveau design system avec composants Angular 20 et Signals.</p>
  <ul>
    <li>Migration vers standalone components</li>
    <li>Optimisation avec ChangeDetection OnPush</li>
    <li>Support complet de l'accessibilité</li>
  </ul>

  <!-- Footer avec métadonnées -->
  <div card-footer>
    <span>Échéance: 15 Déc 2025</span>
    <span>Équipe: 6 personnes</span>
  </div>

  <!-- Actions -->
  <div card-actions>
    <psh-button appearance="outline">Voir détails</psh-button>
    <psh-button variant="primary">Ouvrir</psh-button>
  </div>
</psh-card>
```

## Variantes Visuelles

### Default

Style de base sans bordure ni ombre - fond blanc/gris selon le thème.

```html
<psh-card variant="default" title="Carte Default">
  <p>Style minimaliste sans effets visuels</p>
</psh-card>
```

### Elevated

Style avec ombre portée pour créer de la profondeur (recommandé pour les cartes importantes).

```html
<psh-card variant="elevated" title="Carte Elevated">
  <p>Ombre douce pour mise en avant</p>
</psh-card>
```

### Outlined

Style avec bordure pour délimiter clairement la carte.

```html
<psh-card variant="outlined" title="Carte Outlined">
  <p>Bordure subtile pour définition claire</p>
</psh-card>
```

## Variantes de Couleur

Les variantes de couleur appliquent une bordure colorée (à gauche pour default/elevated, tout autour pour outlined).

### Info (Bleu)

Pour messages informatifs et notifications.

```html
<psh-card
  title="Information"
  description="Message informatif"
  variant="outlined"
  colorVariant="info"
>
  <p>Votre compte a été mis à jour avec succès.</p>
</psh-card>
```

### Success (Vert)

Pour confirmations et succès d'opérations.

```html
<psh-card
  title="Succès"
  description="Opération réussie"
  variant="outlined"
  colorVariant="success"
>
  <p>Votre paiement a été traité avec succès.</p>
</psh-card>
```

### Warning (Orange)

Pour avertissements et actions requises.

```html
<psh-card
  title="Attention"
  description="Action requise"
  variant="outlined"
  colorVariant="warning"
>
  <p>Votre abonnement expire dans 7 jours.</p>
  <div card-actions>
    <psh-button variant="primary">Renouveler</psh-button>
  </div>
</psh-card>
```

### Danger (Rouge)

Pour erreurs et messages critiques.

```html
<psh-card
  title="Erreur"
  description="Une erreur est survenue"
  variant="outlined"
  colorVariant="danger"
>
  <p>Impossible de se connecter au serveur.</p>
  <div card-actions>
    <psh-button variant="primary">Réessayer</psh-button>
  </div>
</psh-card>
```

## Densités

Contrôle le padding interne de la carte pour adapter la densité d'information.

### Compact (16px)

Pour tableaux de bord denses avec beaucoup de cartes.

```html
<psh-card
  title="Densité Compacte"
  density="compact"
  variant="outlined"
>
  <p>Padding réduit pour afficher plus d'informations.</p>
</psh-card>
```

### Normal (24px) - Défaut

Spacing standard recommandé pour la plupart des cas.

```html
<psh-card
  title="Densité Normale"
  density="normal"
  variant="outlined"
>
  <p>Padding standard équilibré.</p>
</psh-card>
```

### Spacious (32px)

Pour designs aérés et premium avec peu de cartes.

```html
<psh-card
  title="Densité Spacieuse"
  density="spacious"
  variant="outlined"
>
  <p>Padding généreux pour un rendu premium.</p>
</psh-card>
```

## États

### Interactive + Hoverable

Carte cliquable avec effet de survol et support du clavier.

```html
<psh-card
  title="Carte Interactive"
  [interactive]="true"
  [hoverable]="true"
  (clicked)="handleCardClick($event)"
>
  <p>Cliquez ou appuyez sur Entrée/Espace</p>
</psh-card>
```

**Comportement :**
- Cursor pointer au survol
- Animation translateY(-4px) avec hoverable
- Focusable avec tabindex="0"
- Support clavier (Enter et Space)
- Émet l'événement `clicked`

### Loading

Affiche un skeleton animé pendant le chargement.

```html
<psh-card
  title="Chargement"
  [loading]="isLoading"
>
  <p>Ce contenu ne sera pas visible</p>
</psh-card>
```

### Disabled

Désactive la carte avec opacité réduite et interactions bloquées.

```html
<psh-card
  title="Carte Désactivée"
  [disabled]="true"
  [interactive]="true"
>
  <p>Cette carte est désactivée.</p>
  <div card-actions>
    <psh-button>Action impossible</psh-button>
  </div>
</psh-card>
```

## Exemples Pratiques

### 1. Carte de Notification avec Actions

```html
<psh-card
  title="Notifications"
  description="3 nouvelles notifications"
  variant="outlined"
  colorVariant="info"
  actionsAlignment="space-between"
>
  <div card-header-icon>
    <i class="ph ph-bell" style="font-size: 1.5rem; color: var(--info-color);"></i>
  </div>

  <div card-header-extra>
    <psh-tag variant="primary">3</psh-tag>
  </div>

  <ul>
    <li>Nouvelle mention dans un commentaire</li>
    <li>Mise à jour du projet Design System</li>
    <li>Invitation à rejoindre une équipe</li>
  </ul>

  <div card-actions>
    <psh-button appearance="outline">Ignorer tout</psh-button>
    <psh-button variant="primary">Voir tout</psh-button>
  </div>
</psh-card>
```

### 2. Carte de Tableau de Bord (Compact)

```html
<psh-card
  title="Visiteurs aujourd'hui"
  description="+12% vs hier"
  density="compact"
  variant="elevated"
>
  <div card-header-icon>
    <i class="ph ph-users"></i>
  </div>

  <h2 style="font-size: 2rem; margin: 0;">1,234</h2>
</psh-card>
```

### 3. Carte de Formulaire avec Footer

```html
<psh-card
  title="Créer un nouveau projet"
  description="Remplissez les informations de base"
  variant="outlined"
  density="spacious"
>
  <form>
    <psh-input label="Nom du projet" required></psh-input>
    <psh-input label="Description" type="textarea"></psh-input>
    <psh-select label="Catégorie" [options]="categories"></psh-select>
  </form>

  <div card-footer>
    <span>* Champs obligatoires</span>
  </div>

  <div card-actions>
    <psh-button appearance="outline">Annuler</psh-button>
    <psh-button variant="primary">Créer</psh-button>
  </div>
</psh-card>
```

### 4. Carte Cliquable (Liste)

```html
@for (item of items; track item.id) {
  <psh-card
    [title]="item.title"
    [description]="item.description"
    variant="outlined"
    [interactive]="true"
    [hoverable]="true"
    (clicked)="openItem(item)"
  >
    <div card-header-extra>
      <psh-tag [variant]="item.status">{{ item.statusLabel }}</psh-tag>
    </div>

    <p>{{ item.excerpt }}</p>

    <div card-footer>
      <span>Créé le {{ item.createdAt | date }}</span>
      <span>Par {{ item.author }}</span>
    </div>
  </psh-card>
}
```

### 5. Carte de Message d'Erreur

```html
<psh-card
  title="Erreur de Connexion"
  description="Impossible de se connecter au serveur"
  variant="outlined"
  colorVariant="danger"
>
  <div card-header-icon>
    <i class="ph ph-warning-circle" style="font-size: 1.5rem; color: var(--danger-color);"></i>
  </div>

  <p><strong>Code d'erreur :</strong> CONNECTION_TIMEOUT</p>
  <p>Vérifiez votre connexion internet et réessayez dans quelques instants.</p>

  <div card-footer>
    <span>Dernière tentative : il y a 30 secondes</span>
  </div>

  <div card-actions>
    <psh-button appearance="outline">Détails</psh-button>
    <psh-button variant="primary">Réessayer</psh-button>
  </div>
</psh-card>
```

## Accessibilité

Le composant suit les meilleures pratiques ARIA et WCAG 2.1.

### Attributs ARIA Automatiques

- `role="article"` : Définit la carte comme un article sémantique
- `[attr.tabindex]="0"` : Focusable si interactive et non désactivée
- `[attr.aria-disabled]="true"` : Indique l'état désactivé
- `[attr.aria-busy]="true"` : Indique l'état de chargement

### Navigation Clavier

Pour les cartes interactives (`interactive=true`) :

- **Tab** : Focus sur la carte
- **Enter** : Active la carte (émet `clicked`)
- **Space** : Active la carte (émet `clicked`)
- **Shift+Tab** : Focus précédent

### Recommandations

1. Toujours fournir un `title` descriptif pour les cartes interactives
2. Utiliser `description` pour donner du contexte supplémentaire
3. S'assurer que le texte a un contraste suffisant (min 4.5:1)
4. Tester la navigation au clavier dans les formulaires de carte
5. Fournir un feedback visuel clair pour l'état de focus

## Bonnes Pratiques

### 1. Utilisation des Propriétés Intégrées

**À privilégier :**
```html
<psh-card title="Mon titre" description="Ma description">
  <p>Contenu</p>
</psh-card>
```

**À éviter :**
```html
<psh-card>
  <h3>Mon titre</h3>
  <p class="description">Ma description</p>
  <p>Contenu</p>
</psh-card>
```

### 2. Choix de la Densité

- **Compact** : Tableaux de bord avec 6+ cartes visibles
- **Normal** : Cas général, pages de contenu standard
- **Spacious** : Landing pages, pages marketing, 1-3 cartes

### 3. Cartes Interactives

Toujours combiner `interactive` et `hoverable` pour un feedback visuel clair :

```html
<psh-card [interactive]="true" [hoverable]="true" (clicked)="...">
```

### 4. Alignement des Actions

- **right** (défaut) : Actions de confirmation (Annuler | Confirmer)
- **space-between** : Actions équivalentes (Précédent | Suivant)
- **left** : Action unique ou principale à gauche
- **center** : Action unique centrée

### 5. Variantes de Couleur

Réserver les variantes colorées pour les messages d'état, pas pour la décoration :

- **info** : Notifications, messages informatifs
- **success** : Confirmations, opérations réussies
- **warning** : Alertes, actions requises
- **danger** : Erreurs, messages critiques

### 6. Performance

Le composant utilise `ChangeDetectionStrategy.OnPush` et Signals :

```typescript
// ✅ Les Signals sont trackés automatiquement
card.variant.set('elevated');
card.hoverable.set(true);

// ✅ Les inputs réguliers déclenchent la détection
<psh-card [title]="dynamicTitle">
```

### 7. Composition

Pour des besoins spécifiques, créer des composants dédiés qui utilisent `psh-card` :

```typescript
@Component({
  selector: 'app-project-card',
  template: `
    <psh-card
      [title]="project.name"
      [description]="project.status"
      variant="outlined"
      [hoverable]="true"
    >
      <!-- Contenu spécifique projet -->
    </psh-card>
  `
})
export class ProjectCardComponent {
  @Input() project!: Project;
}
```

## Support et Contribution

Pour toute question ou suggestion d'amélioration, consultez la documentation complète ou créez une issue sur le repository du design system.

---

**Version :** 2.0
**Dernière mise à jour :** Octobre 2025
**Compatibilité :** Angular 19+
