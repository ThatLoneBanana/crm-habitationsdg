Project-lifecycle phase badge. Owns the canonical 5-phase palette so phase colors never drift across screens.

```jsx
<PhaseBadge phase="CHANTIER" />
<PhaseBadge phase="LIVRAISON" solid />
```

`phase`: `SIGNE` (blue) · `PREPARATION` (violet) · `CHANTIER` (orange) · `LIVRAISON` (green) · `TERMINE` (taupe). `solid` fills with the bar color (for dark contexts); default is the soft tint + ink. Import `PHASE_COLORS` for the raw values when drawing progress bars or Gantt segments.
