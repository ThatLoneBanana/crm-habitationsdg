Horizontal step indicator for multi-step flows — the 4-step project creation (Client → Projet → Cédule → Confirmation).

```jsx
<Stepper current={step} steps={["Client","Projet","Cédule","Confirmation"]} />
```

Completed steps show a green check, the current step is DG red, future steps are muted. Connector turns green as you advance.
