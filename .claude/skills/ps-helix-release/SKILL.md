---
name: ps-helix-release
description: >-
  Release and publish a new version of the ps-helix Angular design system
  (npm package `ps-helix`, repo PACK-Solutions/ps-helix). Runs the full,
  repeatable release pipeline once the code change is ready: validation gate →
  version bump EVERYWHERE → logical grouped commits → PR → watch CI → merge →
  bump-synced publish to npm. USE THIS SKILL whenever the user wants to ship,
  release, publish, cut, or version a change to ps-helix — e.g. "publie une
  nouvelle version", "release a 6.0.x patch", "livre ce fix", "bump the version
  and publish", "ship this to npm" — even if they don't say the word "release".
  The centrepiece is the exhaustive "bump the version everywhere" checklist, a
  recurring source of missed spots.
---

# ps-helix release & publish

Ship a ready code change on `ps-helix` all the way to npm. The code is assumed
**already written** (this skill does not implement the change) and sitting in the
working tree, uncommitted.

## Autonomy contract

Invoking this skill (or the user saying "release/publish version X") **is the
authorization** to run the whole pipeline through `npm publish` without asking
for per-step confirmation. This is a deliberate, scoped override of the repo's
usual "commit/push/merge only when asked" rule — it applies **only** inside this
skill.

That autonomy is bounded by **hard aborts** — never publish broken or unverified
work. STOP and report to the user (do not work around) if:

- any validation gate fails (build, lint, tests, size, app build);
- the CI check on the PR is not green;
- `npm whoami` fails (npm auth not configured — the user must `npm login`);
- the working tree contains unexpected/unrelated changes you didn't make;
- the built `dist` version or peer deps don't match what you intend to publish.

Also: **never** put an npm/GitHub token in the conversation, a file, or git. Auth
comes from the user's `~/.npmrc` (already configured). Publishing is
irreversible — a bad npm version cannot be cleanly unpublished.

## Conventions (repo-wide)

- Run git / npm / gh commands **plain**, with no `rtk` prefix. The session's shell goes
  through lean-ctx, whose allowlist refuses `rtk` — and a refused segment rejects the
  **whole** command line, so nothing in it runs. The same allowlist refuses inline
  interpreter code (`node -e`): read a value out of a JSON file with `grep` instead
  (e.g. `grep -m1 '"version"' projects/ps-helix/package.json`).
