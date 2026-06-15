Toast notification with a colored accent bar + icon, plus a fixed `ToastStack` container.

```jsx
<ToastStack>
  <Toast tone="success" title="Cédule envoyée" message="Le client a reçu l'échéancier par courriel." onClose={dismiss} />
  <Toast tone="warning" title="Étape décalée" message="3 étapes recalculées en cascade." action={<Button size="sm" variant="ghost">Annuler</Button>} />
</ToastStack>
```

Tones: `neutral` · `success` · `warning` · `danger` · `info`. Each picks a default icon (override with `icon`). Provide `onClose` to render the dismiss button.
