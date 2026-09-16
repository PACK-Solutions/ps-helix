# Token reference

> **Generated from the stylesheets — do not edit by hand.**
> Run `npm run docs:tokens` after changing anything under `src/lib/styles/`.

**407 tokens** across 8 files.

Every custom property the library exposes is namespaced `--psh-*`. The unprefixed names
used before 7.0.0 remain available through the opt-in `styles/compat.css`.

## Theme

229 semantic tokens. Each one is redefined in `dark.css`; the two themes are kept symmetrical, and this generator fails if they drift apart.

| Token | Light | Dark |
|---|---|---|
| `--psh-surface-0` | `#ffffff` | `#0a0d16` |
| `--psh-surface-50` | `#f8fafc` | `#141a27` |
| `--psh-surface-100` | `#f1f5f9` | `#1e293b` |
| `--psh-surface-200` | `#e2e8f0` | `#334155` |
| `--psh-surface-300` | `#cbd5e1` | `#475569` |
| `--psh-surface-400` | `#94a3b8` | `#64748b` |
| `--psh-surface-500` | `#64748b` | `#94a3b8` |
| `--psh-surface-600` | `#475569` | `#cbd5e1` |
| `--psh-surface-700` | `#334155` | `#e2e8f0` |
| `--psh-surface-800` | `#1e293b` | `#f1f5f9` |
| `--psh-surface-900` | `#0f172a` | `#f8fafc` |
| `--psh-surface-900-rgb` | `15, 23, 42` | `248, 250, 252` |
| `--psh-surface-ground` | `var(--psh-surface-50)` | `var(--psh-surface-0)` |
| `--psh-surface-section` | `var(--psh-surface-0)` | `var(--psh-surface-50)` |
| `--psh-alert-info-bg` | `rgba(11, 1, 145, 0.1)` | `rgba(107, 95, 227, 0.15)` |
| `--psh-alert-info-border-color` | `#0B0191` | `#6B5FE3` |
| `--psh-alert-info-text-color` | `#0B0191` | `#A5B4FC` |
| `--psh-surface-card` | `var(--psh-surface-0)` | `var(--psh-surface-50)` |
| `--psh-surface-overlay` | `var(--psh-surface-0)` | `var(--psh-surface-200)` |
| `--psh-surface-border` | `var(--psh-surface-200)` | `var(--psh-surface-300)` |
| `--psh-surface-hover` | `var(--psh-surface-100)` | `rgba(255, 255, 255, 0.05)` |
| `--psh-text-color` | `var(--psh-surface-800)` | `rgba(255, 255, 255, 0.95)` |
| `--psh-text-color-secondary` | `var(--psh-surface-600)` | `rgba(255, 255, 255, 0.75)` |
| `--psh-text-color-tertiary` | `var(--psh-surface-500)` | `rgba(255, 255, 255, 0.6)` |
| `--psh-text-color-disabled` | `var(--psh-surface-400)` | `rgba(255, 255, 255, 0.4)` |
| `--psh-text-on-primary` | `#FFFFFF` | `#FFFFFF` |
| `--psh-text-on-secondary` | `#FFFFFF` | `#FFFFFF` |
| `--psh-text-on-success` | `#FFFFFF` | `#000000` |
| `--psh-text-on-warning` | `#FFFFFF` | `#000000` |
| `--psh-text-on-danger` | `#FFFFFF` | `#000000` |
| `--psh-text-on-info` | `#FFFFFF` | `#000000` |
| `--psh-text-on-neutral` | `#FFFFFF` | `#000000` |
| `--psh-text-on-surface` | `var(--psh-text-color)` | `var(--psh-text-color)` |
| `--psh-text-on-dark` | `#FFFFFF` | `#FFFFFF` |
| `--psh-text-on-light` | `#0a0d16` | `#0a0d16` |
| `--psh-blue-50` | `#EEF2FF` | `#312E81` |
| `--psh-blue-100` | `#E0E7FF` | `#3730A3` |
| `--psh-blue-200` | `#C7D2FE` | `#4338CA` |
| `--psh-blue-300` | `#A5B4FC` | `#4F46E5` |
| `--psh-blue-400` | `#818CF8` | `#6366F1` |
| `--psh-blue-500` | `#6366F1` | `#818CF8` |
| `--psh-blue-600` | `#4F46E5` | `#A5B4FC` |
| `--psh-blue-700` | `#4338CA` | `#C7D2FE` |
| `--psh-blue-800` | `#3730A3` | `#E0E7FF` |
| `--psh-blue-900` | `#312E81` | `#EEF2FF` |
| `--psh-red-50` | `#FEF2F2` | `#7F1D1D` |
| `--psh-red-100` | `#FEE2E2` | `#991B1B` |
| `--psh-red-200` | `#FECACA` | `#B91C1C` |
| `--psh-red-300` | `#FCA5A5` | `#DC2626` |
| `--psh-red-400` | `#F87171` | `#EF4444` |
| `--psh-red-500` | `#EF4444` | `#F87171` |
| `--psh-red-600` | `#DC2626` | `#FCA5A5` |
| `--psh-red-700` | `#B91C1C` | `#FECACA` |
| `--psh-red-800` | `#991B1B` | `#FEE2E2` |
| `--psh-red-900` | `#7F1D1D` | `#FEF2F2` |
| `--psh-green-50` | `#F0FDF4` | `#14532D` |
| `--psh-green-100` | `#DCFCE7` | `#166534` |
| `--psh-green-200` | `#BBF7D0` | `#15803D` |
| `--psh-green-300` | `#86EFAC` | `#16A34A` |
| `--psh-green-400` | `#4ADE80` | `#22C55E` |
| `--psh-green-500` | `#22C55E` | `#4ADE80` |
| `--psh-green-600` | `#16A34A` | `#86EFAC` |
| `--psh-green-700` | `#15803D` | `#BBF7D0` |
| `--psh-green-800` | `#166534` | `#DCFCE7` |
| `--psh-green-900` | `#14532D` | `#F0FDF4` |
| `--psh-orange-50` | `#FFF7ED` | `#7C2D12` |
| `--psh-orange-100` | `#FFEDD5` | `#9A3412` |
| `--psh-orange-200` | `#FED7AA` | `#C2410C` |
| `--psh-orange-300` | `#FDBA74` | `#EA580C` |
| `--psh-orange-400` | `#FB923C` | `#F97316` |
| `--psh-orange-500` | `#F97316` | `#FB923C` |
| `--psh-orange-600` | `#EA580C` | `#FDBA74` |
| `--psh-orange-700` | `#C2410C` | `#FED7AA` |
| `--psh-orange-800` | `#9A3412` | `#FFEDD5` |
| `--psh-orange-900` | `#7C2D12` | `#FFF7ED` |
| `--psh-yellow-50` | `#FEFCE8` | `#713F12` |
| `--psh-yellow-100` | `#FEF9C3` | `#854D0E` |
| `--psh-yellow-200` | `#FEF08A` | `#A16207` |
| `--psh-yellow-300` | `#FDE047` | `#CA8A04` |
| `--psh-yellow-400` | `#FACC15` | `#EAB308` |
| `--psh-yellow-500` | `#EAB308` | `#FACC15` |
| `--psh-yellow-600` | `#CA8A04` | `#FDE047` |
| `--psh-yellow-700` | `#A16207` | `#FEF08A` |
| `--psh-yellow-800` | `#854D0E` | `#FEF9C3` |
| `--psh-yellow-900` | `#713F12` | `#FEFCE8` |
| `--psh-violet-50` | `#F5F3FF` | `#4C1D95` |
| `--psh-violet-100` | `#EDE9FE` | `#5B21B6` |
| `--psh-violet-200` | `#DDD6FE` | `#6D28D9` |
| `--psh-violet-300` | `#C4B5FD` | `#7C3AED` |
| `--psh-violet-400` | `#A78BFA` | `#8B5CF6` |
| `--psh-violet-500` | `#8B5CF6` | `#A78BFA` |
| `--psh-violet-600` | `#7C3AED` | `#C4B5FD` |
| `--psh-violet-700` | `#6D28D9` | `#DDD6FE` |
| `--psh-violet-800` | `#5B21B6` | `#EDE9FE` |
| `--psh-violet-900` | `#4C1D95` | `#F5F3FF` |
| `--psh-cyan-50` | `#ECFEFF` | `#164E63` |
| `--psh-cyan-100` | `#CFFAFE` | `#155E75` |
| `--psh-cyan-200` | `#A5F3FC` | `#0E7490` |
| `--psh-cyan-300` | `#67E8F9` | `#0891B2` |
| `--psh-cyan-400` | `#22D3EE` | `#06B6D4` |
| `--psh-cyan-500` | `#06B6D4` | `#22D3EE` |
| `--psh-cyan-600` | `#0891B2` | `#67E8F9` |
| `--psh-cyan-700` | `#0E7490` | `#A5F3FC` |
| `--psh-cyan-800` | `#155E75` | `#CFFAFE` |
| `--psh-cyan-900` | `#164E63` | `#ECFEFF` |
| `--psh-teal-50` | `#F0FDFA` | `#134E4A` |
| `--psh-teal-100` | `#CCFBF1` | `#115E59` |
| `--psh-teal-200` | `#99F6E4` | `#0F766E` |
| `--psh-teal-300` | `#5EEAD4` | `#0D9488` |
| `--psh-teal-400` | `#2DD4BF` | `#14B8A6` |
| `--psh-teal-500` | `#14B8A6` | `#2DD4BF` |
| `--psh-teal-600` | `#0D9488` | `#5EEAD4` |
| `--psh-teal-700` | `#0F766E` | `#99F6E4` |
| `--psh-teal-800` | `#115E59` | `#CCFBF1` |
| `--psh-teal-900` | `#134E4A` | `#F0FDFA` |
| `--psh-emerald-50` | `#ECFDF5` | `#064E3B` |
| `--psh-emerald-100` | `#D1FAE5` | `#065F46` |
| `--psh-emerald-200` | `#A7F3D0` | `#047857` |
| `--psh-emerald-300` | `#6EE7B7` | `#059669` |
| `--psh-emerald-400` | `#34D399` | `#10B981` |
| `--psh-emerald-500` | `#10B981` | `#34D399` |
| `--psh-emerald-600` | `#059669` | `#6EE7B7` |
| `--psh-emerald-700` | `#047857` | `#A7F3D0` |
| `--psh-emerald-800` | `#065F46` | `#D1FAE5` |
| `--psh-emerald-900` | `#064E3B` | `#ECFDF5` |
| `--psh-indigo-50` | `#EEF2FF` | `#312E81` |
| `--psh-indigo-100` | `#E0E7FF` | `#3730A3` |
| `--psh-indigo-200` | `#C7D2FE` | `#4338CA` |
| `--psh-indigo-300` | `#A5B4FC` | `#4F46E5` |
| `--psh-indigo-400` | `#818CF8` | `#6366F1` |
| `--psh-indigo-500` | `#6366F1` | `#818CF8` |
| `--psh-indigo-600` | `#4F46E5` | `#A5B4FC` |
| `--psh-indigo-700` | `#4338CA` | `#C7D2FE` |
| `--psh-indigo-800` | `#3730A3` | `#E0E7FF` |
| `--psh-indigo-900` | `#312E81` | `#EEF2FF` |
| `--psh-purple-50` | `#FAF5FF` | `#581C87` |
| `--psh-purple-100` | `#F3E8FF` | `#6B21A8` |
| `--psh-purple-200` | `#E9D5FF` | `#7C3AED` |
| `--psh-purple-300` | `#D8B4FE` | `#9333EA` |
| `--psh-purple-400` | `#C084FC` | `#A855F7` |
| `--psh-purple-500` | `#A855F7` | `#C084FC` |
| `--psh-purple-600` | `#9333EA` | `#D8B4FE` |
| `--psh-purple-700` | `#7C3AED` | `#E9D5FF` |
| `--psh-purple-800` | `#6B21A8` | `#F3E8FF` |
| `--psh-purple-900` | `#581C87` | `#FAF5FF` |
| `--psh-fuchsia-50` | `#FDF4FF` | `#701A75` |
| `--psh-fuchsia-100` | `#FAE8FF` | `#86198F` |
| `--psh-fuchsia-200` | `#F5D0FE` | `#A21CAF` |
| `--psh-fuchsia-300` | `#F0ABFC` | `#C026D3` |
| `--psh-fuchsia-400` | `#E879F9` | `#D946EF` |
| `--psh-fuchsia-500` | `#D946EF` | `#E879F9` |
| `--psh-fuchsia-600` | `#C026D3` | `#F0ABFC` |
| `--psh-fuchsia-700` | `#A21CAF` | `#F5D0FE` |
| `--psh-fuchsia-800` | `#86198F` | `#FAE8FF` |
| `--psh-fuchsia-900` | `#701A75` | `#FDF4FF` |
| `--psh-rose-50` | `#FFF1F2` | `#881337` |
| `--psh-rose-100` | `#FFE4E6` | `#9F1239` |
| `--psh-rose-200` | `#FECDD3` | `#BE123C` |
| `--psh-rose-300` | `#FDA4AF` | `#E11D48` |
| `--psh-rose-400` | `#FB7185` | `#F43F5E` |
| `--psh-rose-500` | `#F43F5E` | `#FB7185` |
| `--psh-rose-600` | `#E11D48` | `#FDA4AF` |
| `--psh-rose-700` | `#BE123C` | `#FECDD3` |
| `--psh-rose-800` | `#9F1239` | `#FFE4E6` |
| `--psh-rose-900` | `#881337` | `#FFF1F2` |
| `--psh-amber-50` | `#FFFBEB` | `#78350F` |
| `--psh-amber-100` | `#FEF3C7` | `#92400E` |
| `--psh-amber-200` | `#FDE68A` | `#B45309` |
| `--psh-amber-300` | `#FCD34D` | `#D97706` |
| `--psh-amber-400` | `#FBBF24` | `#F59E0B` |
| `--psh-amber-500` | `#F59E0B` | `#FBBF24` |
| `--psh-amber-600` | `#D97706` | `#FCD34D` |
| `--psh-amber-700` | `#B45309` | `#FDE68A` |
| `--psh-amber-800` | `#92400E` | `#FEF3C7` |
| `--psh-amber-900` | `#78350F` | `#FFFBEB` |
| `--psh-pink-50` | `#FDF2F8` | `#831843` |
| `--psh-pink-100` | `#FCE7F3` | `#9D174D` |
| `--psh-pink-200` | `#FBCFE8` | `#BE185D` |
| `--psh-pink-300` | `#F9A8D4` | `#DB2777` |
| `--psh-pink-400` | `#F472B6` | `#EC4899` |
| `--psh-pink-500` | `#EC4899` | `#F472B6` |
| `--psh-pink-600` | `#DB2777` | `#F9A8D4` |
| `--psh-pink-700` | `#BE185D` | `#FBCFE8` |
| `--psh-pink-800` | `#9D174D` | `#FCE7F3` |
| `--psh-pink-900` | `#831843` | `#FDF2F8` |
| `--psh-primary-color` | `var(--psh-customer-primary-color, var(--customer-primary-color, #0B0191))` | `var(--psh-customer-primary-color, var(--customer-primary-color, #8178F7))` |
| `--psh-primary-color-light` | `var(--psh-customer-primary-color-light, var(--customer-primary-color-light, #0F02C4))` | `var(--psh-customer-primary-color-light, var(--customer-primary-color-light, #8A7FED))` |
| `--psh-primary-color-lighter` | `var(--psh-customer-primary-color-lighter, var(--customer-primary-color-lighter, #4A3FD9))` | `var(--psh-customer-primary-color-lighter, var(--customer-primary-color-lighter, #A99FF7))` |
| `--psh-primary-color-dark` | `var(--psh-customer-primary-color-dark, var(--customer-primary-color-dark, #09017A))` | `var(--psh-customer-primary-color-dark, var(--customer-primary-color-dark, #4A3FD9))` |
| `--psh-primary-color-darker` | `var(--psh-customer-primary-color-darker, var(--customer-primary-color-darker, #07015E))` | `var(--psh-customer-primary-color-darker, var(--customer-primary-color-darker, #3730A3))` |
| `--psh-primary-color-text` | `var(--psh-customer-primary-color-text, var(--customer-primary-color-text, #FFFFFF))` | `var(--psh-customer-primary-color-text, var(--customer-primary-color-text, #FFFFFF))` |
| `--psh-primary-color-rgb` | `var(--psh-customer-primary-color-rgb, var(--customer-primary-color-rgb, 11, 1, 145))` | `var(--psh-customer-primary-color-rgb, var(--customer-primary-color-rgb, 107, 95, 227))` |
| `--psh-primary-gradient` | `linear-gradient(to right, var(--psh-primary-color-darker), var(--psh-primary-color-light))` | `linear-gradient(to right, var(--psh-primary-color), var(--psh-primary-color-light))` |
| `--psh-primary-gradient-hover` | `linear-gradient(to right, var(--psh-primary-color-dark), var(--psh-primary-color-lighter))` | `linear-gradient(to right, var(--psh-primary-color), var(--psh-primary-color-lighter))` |
| `--psh-primary-gradient-reversed` | `linear-gradient(to left, var(--psh-primary-color-darker), var(--psh-primary-color-light))` | `linear-gradient(to left, var(--psh-primary-color-dark), var(--psh-primary-color-light))` |
| `--psh-secondary-color` | `var(--psh-customer-secondary-color, var(--customer-secondary-color, #5E5E5E))` | `var(--psh-customer-secondary-color, var(--customer-secondary-color, #5B5A5A))` |
| `--psh-secondary-color-light` | `var(--psh-customer-secondary-color-light, var(--customer-secondary-color-light, #7B7B7B))` | `var(--psh-customer-secondary-color-light, var(--customer-secondary-color-light, #838181))` |
| `--psh-secondary-color-lighter` | `var(--psh-customer-secondary-color-lighter, var(--customer-secondary-color-lighter, #969696))` | `var(--psh-customer-secondary-color-lighter, var(--customer-secondary-color-lighter, #9E9D9D))` |
| `--psh-secondary-color-dark` | `var(--psh-customer-secondary-color-dark, var(--customer-secondary-color-dark, #404040))` | `var(--psh-customer-secondary-color-dark, var(--customer-secondary-color-dark, #4E4D4D))` |
| `--psh-secondary-color-darker` | `var(--psh-customer-secondary-color-darker, var(--customer-secondary-color-darker, #2B2B2B))` | `var(--psh-customer-secondary-color-darker, var(--customer-secondary-color-darker, #3D3838))` |
| `--psh-secondary-color-text` | `var(--psh-customer-secondary-color-text, var(--customer-secondary-color-text, #FFFFFF))` | `var(--psh-customer-secondary-color-text, var(--customer-secondary-color-text, #FFFFFF))` |
| `--psh-secondary-color-rgb` | `var(--psh-customer-secondary-color-rgb, var(--customer-secondary-color-rgb, 94, 94, 94))` | `var(--psh-customer-secondary-color-rgb, var(--customer-secondary-color-rgb, 48, 48, 48))` |
| `--psh-success-color` | `#0F853A` | `#12B94F` |
| `--psh-success-color-rgb` | `15, 133, 58` | `18, 185, 79` |
| `--psh-success-color-text` | `#FFFFFF` | `#000000` |
| `--psh-info-color` | `#1F5FBF` | `#5B9BFF` |
| `--psh-info-color-rgb` | `31, 95, 191` | `91, 155, 255` |
| `--psh-info-color-text` | `#FFFFFF` | `#000000` |
| `--psh-neutral-color` | `#5A6070` | `#9AA0B0` |
| `--psh-neutral-color-rgb` | `90, 96, 112` | `154, 160, 176` |
| `--psh-neutral-color-text` | `#FFFFFF` | `#000000` |
| `--psh-warning-color` | `#b25310` | `#E07518` |
| `--psh-warning-color-rgb` | `178, 83, 16` | `224, 117, 24` |
| `--psh-warning-color-text` | `#FFFFFF` | `#000000` |
| `--psh-danger-color` | `#D92626` | `#FF4040` |
| `--psh-danger-color-rgb` | `217, 38, 38` | `255, 64, 64` |
| `--psh-danger-color-text` | `#FFFFFF` | `#000000` |
| `--psh-chart-text-color` | `var(--psh-text-color)` | `var(--psh-text-color)` |
| `--psh-chart-grid-color` | `var(--psh-surface-200)` | `var(--psh-surface-border)` |
| `--psh-chart-primary-color` | `var(--psh-primary-color)` | `var(--psh-primary-color)` |
| `--psh-chart-secondary-color` | `var(--psh-secondary-color)` | `var(--psh-secondary-color)` |
| `--psh-chart-success-color` | `var(--psh-success-color)` | `var(--psh-success-color)` |
| `--psh-chart-warning-color` | `var(--psh-warning-color)` | `var(--psh-warning-color)` |
| `--psh-chart-danger-color` | `var(--psh-danger-color)` | `var(--psh-danger-color)` |
| `--psh-chart-tooltip-background` | `var(--psh-surface-card)` | `var(--psh-surface-card)` |
| `--psh-chart-tooltip-text` | `var(--psh-text-color)` | `var(--psh-text-color)` |
| `--psh-chart-legend-text` | `var(--psh-text-color)` | `var(--psh-text-color)` |
| `--psh-background-opacity` | `0.5` | `0.3` |
| `--psh-body-gradient` | `radial-gradient(184.52% 111.8% at 100% 0%, #E0E4F7 0%, rgba(255, 255, 255, 0.00) 100%)` | `radial-gradient(325.86% 141.42% at 100% 0%, #1A1F33 0%, #0A0D16 100%)` |

