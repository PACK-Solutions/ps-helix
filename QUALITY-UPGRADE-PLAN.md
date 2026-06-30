# ps-helix — Plan de montée en qualité (9/10)

> **Version cible : 5.2.0** (minor — aucun breaking change d'API publique).
> Document de travail issu d'un **audit du code réel en 5.1.3** (2026-06-30).
> Les affirmations ci-dessous ont été **vérifiées avec preuves `fichier:ligne`** et corrigées par rapport à la première version du prompt (6 corrections, signalées par 🔧).

---

## 0. Contexte & rôle

Tu interviens sur **ps-helix**, un design system Angular 21 (standalone + signals + OnPush) déjà **de bon niveau**. Le but n'est **pas** de réécrire mais de **consolider et durcir** l'existant.

**Déjà bon — NE PAS régresser, NE PAS réécrire :**
- API 100 % signaux : `input()` / `output()` / `model()`, `computed()`, `inject()`. **Conserver les signatures publiques.**
- Tous les composants `standalone` + `ChangeDetectionStrategy.OnPush`. **Garder.**
- Moteur de theming (dérivation OKLCH, garde-fou contraste WCAG, tokens `--customer-*`) excellent : **ne pas y toucher**, sauf sûreté SSR (Lot 2).
- Modale : focus-trap, restauration focus, `Escape`, scroll-lock déjà présents : **améliorer, pas supprimer.**
- Defaults par composant via tokens d'injection (`MODAL_CONFIG`, `TAG_CONFIG`, `TOOLTIP_CONFIG`…). **Garder ce pattern.**
- **`PshSelectComponent<T = unknown>` est déjà générique** → modèle à suivre pour Table (Lot 5).
- **Sidebar utilise déjà `requestAnimationFrame`** pour le timing focus → bon modèle à généraliser (Lot 3).
- **Le Tooltip implémente déjà collision/flip via `getBoundingClientRect`** (`tooltip.component.ts:156-199`) → à extraire/généraliser, pas à réinventer (Lot 1).

## 1. Objectif

Atteindre **9/10** en corrigeant 4 faiblesses transverses, **sans nouveau composant** :
1. Logique a11y/overlay dupliquée → **centraliser** dans des primitives légères maison.
2. Sûreté **SSR** incohérente → la rendre **systématique**.
3. Tests **a11y automatisés (axe)** absents → en ajouter ; durcir/étendre les tests clavier existants.
4. **Aucun outillage qualité / CI** → en mettre en place.

## 2. Guardrails absolus

- **TypeScript strict, zéro `any` explicite** (préférer `unknown` + génériques). Exceptions tolérées : signatures imposées par `ControlValueAccessor`.
  - 🔧 **Correction de cadrage** : le mode `strict` TS est **déjà pleinement activé** dans `tsconfig.json` (`strict`, `noImplicitAny`, `strictTemplates`, `noUncheckedIndexedAccess`, `strictStandalone`…) et **vérifié au build**. Le garde-fou manquant n'est donc PAS le strict mode, mais une **règle ESLint `@typescript-eslint/no-explicit-any`** (`noImplicitAny` n'attrape pas les `: any` explicites). Voir Lot 7.
- **Rétro-compat API publique** : aucun breaking sur les `input`/`output`/`model` existants. Génériser → fournir un type par défaut (`T = …`) pour ne rien casser. Cible **minor (5.2.0)**.
- **Tous les tests existants restent verts** (`npm test`). Aucune suppression de test pour faire passer le build — sauf réécriture justifiée de tests couplés à l'implémentation (voir §3, note tests).
- Angular moderne : **pas de `setTimeout`** pour le timing de rendu (`afterNextRender` / `afterRenderEffect`) ; **pas d'accès global `document`/`window` non gardé** (injecter `DOCUMENT`, garder via `isPlatformBrowser`).
- Primitives overlay/focus/announcer **maison et légères** — **ne pas tirer Angular CDK** en entier.

---

## 3. Lots de travail

### Lot 1 — Couche de primitives a11y/overlay mutualisée ⭐ levier principal

**Problème (VÉRIFIÉ) :** aucune primitive partagée n'existe (pas de dossier `a11y/`/`cdk/`, pas de directive focus-trap, pas de service announcer/overlay/position). La duplication est massive :
- **Focus-trap + Escape + restauration + scroll-lock** réimplémentés à la main dans `modal.component.ts` (focus-trap 271-275 & 416-440 ; Escape 262-266 ; restauration 325 & 405-411 ; scroll-lock 489-508).
- **Click-outside** dupliqué : `select.component.ts:178-185` et `dropdown.component.ts:77-87`.
- **Gestion Escape** dupliquée dans **5 composants** : select (297-302), dropdown (147-152), menu (175-180), sidebar (77-81), tooltip (`[keydown.escape]` l.39).
- **Navigation focus** (`focusNext/Previous/First/Last` + `focusItemAtIndex`) copiée-collée entre `dropdown.component.ts:195-268` et `menu.component.ts:184-224` (~40 lignes chacune, logique skip-disabled identique).
- **aria-live** implémenté en dur dans **15+ templates** (alert, info-card, toast, stepper…) au lieu d'une région centralisée.

