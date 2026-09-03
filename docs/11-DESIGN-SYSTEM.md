# NutriCare Interface Design System

## Product character

NutriCare uses a calm clinical workspace rather than a generic administration template. Its visual language combines care, clarity and measured progress. Dense operational data is presented in quiet cards with strong hierarchy and small, useful status cues.

## Shared palette

| Token | Value | Use |
| --- | --- | --- |
| Forest | `#123F34` | Navigation, primary headings and strong contrast |
| Green | `#2B795D` | Primary actions, progress and active states |
| Leaf | `#55A17E` | Supporting progress details and focus cues |
| Sage | `#DCEEE4` | Selected controls, avatars and soft highlights |
| Mist | `#EDF5F0` | Secondary surfaces and hover states |
| Warm white | `#FBFCF9` | Main cards and navigation bar |
| Amber | `#D99B43` | Pending states and attention indicators only |
| Clinical red | `#B84F3A` | High-priority clinical warnings only |

All six frontend modules inherit these tokens from `frontend/src/styles.css`. Feature packages must not introduce an unrelated brand color.

## Typography and components

- Manrope is used for headings and numeric emphasis.
- DM Sans is used for interface text, forms and tables.
- Cards use a consistent 12-17 px corner radius, green-tinted borders and restrained shadows.
- Lucide icons are used across navigation, actions and feedback.
- Keyboard focus is always visible with a high-contrast sage ring.
- The signed-in account's server-assigned role controls available navigation without duplicating layouts.

## Imagery

The working application intentionally prioritizes patient data and care tasks instead of decorative stock photography. Original artwork is retained for the public social preview. Any future public image must have a clear care or nutrition purpose, suitable licensing, descriptive alternative text and colors that harmonize with this palette.