## Motion

| Token | Value | |
|---|---|---|
| `--psh-animation-duration-fast` | `0.15s` |  |
| `--psh-animation-duration-normal` | `0.2s` |  |
| `--psh-animation-duration-default` | `0.3s` |  |
| `--psh-animation-duration-slow` | `0.5s` |  |
| `--psh-animation-easing-default` | `ease` |  |
| `--psh-animation-easing-in` | `ease-in` |  |
| `--psh-animation-easing-out` | `ease-out` |  |
| `--psh-animation-easing-in-out` | `ease-in-out` |  |
| `--psh-animation-easing-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` |  |
| `--psh-animation-easing-linear` | `linear` |  |
| `--psh-animation-loop-fast` | `0.8s` |  |
| `--psh-animation-loop-normal` | `1s` |  |
| `--psh-animation-loop-slow` | `1.5s` |  |
| `--psh-animation-loop-slower` | `2s` |  |
| `--psh-animation-distance-sm` | `10px` |  |
| `--psh-animation-distance-md` | `20px` |  |
| `--psh-animation-distance-lg` | `30px` |  |

## Breakpoints

| Token | Value | |
|---|---|---|
| `--psh-breakpoint-xs` | `30em` | 480px |
| `--psh-breakpoint-sm` | `40em` | 640px |
| `--psh-breakpoint-md` | `48em` | 768px |
| `--psh-breakpoint-lg` | `64em` | 1024px |
| `--psh-breakpoint-xl` | `80em` | 1280px |
| `--psh-breakpoint-2xl` | `96em` | 1536px |

