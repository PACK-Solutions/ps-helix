# Collapse Component

Le composant Collapse permet de creer des sections de contenu pliables/depliables.

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshCollapseComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshCollapseComponent]
})
```

### Basique

```html
<psh-collapse>
  <div collapse-header>Titre de la section</div>
  Contenu de la section
</psh-collapse>
```

### Avec contenu personnalise pour l'en-tete

```html
<psh-collapse>
  <div collapse-header>
    <i class="ph ph-info"></i>
    Titre personnalise
  </div>
  Contenu de la section
</psh-collapse>
```

### Variante outline

```html
<psh-collapse variant="outline">
  <div collapse-header>Section avec bordure</div>
  Contenu de la section
</psh-collapse>
```

### Controle programmatique

```html
<psh-collapse [(expanded)]="isExpanded">
  <div collapse-header>Section controlee</div>
  Contenu de la section
</psh-collapse>

<button (click)="isExpanded.set(true)">Ouvrir</button>
<button (click)="isExpanded.set(false)">Fermer</button>
```

### Hauteur maximale avec scroll

```html
<psh-collapse maxHeight="300px">
  <div collapse-header>Contenu avec scroll</div>
  Contenu tres long...
</psh-collapse>
```

## API

### Inputs

| Nom              | Type                           | Defaut       | Description                                              |
| ---------------- | ------------------------------ | ------------ | -------------------------------------------------------- |
| expanded         | boolean                        | false        | Etat d'expansion (model input, supporte two-way binding) |
| disabled         | boolean                        | false        | Desactive le composant                                   |
| icon             | string                         | 'caret-down' | Icone d'expansion (Phosphor icons)                       |
| variant          | 'default' \| 'outline'         | 'default'    | Style visuel                                             |
| size             | 'small' \| 'medium' \| 'large' | 'medium'     | Taille du composant                                      |
| maxHeight        | string                         | '1000px'     | Hauteur maximale du contenu (avec scroll si depasse)     |
| disableAnimation | boolean                        | false        | Desactive les animations d'ouverture/fermeture           |
| id               | string \| undefined            | undefined    | ID personnalise pour les elements ARIA                   |

### Outputs

| Nom            | Type                   | Description                                             |
| -------------- | ---------------------- | ------------------------------------------------------- |
| expandedChange | OutputEmitterRef<boolean> | Emis lors du changement d'etat (pour two-way binding)   |
| toggled        | OutputEmitterRef<boolean> | Emis a chaque toggle avec la nouvelle valeur            |
| opened         | OutputEmitterRef<void>    | Emis lorsque le collapse s'ouvre                        |
| closed         | OutputEmitterRef<void>    | Emis lorsque le collapse se ferme                       |

### Methodes publiques

| Methode  | Signature | Description                                      |
| -------- | --------- | ------------------------------------------------ |
| toggle() | void      | Inverse l'etat du collapse                       |
| open()   | void      | Ouvre le collapse (ne fait rien si deja ouvert)  |
| close()  | void      | Ferme le collapse (ne fait rien si deja ferme)   |

### Slots de contenu

| Slot            | Selecteur          | Description                              |
| --------------- | ------------------ | ---------------------------------------- |
| collapse-header | [collapse-header]  | Contenu de l'en-tete cliquable           |
| Contenu defaut  | -                  | Contenu principal pliable/depliable      |

## Accessibilite

- Support complet des attributs ARIA (`aria-expanded`, `aria-controls`, `aria-labelledby`, `role="region"`)
- Navigation au clavier : `Enter`/`Space` pour toggle, `Escape` pour fermer
- Generation automatique d'IDs uniques pour les relations ARIA
- Etats desactives geres avec `disabled` attribute
- Focus visible pour la navigation clavier
