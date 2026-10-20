# Alert Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshAlertComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshAlertComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Alerte basique
<psh-alert color="info">
  Message d'information
</psh-alert>

// Alerte avec icône personnalisée
<psh-alert 
  color="success"
  icon="bell"
  iconPosition="right"
  [closable]="true"
  (closed)="handleClose()"
>
  Message de succès avec icône personnalisée
</psh-alert>
```

## API

### Inputs
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| color | PshColor | 'info' | Couleur de l'alerte : 'info', 'success', 'warning', 'danger', 'primary', 'secondary' ou 'neutral' |
| iconPosition | IconPosition | 'left' | Position de l'icône |
| closable | boolean | false | Affiche un bouton de fermeture |
| size | AlertSize | 'medium' | Taille de l'alerte |
| showIcon | boolean | true | Affiche ou masque l'icône |
| icon | string | - | Nom de l'icône Phosphor (auto selon type si non défini) |
| role | AlertRole | auto | Rôle ARIA (auto: 'alert' pour warning/danger, 'status' pour info/success) |
| ariaLabel | string | - | Label ARIA personnalisé |
| dismissLabel | string | 'Dismiss alert' | Label du bouton de fermeture |
| ariaLive | 'polite' \| 'assertive' | auto | Niveau de politesse ARIA (auto: 'assertive' pour warning/danger, 'polite' pour info/success) |
| content | string | '' | Contenu de l'alerte (alternative à ng-content) |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| closed | OutputEmitterRef<void> | Émis lors de la fermeture |

### Types

```typescript
type AlertType = 'info' | 'success' | 'warning' | 'danger';
type IconPosition = 'left' | 'right';
type AlertSize = 'small' | 'medium' | 'large';
type AlertRole = 'alert' | 'status';
```

## Configuration par Défaut

Le composant Alert inclut une configuration par défaut intégrée :

```typescript
const DEFAULT_CONFIG = {
  type: 'info',
  iconPosition: 'left',
  closable: false,
  size: 'medium',
  showIcon: true
};

const DEFAULT_LABELS = {
  dismiss: 'Dismiss alert'
};

const DEFAULT_ICONS = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'warning-octagon'
};
```

## Variants Overview

### Info Alert
**Description**: Pour les messages informatifs généraux.

**Cas d'utilisation**:
- Messages d'information
- Mises à jour du système
- Conseils et astuces

### Success Alert
**Description**: Pour confirmer une action réussie.

**Cas d'utilisation**:
- Confirmation de soumission
- Actions réussies
- Validations positives

### Warning Alert
**Description**: Pour attirer l'attention sur des points importants.

**Cas d'utilisation**:
- Avertissements préventifs
- Actions nécessitant attention
- Notifications importantes

### Danger Alert
**Description**: Pour signaler des erreurs ou problèmes critiques.

**Cas d'utilisation**:
- Messages d'erreur
- Actions destructives
- Problèmes critiques

### Primary, Secondary et Neutral
**Description**: Pour les messages sans sémantique de statut : annonce aux couleurs de la marque
(`primary`), information secondaire (`secondary`), note sans emphase (`neutral`). Icône `info` par
défaut, rôle `status`.

> `primary` et `info` se ressemblent : l'alerte info est dessinée aux couleurs de la marque depuis
> toujours. Choisissez `info` pour un message informatif, `primary` pour une annonce de marque.

### Couleurs et contraste

Chaque couleur lit trois tokens de thème, `--psh-alert-<couleur>-bg`, `-border-color` et
`-text-color`, définis dans le thème clair et le thème sombre. Le texte est la couleur elle-même
quand elle atteint 4,5:1 sur sa teinte, assombrie (clair) ou éclaircie (sombre) juste assez sinon :
les sept couleurs passent WCAG AA dans les deux thèmes, sur fond de page comme de carte.
La bordure, elle, se détache de la page et d'une carte à 3:1 au moins (WCAG 1.4.11).
`npm run verify:contrast` vérifie les deux en CI : un texte d'alerte sous 4,5:1 ou une bordure sous
3:1 fait échouer le build.

## États et Modificateurs

### Tailles
- `small`: Pour les messages courts et discrets — texte `--psh-font-size-sm`, icône `--psh-icon-size-sm`
- `medium`: Taille par défaut — texte `--psh-font-size-base`, icône `--psh-icon-size-md`
- `large`: Pour les messages importants — texte `--psh-font-size-lg`, icône `--psh-icon-size-lg`

La taille s'applique au texte comme à l'icône et au padding. Sous `47.9375em`, toutes les
tailles passent au texte `sm`, puis `xs` sous `29.9375em`. Le texte simple projeté dans
`[psh-alert-actions]` hérite de la même taille que le message ; un `psh-button` garde la sienne.

L'icône est centrée sur la **première ligne** du message, quelle que soit la taille : elle
s'aligne sur sa ligne de base. Elle suit donc un contenu projeté qui commence par un `<p>` avec
sa marge, ou par un titre plus grand (à 2px près). Sur un message de plusieurs lignes, elle
reste en haut.

Les actions et le bouton de fermeture s'alignent sur la même première ligne : le libellé d'un
bouton d'action est sur la ligne du message. Une action plus haute que cette ligne (un bouton de
40px à côté d'une ligne de 28px) y centre la ligne ; un message de plusieurs lignes commence
alors un peu plus bas, pour que sa première ligne reste en face de l'action.

### Positions d'Icône
- `left`: Icône à gauche du texte (défaut)
- `right`: Icône à droite du texte

### États
- `closable`: Permet la fermeture de l'alerte
- `showIcon`: Contrôle l'affichage de l'icône

## Accessibilité

### Comportement Automatique

Le composant calcule automatiquement les attributs ARIA en fonction du type d'alerte :

| Type | role | aria-live |
|------|------|-----------|
| info | status | polite |
| success | status | polite |
| warning | alert | assertive |
| danger | alert | assertive |

Ces valeurs peuvent être surchargées via les inputs `role` et `ariaLive`.

### Rôles ARIA
- `role="alert"`: Pour les messages importants nécessitant l'attention immédiate (warning, danger)
- `role="status"`: Pour les messages informatifs non critiques (info, success)

### Attributs ARIA
- `aria-label`: Label personnalisé pour les lecteurs d'écran
- `aria-live`: Contrôle la priorité des annonces ('polite' ou 'assertive')

### Bonnes Pratiques
- Laisser le calcul automatique des rôles ARIA sauf besoin specifique
- Fournir des labels clairs et descriptifs
- Gérer correctement la fermeture avec le clavier

## Bonnes Pratiques

1. **Hiérarchie Visuelle**
   - Utiliser le type approprié selon l'importance du message
   - Maintenir une cohérence dans l'utilisation des types
   - Limiter le nombre d'alertes simultanées

2. **Accessibilité**
   - Utilisation appropriée des rôles ARIA
   - Support des lecteurs d'écran
   - Messages clairs et concis

3. **Responsive Design**
   - Les alertes s'adaptent à la largeur du conteneur
   - Texte lisible sur toutes les tailles d'écran
   - Gestion appropriée des longs contenus

4. **Performance**
   - Utilisation des signals pour la réactivité
   - Détection de changements OnPush
   - Animations optimisées