Primary action button — DG red is the single action color, so use one `primary` per view; reach for `secondary`/`outline`/`ghost` for everything else.

```jsx
<Button variant="primary" icon={<i className="ti ti-send" />}>Envoyer la cédule</Button>
<Button variant="outline">Modifier</Button>
<Button variant="ghost" size="sm">Annuler</Button>
```

Variants: `primary` (red), `secondary` (neutral fill), `outline`, `ghost`, `danger` (destructive), `success` (confirm receipt / positive — never a generic CTA, per brand rule that green is never primary). Sizes: `sm` 24px · `md` 28px · `lg` 36px. Pass icons as nodes via `icon` / `iconTrailing` (Tabler `<i className="ti ti-*" />`).
