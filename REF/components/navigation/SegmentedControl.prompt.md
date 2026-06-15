Segmented control for 2–4 short options. Used for the Cédule Consultation/Édition toggle, the cartes/liste view switch, and Costing global/projet.

```jsx
<SegmentedControl value={mode} onChange={setMode}
  options={[{value:"consult",label:"Consultation",icon:"eye"},{value:"edit",label:"Édition",icon:"pencil"}]} />
```

Options are strings or `{value,label,icon}`. The active segment lifts onto a white surface with a soft shadow.
