Native select styled to match the field system. Used for the trade (corps de métier) picker in the cédule editor.

```jsx
<Select label="Assigné" options={["Interne", "Plomberie Côté", "Gypse Beauce", "Élec. Vachon"]} />
<Select size="sm" defaultValue="Interne"><option>Interne</option></Select>
```

Pass `options` (strings or `{value,label}`) or `<option>` children. `size="sm"` (28px) matches inline table rows.
