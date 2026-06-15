Text input with label, optional leading icon, and hint / error states. 32px tall, red focus ring.

```jsx
<Input label="Adresse" placeholder="18 Rue des Érables" />
<Input icon={<i className="ti ti-search" />} placeholder="Rechercher un projet…" />
<Input label="Courriel" error="Adresse invalide" defaultValue="x@" />
```

Pass `error` to set the invalid state + red hint, or `invalid` to style without a message.
