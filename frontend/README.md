# NutriCare React application

This is the integrated, runnable React and Vite frontend. It imports one independently owned feature package from each numbered member folder.

## Structure

- `src/App.tsx` — shared shell, role-aware navigation and dashboard
- `src/styles.css` — the single NutriCare design-token and responsive-style source
- `public/og.png` — original social preview artwork
- `vite.config.ts` — aliases that connect the six member feature packages

From the repository root, run `npm install` followed by `npm run dev`. The interface uses forest green, eucalyptus, sage and warm white throughout; amber and red appear only for status and clinical warnings.

The demo interface contains fictional data only. Local API calls target `http://localhost:8080/api/v1` unless `VITE_API_BASE_URL` is changed.