**Action :** créer `projects/ps-helix/src/lib/a11y/` avec des primitives *headless*, puis **refactorer les composants pour les consommer** :

- `PshFocusTrapDirective` — piège le focus, focus initial, restauration à la destruction ; timing via `afterNextRender` (pas `setTimeout`). Gère le cas « focus actuellement hors conteneur ».
- `PshLiveAnnouncerService` — **une seule** région `aria-live` (polite/assertive) injectable ; consommée par toasts, erreurs de formulaire, chargements async.
- `PshOverlayPositionService` (ou directive `pshAnchoredTo`) — positionnement ancré avec **détection de collision / flip** (top/bottom/left/right + repli), basé sur `getBoundingClientRect`, recalculé au scroll/resize.
  - 🔧 **Correction** : ⚠️ contrairement à la 1ʳᵉ version du prompt, **le Tooltip fait DÉJÀ ce flip** (`tooltip.component.ts:156-199`). L'action correcte = **extraire cette logique du Tooltip vers le service partagé**, puis l'appliquer à **dropdown / select / menu** (qui n'ont AUCUN positionnement dynamique : CSS-classes only → peuvent déborder du viewport). Ne pas régresser le comportement actuel du Tooltip.
- `PshOverlayService` — `appendChild` au `body` + gestion de la **pile / z-index** des overlays (la modale le fait de façon ad hoc, `modal.component.ts:517-527`).

**Critères d'acceptation :**
- `select`, `dropdown`, `tooltip`, `menu`, `modal`, `sidebar` consomment ces primitives ; **plus aucune logique de focus/Escape/positionnement/click-outside dupliquée**.
- Un popover ouvert près d'un bord de viewport **bascule** au lieu de déborder — pour dropdown/select/menu **comme** pour tooltip (test à l'appui).

---

### Lot 2 — Sûreté SSR / hydration, cohérente 🔧 PÉRIMÈTRE ÉLARGI

**Problème (VÉRIFIÉ — plus large que la 1ʳᵉ version) :** ~**28 accès navigateur non gardés**, `DOCUMENT` **injecté nulle part**, `PLATFORM_ID` injecté dans seulement 4 composants et utilisé partiellement. Liste réelle des fichiers à traiter :

| Fichier | Accès non/mal gardés (exemples) |
|---|---|
| `modal.component.ts` | `document.activeElement` (325), `document.addEventListener` (374-375), `document.getElementById` (391,417), `document.body` scroll-lock (499,507) — **alors que `PLATFORM_ID` est injecté l.153 mais pas utilisé partout** |
| `theme.service.ts` | `document.documentElement.setAttribute` (80), `document.documentElement.style` (125-135), `localStorage` (197,207 — en try/catch mais **sans garde plateforme**) — **aucun `PLATFORM_ID` injecté** |
| `scroll.service.ts` | `window.scrollTo` (16) — non gardé |
| `input.component.ts` | `window.setTimeout/clearTimeout` (125-126,172-173,238-239) |
| `select.component.ts` | `document.addEventListener/removeEventListener` (183-184) |
| `tooltip.component.ts` | `window.innerWidth/innerHeight` (161-162) |
| `dropdown.component.ts` | `document.addEventListener/removeEventListener` (86,278) |
| `menu.component.ts` | `document.querySelector` (215) |
| `toast.component.ts` | `window.setTimeout/clearTimeout` (101,111,118) |
| `card.component.ts` | `window.innerWidth` (173), `document.documentElement` (160) |
| `info-card.component.ts` | `window.innerWidth` (205), `navigator.clipboard`/`window.isSecureContext` (246,253) |

`sidebar.component.ts` est **le bon modèle** (accès gardés par `isPlatformBrowser`, l.117/140/176).

**Action :**
- Injecter `DOCUMENT` (`@angular/common`) **partout** au lieu du global `document`.
- Garder **tout** accès navigateur via `isPlatformBrowser(inject(PLATFORM_ID))` et/ou le déplacer dans `afterNextRender` / `afterRenderEffect`.
- Envelopper `localStorage` dans `try/catch` **ET** une garde plateforme.

**Critères d'acceptation :** la lib se rend en SSR (`provideServerRendering` + smoke test serveur) **sans** `document is not defined` ni `localStorage is not defined`. `grep -rE "document\.|window\.|localStorage|navigator\.|getComputedStyle|matchMedia"` → **tous gardés ou via `DOCUMENT`** (0 accès non gardé hors `*.spec.ts`).