## Shadows, focus rings and z-index layers

| Token | Value | |
|---|---|---|
| `--psh-shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` |  |
| `--psh-shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` |  |
| `--psh-shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` |  |
| `--psh-z-index-navigation` | `50` |  |
| `--psh-z-index-dropdown` | `100` |  |
| `--psh-z-index-tooltip` | `200` |  |
| `--psh-z-index-modal-backdrop` | `999` |  |
| `--psh-z-index-modal` | `1000` |  |
| `--psh-z-index-overlay` | `1100` | body-teleported popovers (select/dropdown/menu) above modals |
| `--psh-z-index-toast` | `9999` |  |
| `--psh-focus-outline-width` | `2px` |  |
| `--psh-focus-outline-style` | `solid` |  |
| `--psh-focus-outline-color` | `var(--psh-primary-color)` |  |
| `--psh-focus-outline-offset` | `2px` |  |
| `--psh-focus-ring-width` | `3px` |  |
| `--psh-focus-ring-color` | `rgba(var(--psh-primary-color-rgb), 0.2)` |  |
| `--psh-focus-ring-error` | `rgba(var(--psh-danger-color-rgb), 0.2)` |  |
| `--psh-focus-ring-success` | `rgba(var(--psh-success-color-rgb), 0.2)` |  |
| `--psh-focus-ring-warning` | `rgba(var(--psh-warning-color-rgb), 0.2)` |  |
| `--psh-opacity-disabled` | `0.6` |  |
| `--psh-opacity-loading` | `0.7` |  |

