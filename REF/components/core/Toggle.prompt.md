On/off switch, green when on. Used for the "visible client" toggle on cédule steps.

```jsx
<Toggle checked={visible} onChange={setVisible} label="Visible client" />
```

`onChange` receives `(checked, event)`. Green-on follows the brand rule (green = positive state, not an action).