---

### Lot 3 — Remplacer les `setTimeout` de timing de rendu par `afterNextRender`

**Problème (VÉRIFIÉ) :** `modal.focusFirstElement()` (l.390) et `modal.restoreFocus()` (l.407) utilisent `setTimeout(…, 100)`. Aussi : `dropdown.focusItemAtIndex` (`setTimeout(0)`, l.268) et `menu.focusItemAtIndex` (`setTimeout(0)`, l.214).

> Note : les `setTimeout` **fonctionnels et configurables** (debounce input 238-239, délais tooltip 118/137, auto-dismiss toast 101, feedback copie info-card 260) **ne sont PAS concernés** — ce ne sont pas du timing de rendu.

**Action :** remplacer les `setTimeout` **de focus/rendu** par `afterNextRender` / `afterRenderEffect` (ou `requestAnimationFrame` comme déjà fait dans `sidebar`). Largement couvert par `PshFocusTrapDirective` (Lot 1).

**Critères d'acceptation :** plus aucun nombre magique de timing pour le focus ; tests de focus déterministes (sans `tick(100)`/`setTimeout(150)` arbitraire).

---

### Lot 4 — Bug : `Escape` ferme toutes les modales empilées

**Problème (VÉRIFIÉ) :** chaque `PshModalComponent` pose son `keydown` sur `document` (`modal.component.ts:374`) et l'`escapeHandler` (262-266) ne teste que `this.open()`, pas s'il est la modale du dessus. `ModalService` suit la pile via un **`Set`** et expose `register`/`unregister`/`isRegistered` mais **aucun `isTopmost`** (l.63-120). → avec 2 modales empilées, `Escape` les ferme **toutes**. Idem `handleBackdropClick` (479-482).

**Action :**
- Dans `ModalService`, remplacer/compléter le `Set` par une structure **ordonnée** et exposer `isTopmost(id): boolean` (ou `getTopmost(): string | null`).
- Ne déclencher `Escape` / clic-backdrop **que** pour la modale topmost.

**Critères d'acceptation :** avec 2 modales empilées, `Escape` ne ferme **que** celle du dessus (**test à créer — il n'en existe aucun aujourd'hui**, voir note tests §3).

---

### Lot 5 — Typage strict (éliminer les `any` publics) 🔧 PÉRIMÈTRE ÉLARGI

**Problème (VÉRIFIÉ — pas que Table) :** **9 `any` dans des types publics** (hors CVA) :
- **Table** : `TableRow` → `[key: string]: any` (`table.types.ts:42`) ; `sortFn?: (a: any, b: any) => number` (`table.types.ts:30`) ; `getCellValue(): any` (`table.component.ts:169`) ; `getNestedValue(obj: any): any` (143, privé) ; `PshTableComponent` **non générique** (l.37).
- **Radio** : `value = input<any>()` (`radio.component.ts:73`) ; `valueChange = output<any>()` (l.85) ; `RadioConfig.value: any` (`radio.types.ts:21`).
- **Translation** : `TranslationProvider.translate/translateAsync` → `params?: Record<string, any>` (`translation.service.ts:7-8`, + impl 18/23).

Tolérés : `select.component.ts:194-195` (`registerOnChange/OnTouched(fn: any)` — **CVA**, imposé par Angular).

**Action :**
- **Table** : génériser `PshTableComponent<T = Record<string, unknown>>`, `TableColumn<T>`, `TableRow = T` ; `getCellValue` → `unknown` (l'appelant restreint) ; `sortFn: (a: T, b: T) => number`. (Calquer sur `PshSelectComponent<T = unknown>` déjà en place.)
- **Radio** : génériser `PshRadioComponent<T = unknown>` ; `value = input<T>()`, `valueChange = output<T>()`, `RadioConfig<T>` ; type par défaut pour ne rien casser.
- **Translation** : `params?: Record<string, unknown>`.

**Critères d'acceptation :** **0 `any`** dans les types publics hors CVA ; `tsc --strict` propre ; aucun breaking (types par défaut fournis).

---

### Lot 6 — Tests a11y (axe) + durcissement/extension clavier 🔧 RECENTRÉ

**État réel (VÉRIFIÉ) :** ~30 specs / **~1600 tests**. Des **tests clavier APG existent déjà** et sont sérieux :
- select : Arrow↑↓, Home/End, Enter, Space, Escape, Tab, type-ahead, `aria-activedescendant`.
- modal : Escape, Tab, Shift+Tab, restauration focus.
- menu : Arrow↑↓←→, Home/End, Enter/Space, submenu, skip-disabled.

**Ce qui manque réellement :**
- **`jest-axe` totalement absent** (aucun test de violation WCAG). ← vrai gap principal.
- Tests clavier **faibles ou absents** sur : table (navigation cellules / tri / sélection), checkbox, radio, switch.
- **Timing de test fragile** : `modal.spec` `setTimeout(…, 150)` en dur (~604-643) ; `menu.spec` `jest.useFakeTimers()` non justifié → couplés au `setTimeout` de prod, **casseront avec le Lot 3** (à réécrire en déterministe).

**Action :**
- Ajouter `jest-axe`, asserter **0 violation** sur chaque composant (défaut + états clés : ouvert, erreur, disabled, loading).
- **Étendre** les tests clavier aux composants faibles (table, checkbox, radio, switch).
- **Réécrire** les tests couplés au timing pour qu'ils soient déterministes après le Lot 3.
- Ajouter le **test du Lot 4** (2 modales empilées → Escape ferme seulement la topmost) et le **test anti-débordement du Lot 1** (popover qui flip).

**Critères d'acceptation :** `jest-axe` vert sur tous les composants ; chaque carte clavier documentée est testée ; plus aucun timing arbitraire dans les tests de focus.

---

### Lot 7 — Outillage qualité + CI

**Problème (VÉRIFIÉ) :** devDeps = Jest + build Angular uniquement. **Pas d'ESLint, pas de Prettier, pas de `coverageThreshold` (jest.config.js), pas de budget sur la lib** (budgets seulement sur l'app dans `angular.json`), **pas de `.github/`**, **pas de `CHANGELOG.md`**.

