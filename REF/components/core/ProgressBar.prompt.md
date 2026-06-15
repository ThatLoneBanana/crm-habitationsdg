Thin progress bar, colored by project phase. Used in the project rail and project headers.

```jsx
<ProgressBar value={88} phase="LIVRAISON" />
<ProgressBar value={25} color="var(--success)" height={4} />
```

Pass `phase` to pull the matching phase bar color, or `color` for an explicit value. Keep it thin (3–4px) — it sits under list rows.
