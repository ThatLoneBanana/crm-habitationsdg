Task-status dot, color-keyed to the Gantt status system (computed from dates).

```jsx
<StatusDot status="encours" showLabel pulse />
<StatusDot status="termine" />
```

`status`: `termine` (green) · `encours` (teal, the only one that pulses) · `demain` (blue) · `avenir` (gray). `showLabel` adds the French label; `size` sets the diameter.
