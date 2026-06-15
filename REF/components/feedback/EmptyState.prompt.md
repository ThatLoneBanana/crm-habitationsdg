Empty-state block — icon in a bordered square, title, supporting line, optional action.

```jsx
<EmptyState icon="building-community" title="Aucun projet actif"
  message="Crée ton premier projet pour générer une cédule de construction."
  action={<Button icon={<i className="ti ti-plus" />}>Nouveau projet</Button>} />

<EmptyState compact icon="receipt-off" title="Aucune dépense enregistrée" />
```

Use `compact` inside cards/tabs. Keep the message to one short sentence.