## Layout

| Token | Value | |
|---|---|---|
| `--psh-container-padding-sm` | `var(--psh-spacing-md)` |  |
| `--psh-container-padding-md` | `var(--psh-spacing-lg)` |  |
| `--psh-container-padding-lg` | `var(--psh-spacing-xl)` |  |
| `--psh-container-max-width` | `80rem` | 1280px |
| `--psh-grid-gap-sm` | `var(--psh-spacing-sm)` |  |
| `--psh-grid-gap-md` | `var(--psh-spacing-md)` |  |
| `--psh-grid-gap-lg` | `var(--psh-spacing-lg)` |  |
| `--psh-flex-none` | `0 0 auto` |  |
| `--psh-flex-auto` | `1 1 auto` |  |
| `--psh-flex-initial` | `0 1 auto` |  |
| `--psh-grid-cols-1` | `repeat(1, minmax(0, 1fr))` |  |
| `--psh-grid-cols-2` | `repeat(2, minmax(0, 1fr))` |  |
| `--psh-grid-cols-3` | `repeat(3, minmax(0, 1fr))` |  |
| `--psh-grid-cols-4` | `repeat(4, minmax(0, 1fr))` |  |
| `--psh-grid-cols-6` | `repeat(6, minmax(0, 1fr))` |  |
| `--psh-grid-cols-12` | `repeat(12, minmax(0, 1fr))` |  |
| `--psh-select-max-width` | `var(--psh-container-sm)` |  |
| `--psh-dropdown-max-height` | `var(--psh-size-52)` |  |
| `--psh-select-checkbox-size` | `var(--psh-size-4-5)` |  |