- **Branch first**: never commit on `main`. Work on a feature branch.
- Commit messages end with a `Co-Authored-By` trailer naming **the model that actually
  wrote the commit** — take it verbatim from the attribution reminder Claude Code gives
  for the session (e.g. `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`).
  Never copy a model name from an older commit or from this file: a hard-coded name
  goes stale at the next model change, and the 7.1.0 commits (PR #45) shipped
  attributed to a model that did not write them.
- PR bodies end with: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
- **Do not remove** the change-detection shim in
  `projects/ps-helix/src/setup-jest.ts` (Angular OnPush-default test-harness fix)
  — pulling it turns ~170 specs red.

## Pipeline

Pick the version first. Semver: **patch** (x.y.Z) for a bug fix, **minor** for a
backwards-compatible feature, **major** for a breaking change (public API,
utility class names, or a bumped Angular peer range). Read the latest
`CHANGELOG.md` heading to see the current version.

### 1. Branch

If on `main`, branch: `git checkout -b <type>/<slug>` (e.g.
`fix/select-overlay`, `chore/angular-22`). Confirm the working tree only holds
the intended change (`git status`).

### 2. Validation gate (abort on any failure)

Run from the repo root (Git Bash / PowerShell both fine):

```bash
npm run build:lib     # ng build ps-helix — library compiles
npm run lint          # eslint --max-warnings 0 → must be 0 (exit 0)
npm test              # jest — ALL specs must pass
npm run size          # size-limit — under the 110 kB budget
```

If the change touches the demo app (templates/prose/version display), also build
the app: `npx ng build` (expect only pre-existing CSS-budget *warnings*, no
errors). Note: `npm run format:check` fails repo-wide (Prettier was never run in
bulk) — it is **not** a gate; only `lint` gates. Keep new files Prettier-clean
(`npx prettier --write <newfile>`) but don't reformat pre-existing files.

### 3. Bump the version EVERYWHERE

This is the step that gets missed. Update the package version in **all** of these
(old → new), and nowhere else:

| File | What to change |
|------|----------------|
| `package.json` (root) | `"version": "X"` |
| `projects/ps-helix/package.json` | `"version": "X"` (+ `peerDependencies` `@angular/*` only on a framework major) |
| `package-lock.json` | the **root project** version in 2 spots: top-level `"version"` (line ~3) and `packages[""].version` (line ~9). **Not** dependency versions. |
| `CHANGELOG.md` | new `## [X] - YYYY-MM-DD` entry (see step 4) |
| `README.md` (root) | badge `version-X-blue` + footer `**Version** : X` |
| `projects/ps-helix/README.md` | badge `npm-X-blue` + install `"ps-helix": "^X"` + footer `**Version**: X` |
| `src/AI_KNOWLEDGE.md` | header line `- **Version**: X` |
| `src/app/demo/pages/introduction/introduction-demo.component.ts` | `npmVersion = 'X'` (shown as a badge in the demo app) |

**Do NOT touch** (these are not the package version):
- `TypeScript-x.y.z` / `Angular-x.y.z` badges (those are toolchain versions).
- Historical `## [older]` CHANGELOG entries or `MIGRATION-*.md` filenames/refs.
- The `> **vX.Y.Z** — …` historical note in `AI_KNOWLEDGE.md`.
- Dependency versions inside `package-lock.json`.

Edit `package.json` / `package-lock.json` with the **Edit tool using surrounding
context** (e.g. the `"private": true,` / `"name": "..."` line above the version) —
these files are CRLF, so multi-line `\n` search-and-replace scripts miss. The
single-line doc refs (badges, `npmVersion`, footers) can be scripted.

**Verify no spot was missed** — this should return nothing but intentional
toolchain/historical hits:

```bash
grep -rn "<OLD_VERSION>" README.md projects/ps-helix/README.md src/AI_KNOWLEDGE.md \
  package.json projects/ps-helix/package.json \
  src/app/demo/pages/introduction/introduction-demo.component.ts | grep -vi typescript
```

If the release is a framework major (e.g. Angular bump), also sweep the docs for
stale references (`grep -rniE "angular 21|node.js.*18|typescript.*5\.9" ...`) and
correct the peer deps + README prerequisites.

### 4. CHANGELOG entry

Insert under `## [Unreleased]`, above the previous version:

```markdown
## [X] - YYYY-MM-DD

<one-line release nature, e.g. "Patch release." / "Major release — …">

### Fixed | Added | Changed | Breaking
- **`psh-<component>`** — what changed and why, from the user's perspective.
```

Use today's date. Mention any new public token/service/API.

### 5. Commit in logical groups

Group by concern so the history reads well. Typical split:
- `fix(<scope>): …` or `feat(<scope>)!: …` — the code change.
- `chore(release): X` — package.json ×2 + lockfile + CHANGELOG (+ doc version refs).
- optionally a separate `docs: …` for large doc sweeps.

Stage explicit paths per group (`git add <files…>`; use `git diff --cached
--name-only` to verify), then commit. **`git commit -F -` (stdin) fails with
"empty message"** — write the message to a temp file and use `git commit -F
<file>`. Each message ends with the Co-Authored-By trailer.

### 6. Push

`git push -u origin <branch>`.

### 7. Open the PR

Write a structured body to a temp file and: `gh pr create --base main --head
<branch> --title "<conventional title>" --body-file <file>`. Body sections:
**Summary** → one paragraph per commit group → **Validation** (build ✔ · lint 0 ·
N tests · bundle kB) → **Follow-up** (if any) → the Claude Code footer.

### 8. Watch CI (abort if red)

The single required check is **`Lint · Test · Build`** (about 1½ minutes). **Do not
poll it**: no `gh pr checks --watch`, no wait loop, no scheduled wake-up — the Claude
Code desktop app forbids polling CI from a session, and tracks the PR itself.

1. Bind the PR to the session: read `ccd_pr` → `get_status`; if it reports no PR, call
   `bind_pr` with the PR URL that `gh pr create` printed.
2. Read `get_status` **once**. It gives the check counts (`passing` / `failing` /
   `pending`), the failing check names and `mergeStateStatus`.
3. Still pending → **stop the turn** and tell the user the pipeline waits on CI; resume
   when they say it is green. (With their OK, `set_monitor` `auto_fix` makes the app wake
   the session on a CI failure, a merge conflict or a review comment — not on success.)
4. Before merging, read `get_status` once more: `failing: 0`, `pending: 0`, the check
   passing, `mergeStateStatus: CLEAN`. A single `gh pr checks <N>` (no `--watch`) is fine
   to name the job in the report.

Green → continue. Red → STOP, report the failing job. The pause in step 3 is the one
place the autonomy contract waits on the user.

### 9. Merge & sync

```bash
gh pr merge <N> --merge --delete-branch
git checkout main && git pull origin main
grep -m1 '"version"' projects/ps-helix/package.json   # == X
```

### 10. Publish to npm

Build fresh from `main`, confirm auth, sanity-check `dist`, then publish:

```bash
npm whoami                         # must print the user's npm login; abort if 401
npm run build:lib
grep -E '"(name|version)"' dist/ps-helix/package.json     # == ps-helix, X
grep -A6 '"peerDependencies"' dist/ps-helix/package.json   # @angular/* == ^22.x
npm publish ./dist/ps-helix --access public
```

The `publish:lib` npm script (`npm publish ./dist/ps-helix --access public`) is
equivalent. Optionally `--dry-run` first to preview the tarball. If a 2FA OTP is
required, the user's token must be an automation token (bypasses 2FA) or append
`--otp=<code>` — otherwise abort and ask.

### 11. Verify it's live

`npm view` reads a CDN cache that lags publish by seconds — cache-bust:

```bash
npm view ps-helix@X version --prefer-online     # == X
npm view ps-helix dist-tags --prefer-online      # latest: X
```

If it still shows the old version, wait ~30s and re-check (the publish output
`+ ps-helix@X` is the source of truth).

## Finish

Report: version published, PR number/merge commit, the validation numbers, and a
reminder that jsdom can't test pixel-level rendering — a real visual check in a
consuming app (e.g. inside a modal / scrollable container) is worth doing for
UI-affecting releases.
