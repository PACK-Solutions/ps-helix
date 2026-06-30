# Changelog

All notable changes to **ps-helix** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Versioning policy:

- **MAJOR** — breaking changes to the public component API (`input`/`output`/`model`
  signatures, removed components, renamed exports).
- **MINOR** — new components/features and backwards-compatible improvements.
- **PATCH** — backwards-compatible bug fixes.

## [Unreleased]

Target: **5.2.0** (minor — no breaking changes to the public API).

### Added

- Headless a11y/overlay primitives under `ps-helix` (`a11y/`):
  - `PshFocusTrapDirective` — focus trap with initial focus and focus restoration,
    timed via `afterNextRender` (no `setTimeout`).
  - `PshLiveAnnouncerService` — single shared ARIA live region (polite/assertive).
  - `PshOverlayPositionService` — viewport collision detection / flip for popovers.
  - `PshClickOutsideDirective` — emits on clicks outside the host.
- `ModalService.isTopmost()` / `topmostModalId` to support stacked modals.
- jest-axe accessibility tests (foundation) and an anti-overflow test for the dropdown.

### Changed

- **Modal** consumes `PshFocusTrapDirective` (removed hand-rolled focus logic).
- **Tooltip** and **Dropdown** use `PshOverlayPositionService`; the dropdown now
  flips its placement to avoid viewport overflow.
- **Select** and **Dropdown** use `PshClickOutsideDirective` (shared close-on-outside).
- SSR safety: all browser-global access goes through `DOCUMENT` and is guarded by
  `isPlatformBrowser` / `document.defaultView`.
- Public types are now free of `any` (Table, Radio, Translation, Select use
  `unknown`/precise types instead).

### Fixed

- `Escape` (and backdrop click) now dismiss only the **topmost** modal when modals
  are stacked, instead of closing all of them.
- Restored a green unit-test suite on Angular 21 (change-detection shim for
  projected-content/OnPush specs); fixed numerous pre-existing failing/incorrect tests.
- Replaced focus-timing `setTimeout` with `afterNextRender` in the modal.

### Internal

- Added jest coverage thresholds, an ESLint + Prettier setup, a library bundle-size
  budget, and a GitHub Actions CI workflow (lint → test → build).