## Sizing, radii and control heights

| Token | Value | |
|---|---|---|
| `--psh-size-0` | `0` |  |
| `--psh-size-px` | `0.0625rem` | 1px |
| `--psh-size-0-5` | `0.125rem` | 2px |
| `--psh-size-1` | `0.25rem` | 4px |
| `--psh-size-1-5` | `0.375rem` | 6px |
| `--psh-size-2` | `0.5rem` | 8px |
| `--psh-size-2-5` | `0.625rem` | 10px |
| `--psh-size-3` | `0.75rem` | 12px |
| `--psh-size-3-5` | `0.875rem` | 14px |
| `--psh-size-4` | `1rem` | 16px |
| `--psh-size-4-5` | `1.125rem` | 18px |
| `--psh-size-5` | `1.25rem` | 20px |
| `--psh-size-5-5` | `1.375rem` | 22px |
| `--psh-size-6` | `1.5rem` | 24px |
| `--psh-size-6-5` | `1.625rem` | 26px |
| `--psh-size-7` | `1.75rem` | 28px |
| `--psh-size-8` | `2rem` | 32px |
| `--psh-size-8-5` | `2.125rem` | 34px |
| `--psh-size-9` | `2.25rem` | 36px |
| `--psh-size-10` | `2.5rem` | 40px |
| `--psh-size-11` | `2.75rem` | 44px |
| `--psh-size-12` | `3rem` | 48px |
| `--psh-size-14` | `3.5rem` | 56px |
| `--psh-size-16` | `4rem` | 64px |
| `--psh-size-18` | `4.5rem` | 72px |
| `--psh-size-20` | `5rem` | 80px |
| `--psh-size-24` | `6rem` | 96px |
| `--psh-size-28` | `7rem` | 112px |
| `--psh-size-32` | `8rem` | 128px |
| `--psh-size-36` | `9rem` | 144px |
| `--psh-size-40` | `10rem` | 160px |
| `--psh-size-44` | `11rem` | 176px |
| `--psh-size-48` | `12rem` | 192px |
| `--psh-size-52` | `13rem` | 208px |
| `--psh-size-56` | `14rem` | 224px |
| `--psh-size-60` | `15rem` | 240px |
| `--psh-size-64` | `16rem` | 256px |
| `--psh-size-72` | `18rem` | 288px |
| `--psh-size-80` | `20rem` | 320px |
| `--psh-size-96` | `24rem` | 384px |
| `--psh-icon-size-xs` | `0.75rem` | 12px |
| `--psh-icon-size-sm` | `1rem` | 16px |
| `--psh-icon-size-md` | `1.25rem` | 20px |
| `--psh-icon-size-lg` | `1.5rem` | 24px |
| `--psh-icon-size-xl` | `2rem` | 32px |
| `--psh-icon-size-2xl` | `3rem` | 48px |
| `--psh-border-width-0` | `0` |  |
| `--psh-border-width-1` | `1px` |  |
| `--psh-border-width-2` | `2px` |  |
| `--psh-border-width-4` | `4px` |  |
| `--psh-border-width-8` | `8px` |  |
| `--psh-radius-none` | `0` |  |
| `--psh-radius-sm` | `0.125rem` | 2px |
| `--psh-radius-base` | `0.25rem` | 4px |
| `--psh-radius-md` | `0.375rem` | 6px |
| `--psh-radius-lg` | `0.5rem` | 8px |
| `--psh-radius-xl` | `0.75rem` | 12px |
| `--psh-radius-2xl` | `1rem` | 16px |
| `--psh-radius-3xl` | `1.5rem` | 24px |
| `--psh-radius-full` | `9999px` |  |
| `--psh-container-xs` | `20rem` | 320px |
| `--psh-container-sm` | `24rem` | 384px |
| `--psh-container-md` | `28rem` | 448px |
| `--psh-container-lg` | `32rem` | 512px |
| `--psh-container-xl` | `36rem` | 576px |
| `--psh-container-2xl` | `42rem` | 672px |
| `--psh-container-3xl` | `48rem` | 768px |
| `--psh-container-4xl` | `56rem` | 896px |
| `--psh-container-5xl` | `64rem` | 1024px |
| `--psh-container-6xl` | `72rem` | 1152px |
| `--psh-container-7xl` | `80rem` | 1280px |
| `--psh-control-height-sm` | `2rem` | 32px |
| `--psh-control-height-md` | `2.5rem` | 40px |
| `--psh-control-height-lg` | `3rem` | 48px |
| `--psh-touch-target-min` | `2.75rem` | 44px |
| `--psh-scrollbar-width` | `0` |  |

