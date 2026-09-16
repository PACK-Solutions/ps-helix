# Card Component Documentation

Composant carte metier - conteneur structure pour contenu professionnel avec support complet des titres, descriptions, et zones d'actions.

## Table des Matieres

- [Utilisation](#utilisation)
- [Utilisation de Base](#utilisation-de-base)
- [API Complete](#api-complète)
- [Ajout de Boutons](#ajout-de-boutons)
- [Slots de Contenu](#slots-de-contenu)
- [Variantes Visuelles](#variantes-visuelles)
- [Variantes de Couleur](#variantes-de-couleur)
- [Densites](#densités)
- [Etats](#états)
- [Exemples Pratiques](#exemples-pratiques)
- [Accessibilite](#accessibilité)
- [Bonnes Pratiques](#bonnes-pratiques)

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshCardComponent } from 'ps-helix';

@Component({
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
  appearance="elevated"
>
  <p>Cette carte utilise les propriétés title et description pour un rendu cohérent.</p>
  <div psh-card-actions>
    <psh-button color="primary">Démarrer</psh-button>
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
| `loading` | `boolean` | `false` | État de chargement - affiche un skeleton animé |
| `disabled` | `boolean` | `false` | État désactivé - réduit l'opacité et bloque les interactions |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| `clicked` | `EventEmitter<MouseEvent \| KeyboardEvent>` | Émis lors du clic souris ou de l'activation clavier (Enter/Space) sur la carte (si `interactive=true` et non désactivée) |

### Signals Publics

| Nom | Type | Description |
|-----|------|-------------|
| `isMobile` | `Signal<boolean>` | Indique si le viewport est en mode mobile (< 640px). Utilise un `ResizeObserver` pour la detection. |

### Proprietes Calculees (Computed)

| Nom | Type | Description |
|-----|------|-------------|
| `computedClasses` | `Signal<string>` | Classes CSS calculees selon les proprietes (variant, color, density, etats) |
| `hasHeader` | `Signal<boolean>` | `true` si `title` ou `description` est renseigné. N'est plus utilisé pour conditionner l'affichage du header (celui-ci se rend aussi via les slots projetés) ; conservé pour rétrocompatibilité |
| `actionsAlignmentClass` | `Signal<string>` | Classe d'alignement pour la zone d'actions |
| `actionsClasses` | `Signal<string>` | Classes CSS pour la zone d'actions incluant `mobile-full-width-buttons` sur mobile |

### Types TypeScript

```typescript
type CardVariant = 'default' | 'elevated' | 'outlined';
type CardColorVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';
type CardDensity = 'compact' | 'normal' | 'spacious';
type CardActionsAlignment = 'left' | 'center' | 'right' | 'space-between';
```

## Ajout de Boutons

L'ajout de boutons est très simple grâce au slot `card-actions`.

**Note sur le responsive :** Les boutons places dans `card-actions` deviennent automatiquement pleine largeur sur mobile (< 640px). Le composant utilise un `ResizeObserver` pour detecter le viewport mobile et applique automatiquement la classe `mobile-full-width-buttons` au conteneur d'actions. Vous n'avez pas besoin de gerer manuellement la propriete `fullWidth`.

### Option 1 : Zone d'Actions (Recommandé)

Zone dédiée en bas de la carte avec alignement configurable.

```html
<psh-card title="Confirmation" actionsAlignment="space-between">
  <p>Êtes-vous sûr de vouloir continuer ?</p>
  <div psh-card-actions>
    <psh-button appearance="outline">Annuler</psh-button>
    <psh-button color="primary">Confirmer</psh-button>
  </div>
</psh-card>
```

### Option 2 : Boutons dans le Header

Pour des actions secondaires ou des boutons de gestion.

```html
<psh-card title="Mon projet">
  <div psh-card-header-actions>
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
  <div psh-card-header-actions>
    <psh-button size="small" appearance="ghost">
      <i class="ph ph-gear"></i>
    </psh-button>
  </div>

  <p>Gérez vos préférences et paramètres de compte.</p>

  <div psh-card-footer>
    <span>Dernière modification : il y a 2 heures</span>
  </div>

  <div psh-card-actions>
    <psh-button appearance="outline">Réinitialiser</psh-button>
    <psh-button color="primary">Enregistrer</psh-button>
  </div>
</psh-card>
```

## Slots de Contenu

Le composant utilise `ng-content` avec des sélecteurs pour organiser le contenu.

| Slot | Sélecteur | Description | Position |
|------|-----------|-------------|----------|
| **Header Icon** | `[psh-card-header-icon]` | Icône ou avatar avant le titre | Header - gauche |
| **Header Content** | `[psh-card-header-content]` | Contenu personnalisé du header (remplace title/description) | Header - centre |
| **Header Extra** | `[psh-card-header-actions]` | Badge, tag ou actions secondaires | Header - droite |
| **Body** | (défaut) | Contenu principal de la carte | Corps principal |
| **Footer** | `[psh-card-footer]` | Métadonnées, dates, informations complémentaires | Avant actions |
| **Actions** | `[psh-card-actions]` | Boutons d'action principaux | Pied de carte |

> **Le header s'affiche dès qu'un slot de header est utilisé.** Il n'est plus nécessaire de
> renseigner `[title]` ou `[description]` : projeter du contenu dans `[psh-card-header-icon]`,
> `[psh-card-header-content]` ou `[psh-card-header-actions]` suffit à faire apparaître le header. Si
> aucun de ces slots n'est utilisé et que `title`/`description` sont vides, le header n'est
> pas affiché (ni bordure ni espace résiduel).

### Exemple Complet avec Tous les Slots

```html
<psh-card
  title="Projet Design System"
  description="Version 2.0 en cours"
  appearance="elevated"
  [hoverable]="true"
>
  <!-- Icône dans le header -->
  <div psh-card-header-icon>
    <i class="ph ph-folder-open" style="font-size: 1.5rem; color: var(--psh-primary-color);"></i>
  </div>

  <!-- Badge dans le header -->
  <div psh-card-header-actions>
    <psh-tag color="success">Actif</psh-tag>
  </div>

  <!-- Contenu principal -->
  <p>Développement du nouveau design system avec composants Angular 20 et Signals.</p>
  <ul>
    <li>Migration vers standalone components</li>
    <li>Optimisation avec ChangeDetection OnPush</li>
    <li>Support complet de l'accessibilité</li>
  </ul>

  <!-- Footer avec métadonnées -->
  <div psh-card-footer>
    <span>Échéance: 15 Déc 2025</span>
    <span>Équipe: 6 personnes</span>
  </div>

  <!-- Actions -->
  <div psh-card-actions>
    <psh-button appearance="outline">Voir détails</psh-button>
    <psh-button color="primary">Ouvrir</psh-button>
  </div>
</psh-card>
```

### Header Entièrement Personnalisé (sans `title`)

Quand le rendu par défaut du titre ne convient pas (couleur, taille, alignement, mise en page
titre + valeur à droite…), composez votre propre header via les slots, **sans passer par
`[title]`**. Le header se rend dès qu'un slot est projeté ; le style se définit dans la portée
CSS de votre composant consommateur, **sans `::ng-deep`**.

```html
<psh-card appearance="outline" density="compact">
  <!-- Titre + icône, à gauche -->
  <div psh-card-header-content class="premium-title">
    <i class="ph ph-currency-eur" aria-hidden="true"></i>
    <h3>Versement initial</h3>
  </div>

  <!-- Montant / tag, aligné à droite -->
  <span psh-card-header-actions>
    <psh-tag>{{ montant }}</psh-tag>
  </span>

  <!-- Corps de la carte -->
  <p>Détail du versement…</p>
</psh-card>
```

```css
/* Dans le CSS du composant consommateur — pas d'override global du DS */
.premium-title {
  display: flex;
  align-items: center;
  gap: var(--psh-spacing-sm);
}
.premium-title h3 {
  font-size: var(--psh-font-size-base);
  color: var(--psh-text-color-secondary);
  margin: 0;
}
```

> **Accessibilité** : le markup projeté dans le header doit contenir un élément de titre
> (`<h3>` ou le niveau adapté à la hiérarchie de la page) afin de préserver la structure des
> titres pour les lecteurs d'écran — exactement comme le fait le `.card-title` par défaut.

## Variantes Visuelles

### Default

Style de base sans bordure ni ombre - fond blanc/gris selon le thème.

```html
<psh-card appearance="flat" title="Carte Default">
  <p>Style minimaliste sans effets visuels</p>
</psh-card>
```

### Elevated

Style avec ombre portée pour créer de la profondeur (recommandé pour les cartes importantes).

```html
<psh-card appearance="elevated" title="Carte Elevated">
  <p>Ombre douce pour mise en avant</p>
</psh-card>
```

### Outlined

Style avec bordure pour délimiter clairement la carte.

```html
<psh-card appearance="outline" title="Carte Outlined">
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
  appearance="outline"
  color="info"
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
  appearance="outline"
  color="success"
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
  appearance="outline"
  color="warning"
>
  <p>Votre abonnement expire dans 7 jours.</p>
  <div psh-card-actions>
    <psh-button color="primary">Renouveler</psh-button>
  </div>
</psh-card>
```

### Danger (Rouge)

Pour erreurs et messages critiques.

```html
<psh-card
  title="Erreur"
  description="Une erreur est survenue"
  appearance="outline"
  color="danger"
>
  <p>Impossible de se connecter au serveur.</p>
  <div psh-card-actions>
    <psh-button color="primary">Réessayer</psh-button>
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
  appearance="outline"
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
  appearance="outline"
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
  appearance="outline"
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
- Animation translateY(-2px) avec hoverable
- Focusable avec tabindex="0"
- Support clavier (Enter et Space)
- Émet l'événement `clicked` avec `MouseEvent` (clic souris) ou `KeyboardEvent` (activation clavier)

**Exemple de gestion d'événement :**
```typescript
handleCardClick(event: MouseEvent | KeyboardEvent): void {
  console.log('Carte activée via :', event instanceof MouseEvent ? 'souris' : 'clavier');
}
```

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
  <div psh-card-actions>
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
  appearance="outline"
  color="info"
  actionsAlignment="space-between"
>
  <div psh-card-header-icon>
    <i class="ph ph-bell" style="font-size: 1.5rem; color: var(--psh-blue-500);"></i>
  </div>

  <div psh-card-header-actions>
    <psh-tag color="primary">3</psh-tag>
  </div>

  <ul>
    <li>Nouvelle mention dans un commentaire</li>
    <li>Mise à jour du projet Design System</li>
    <li>Invitation à rejoindre une équipe</li>
  </ul>

  <div psh-card-actions>
    <psh-button appearance="outline">Ignorer tout</psh-button>
    <psh-button color="primary">Voir tout</psh-button>
  </div>
</psh-card>
```

### 2. Carte de Tableau de Bord (Compact)

```html
<psh-card
  title="Visiteurs aujourd'hui"
  description="+12% vs hier"
  density="compact"
  appearance="elevated"
>
  <div psh-card-header-icon>
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
  appearance="outline"
  density="spacious"
>
  <form>
    <psh-input label="Nom du projet" required></psh-input>
    <psh-input label="Description" type="textarea"></psh-input>
    <psh-select label="Catégorie" [options]="categories"></psh-select>
  </form>

  <div psh-card-footer>
    <span>* Champs obligatoires</span>
  </div>

  <div psh-card-actions>
    <psh-button appearance="outline">Annuler</psh-button>
    <psh-button color="primary">Créer</psh-button>
  </div>
</psh-card>
```

### 4. Carte Cliquable (Liste)

```html
@for (item of items; track item.id) {
  <psh-card
    [title]="item.title"
    [description]="item.description"
    appearance="outline"
    [interactive]="true"
    [hoverable]="true"
    (clicked)="openItem(item)"
  >
    <div psh-card-header-actions>
      <psh-tag [color]="item.status">{{ item.statusLabel }}</psh-tag>
    </div>

    <p>{{ item.excerpt }}</p>

    <div psh-card-footer>
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
  appearance="outline"
  color="danger"
>
  <div psh-card-header-icon>
    <i class="ph ph-warning-circle" style="font-size: 1.5rem; color: var(--psh-danger-color);"></i>
  </div>

  <p><strong>Code d'erreur :</strong> CONNECTION_TIMEOUT</p>
  <p>Vérifiez votre connexion internet et réessayez dans quelques instants.</p>

  <div psh-card-footer>
    <span>Dernière tentative : il y a 30 secondes</span>
  </div>

  <div psh-card-actions>
    <psh-button appearance="outline">Détails</psh-button>
    <psh-button color="primary">Réessayer</psh-button>
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
      appearance="outline"
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

**Version :** 2.1
**Derniere mise a jour :** Decembre 2025
**Compatibilite :** Angular 20+
