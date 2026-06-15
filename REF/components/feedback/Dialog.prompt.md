Modal dialog with a scrim, tinted icon, body and footer. Use for confirmations (deletion, cascade recalculation).

```jsx
<Dialog open={open} onClose={close} tone="danger" icon="trash"
  title="Supprimer ce projet ?"
  footer={<>
    <Button variant="ghost" onClick={close}>Annuler</Button>
    <Button variant="danger" onClick={confirm}>Supprimer définitivement</Button>
  </>}>
  Cette action est irréversible. La cédule, les extras et les paiements liés seront retirés.
</Dialog>
```

`tone="danger"` tints the icon square + title for destructive actions. Footer buttons are right-aligned on the subtle surface.