## Spacing

| Token | Value | |
|---|---|---|
| `--psh-spacing-xxs` | `0.125rem` | 2px |
| `--psh-spacing-xs` | `0.25rem` | 4px |
| `--psh-spacing-sm` | `0.5rem` | 8px |
| `--psh-spacing-md` | `1rem` | 16px |
| `--psh-spacing-lg` | `1.5rem` | 24px |
| `--psh-spacing-xl` | `2rem` | 32px |
| `--psh-spacing-2xl` | `3rem` | 48px |
| `--psh-spacing-3xl` | `4rem` | 64px |
| `--psh-spacing-4xl` | `5rem` | 80px |
| `--psh-form-field-gap` | `var(--psh-spacing-xs)` | label <-> control <-> message |
| `--psh-form-label-gap` | `var(--psh-spacing-sm)` | control <-> inline label (checkbox/radio/switch) |
| `--psh-negative-spacing-xxs` | `-0.125rem` |  |
| `--psh-negative-spacing-xs` | `-0.25rem` |  |
| `--psh-negative-spacing-sm` | `-0.5rem` |  |
| `--psh-negative-spacing-md` | `-1rem` |  |
| `--psh-negative-spacing-lg` | `-1.5rem` |  |
| `--psh-negative-spacing-xl` | `-2rem` |  |
| `--psh-negative-spacing-2xl` | `-3rem` |  |

