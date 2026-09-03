# Git and Contribution Workflow

## Branches

- `main` must always build.
- Each member works in `feature/<module>-<short-description>`.
- Pull requests target `main`; direct pushes are avoided.

## Pull-request checklist

- Change stays inside the owner module unless an integration change is declared.
- New/changed endpoint is reflected in `openapi.yaml`.
- Database change uses a new Flyway version and safe fictional fixtures.
- Relevant tests pass and evidence is linked.
- Authorization and prohibited-data rules were checked.
- README/module docs describe setup or behavior changes.
- At least one other member reviews cross-module changes.

## Commit style

Use `feat:`, `fix:`, `test:`, `docs:`, `refactor:` or `chore:` followed by a concise description. Each module’s `docs/CONTRIBUTION.md` records task, commits/PRs, review partner, tests and evidence location.