**Action :**
- Ajouter `angular-eslint` + Prettier + scripts `lint` / `format`, **avec la règle `@typescript-eslint/no-explicit-any` activée** (c'est *ça* le garde-fou anti-`any`, pas le tsconfig qui est déjà strict).
- Ajouter `.github/workflows/ci.yml` : install → `lint` → `test --coverage` → `build:lib`.
- Ajouter `coverageThreshold` dans `jest.config.js` (ex. 80 % lignes/branches — calibrer sur la couverture réelle actuelle, sans tricher).
- Ajouter un **budget de bundle sur le fesm publié de la lib** (`size-limit` ou budgets Angular côté projet `ps-helix`).
- Créer `CHANGELOG.md` (Keep a Changelog) ; documenter la politique semver.

**Critères d'acceptation :** CI verte sur une PR ; seuil de couverture **et** budget de bundle **bloquants**.

---

### Lot 8 — Docs a11y vivantes 🔧 RÉDUIT (en grande partie déjà fait)

**État réel (VÉRIFIÉ) :** **28 fichiers `.md`** par composant avec **cartes clavier + tables ARIA déjà rédigées** (SELECT.md, MODAL.md, MENU.md…), + sections « Navigation au Clavier » dans la démo. **Ce travail est largement fait.**

**Ce qui manque :**
- **Page « Accessibility statement » centralisée** (cible WCAG 2.1 AA, limites connues) — absente.
- **Cohérence** doc ↔ code après le refacto des Lots 1-5 (mettre à jour les `.md` impactés).

**Critères d'acceptation :** page Accessibility statement présente ; cartes clavier/ARIA toujours cohérentes avec le code après refacto.

---

## 4. Ordre d'exécution

1. **Lot 2** (SSR) + **Lot 4** (bug Escape) — ciblé, sans risque, gain immédiat.
2. **Lot 5** (typage Table + Radio + Translation) — isolé, vérifiable par `tsc`.
3. **Lot 1** (primitives) + **Lot 3** (`afterNextRender`) — gros refacto, un composant à la fois, tests verts.
4. **Lot 6** (axe + clavier) — après refacto, pour figer le comportement.
5. **Lot 7** (CI/outillage) — pour verrouiller.
6. **Lot 8** (page a11y + synchro docs) — finition.

## 5. Définition de « terminé » (checklist 9/10)

- [ ] `npm run lint` et `npm test` verts ; couverture ≥ seuil bloquant.
- [ ] `jest-axe` : 0 violation sur tous les composants.
- [ ] Build SSR sans `document/localStorage is not defined` ; 0 accès navigateur non gardé hors specs.
- [ ] 0 `any` public hors CVA (Table + Radio + Translation génériques) ; `tsc --strict` propre.
- [ ] Focus-trap, Escape, positionnement, click-outside : **une seule** implémentation partagée.
- [ ] Popovers anti-débordement (collision/flip) testés sur dropdown/select/menu **et** tooltip.
- [ ] Escape sur modales empilées : ferme seulement la topmost (test dédié).
- [ ] Plus aucun `setTimeout` de timing de rendu ; tests de focus déterministes.
- [ ] CI GitHub Actions verte, budget de bundle lib bloquant, `CHANGELOG.md` à jour.
- [ ] Page « Accessibility statement » + docs `.md` synchronisées.
- [ ] Aucune régression d'API publique (semver minor → 5.2.0).