## Typography

| Token | Value | |
|---|---|---|
| `--psh-font-family` | `'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif` |  |
| `--psh-font-size-xs` | `clamp(0.6875rem, 0.5vw + 0.625rem, 0.75rem)` | 11-12px |
| `--psh-font-size-sm` | `clamp(0.8125rem, 0.5vw + 0.75rem, 0.875rem)` | 13-14px |
| `--psh-font-size-base` | `clamp(0.9375rem, 0.5vw + 0.875rem, 1rem)` | 15-16px |
| `--psh-font-size-lg` | `clamp(1.0625rem, 0.75vw + 0.9375rem, 1.125rem)` | 17-18px |
| `--psh-font-size-xl` | `clamp(1.125rem, 1vw + 1rem, 1.25rem)` | 18-20px |
| `--psh-font-size-2xl` | `clamp(1.25rem, 1.5vw + 1rem, 1.5rem)` | 20-24px |
| `--psh-font-size-3xl` | `clamp(1.5rem, 2vw + 1.125rem, 1.875rem)` | 24-30px |
| `--psh-font-size-4xl` | `clamp(1.75rem, 2.5vw + 1.25rem, 2.25rem)` | 28-36px |
| `--psh-font-weight-normal` | `400` |  |
| `--psh-font-weight-medium` | `500` |  |
| `--psh-font-weight-semibold` | `600` |  |
| `--psh-font-weight-bold` | `700` |  |
| `--psh-line-height-tight` | `1.25` |  |
| `--psh-line-height-normal` | `1.5` |  |
| `--psh-line-height-relaxed` | `1.75` |  |
| `--psh-letter-spacing-tight` | `-0.025em` |  |
| `--psh-letter-spacing-normal` | `0` |  |
| `--psh-letter-spacing-wide` | `0.025em` |  |
| `--psh-letter-spacing-wider` | `0.05em` |  |
| `--psh-letter-spacing-widest` | `0.1em` |  |

## Component CSS API

96 properties across 19 components. Set any of them on the
component element to restyle it without reaching inside:

```css
psh-button { --psh-btn-min-width-md: 10rem; }
```

They are read with their default as the `var()` fallback rather than declared on
`:host`. A declaration would outrank a plain `psh-button { … }` rule from a global
stylesheet and quietly beat the override; a fallback has no specificity to fight.

### `psh-alert`

| Property | Default |
|---|---|
| `--psh-alert-actions-gap` | `var(--psh-spacing-sm` |
| `--psh-alert-animation-distance` | `var(--psh-animation-distance-sm` |
| `--psh-alert-animation-duration` | `var(--psh-animation-duration-fast` |
| `--psh-alert-dismiss-hover-bg` | `rgba(0, 0, 0, 0.1` |
| `--psh-alert-icon-size` | `var(--psh-icon-size-md` |
| `--psh-alert-icon-size-lg` | `var(--psh-icon-size-lg` |
| `--psh-alert-icon-size-sm` | `var(--psh-icon-size-sm` |

### `psh-avatar`

| Property | Default |
|---|---|
| `--psh-avatar-icon-size-lg` | `var(--psh-icon-size-lg` |
| `--psh-avatar-icon-size-sm` | `var(--psh-icon-size-sm` |
| `--psh-avatar-icon-size-xl` | `var(--psh-icon-size-xl` |
| `--psh-avatar-size-lg` | `var(--psh-size-12` |
| `--psh-avatar-size-md` | `var(--psh-size-10` |
| `--psh-avatar-size-sm` | `var(--psh-size-8` |
| `--psh-avatar-size-xl` | `var(--psh-size-16` |
| `--psh-avatar-status-border` | `var(--psh-border-width-2` |
| `--psh-avatar-status-offset-md` | `calc(-1 * var(--psh-border-width-2` |
| `--psh-avatar-status-offset-sm` | `calc(-1 * var(--psh-size-px` |
| `--psh-avatar-status-offset-xl` | `calc(-1 * var(--psh-size-1` |
| `--psh-avatar-status-size-lg` | `var(--psh-size-3-5` |
| `--psh-avatar-status-size-md` | `var(--psh-size-3` |
| `--psh-avatar-status-size-sm` | `var(--psh-size-2-5` |
| `--psh-avatar-status-size-xl` | `var(--psh-size-4` |
| `--psh-focus-ring-offset` | `2px` |

### `psh-badge`

| Property | Default |
|---|---|
| `--psh-badge-dot-shadow` | `0 0 0 var(--psh-border-width-2` |
| `--psh-badge-height` | `var(--psh-size-5` |
| `--psh-badge-height-lg` | `var(--psh-size-6` |
| `--psh-badge-height-sm` | `var(--psh-size-4` |
| `--psh-badge-width` | `var(--psh-size-5` |
| `--psh-badge-width-lg` | `var(--psh-size-6` |
| `--psh-badge-width-sm` | `var(--psh-size-4` |

### `psh-button`

| Property | Default |
|---|---|
| `--psh-btn-font-weight` | `500` |
| `--psh-btn-min-width-icon-only` | `2.5rem` |
| `--psh-btn-min-width-lg` | `8.75rem` |
| `--psh-btn-min-width-md` | `7.5rem` |
| `--psh-btn-min-width-sm` | `6rem` |
| `--psh-btn-transition` | `all var(--psh-animation-duration-normal) var(--psh-animation-easing-default` |

### `psh-card`

| Property | Default |
|---|---|
| `--psh-card-actions-padding` | `var(--psh-card-density-actions-padding` |
| `--psh-card-body-gap` | `var(--psh-card-density-body-gap` |
| `--psh-card-body-padding` | `var(--psh-card-density-body-padding` |
| `--psh-card-footer-padding` | `var(--psh-card-density-footer-padding` |
| `--psh-card-header-gap` | `var(--psh-card-density-header-gap` |
| `--psh-card-header-padding` | `var(--psh-card-density-header-padding` |

### `psh-collapse`

| Property | Default |
|---|---|
| `--psh-collapse-transition-duration` | `var(--psh-animation-duration-default` |
| `--psh-collapse-transition-timing` | `var(--psh-animation-easing-smooth` |

### `psh-dropdown`

| Property | Default |
|---|---|
| `--psh-dropdown-max-width` | `calc(100vw - var(--psh-spacing-lg) * 2` |
| `--psh-dropdown-min-width` | `12.5rem` |

### `psh-horizontal-card`

| Property | Default |
|---|---|
| `--psh-horizontal-content-padding` | `var(--psh-spacing-md` |
| `--psh-horizontal-gap` | `var(--psh-spacing-md` |
| `--psh-horizontal-mobile-height` | `var(--psh-size-48` |
| `--psh-horizontal-side-width` | `var(--psh-size-48` |

### `psh-input`

| Property | Default |
|---|---|
| `--psh-input-max-width` | `18.75rem` |

### `psh-modal`

| Property | Default |
|---|---|
| `--psh-modal-animation-distance` | `20px` |
| `--psh-modal-animation-scale` | `0.95` |
| `--psh-modal-backdrop-blur` | `4px` |
| `--psh-modal-backdrop-opacity` | `0.6` |
| `--psh-modal-max-width-lg` | `50rem` |
| `--psh-modal-max-width-md` | `37.5rem` |
| `--psh-modal-max-width-sm` | `25rem` |

### `psh-progressbar`

| Property | Default |
|---|---|
| `--psh-progressbar-height-lg` | `var(--psh-size-3` |
| `--psh-progressbar-height-md` | `var(--psh-size-2` |
| `--psh-progressbar-height-sm` | `var(--psh-size-1` |
| `--psh-progressbar-stripe-opacity` | `0.15` |

### `psh-radio-group`

| Property | Default |
|---|---|
| `--psh-radio-group-disabled-opacity` | `0.6` |
| `--psh-radio-group-gap` | `var(--psh-spacing-sm` |
| `--psh-radio-group-gap-horizontal` | `var(--psh-spacing-lg` |
| `--psh-radio-group-label-gap` | `var(--psh-spacing-xs` |
| `--psh-radio-group-message-gap` | `var(--psh-spacing-xs` |

### `psh-select`

| Property | Default |
|---|---|
| `--psh-select-panel-max-height` | `15rem` |

### `psh-sidebar`

| Property | Default |
|---|---|
| `--psh-sidebar-width` | `250px` |

### `psh-spinloader`

| Property | Default |
|---|---|
| `--psh-spinner-dot-size-lg` | `var(--psh-size-3` |
| `--psh-spinner-dot-size-md` | `var(--psh-size-2` |
| `--psh-spinner-dot-size-sm` | `var(--psh-size-1-5` |
| `--psh-spinner-pulse-height-lg` | `var(--psh-size-12` |
| `--psh-spinner-pulse-height-md` | `var(--psh-size-8` |
| `--psh-spinner-pulse-height-sm` | `var(--psh-size-6` |
| `--psh-spinner-pulse-width-lg` | `var(--psh-size-3` |
| `--psh-spinner-pulse-width-md` | `var(--psh-size-2` |
| `--psh-spinner-pulse-width-sm` | `var(--psh-size-1-5` |
| `--psh-spinner-size-lg` | `var(--psh-size-12` |
| `--psh-spinner-size-md` | `var(--psh-size-8` |
| `--psh-spinner-size-sm` | `var(--psh-size-6` |

### `psh-state-flow-indicator`

| Property | Default |
|---|---|
| `--psh-flow-panel-gap` | `var(--psh-spacing-lg` |

### `psh-tag`

| Property | Default |
|---|---|
| `--psh-tag-close-hover-bg` | `rgba(0, 0, 0, 0.1` |
| `--psh-tag-close-opacity` | `0.7` |
| `--psh-tag-close-opacity-hover` | `1` |
| `--psh-tag-close-padding` | `var(--psh-spacing-xxs` |
| `--psh-tag-font-size` | `var(--psh-font-size-sm` |
| `--psh-tag-icon-size` | `var(--psh-icon-size-sm` |
| `--psh-tag-padding-x` | `var(--psh-spacing-sm` |
| `--psh-tag-padding-y` | `var(--psh-spacing-xs` |
| `--psh-tag-transition` | `all var(--psh-animation-duration-normal) var(--psh-animation-easing-default` |

### `psh-textarea`

| Property | Default |
|---|---|
| `--psh-textarea-max-width` | `32rem` |

### `psh-toast`

| Property | Default |
|---|---|
| `--psh-toast-icon-size` | `1.5rem` |
| `--psh-toast-max-width` | `31.25rem` |
| `--psh-toast-min-width` | `18.75rem` |
| `--psh-toast-progress-height` | `3px` |
