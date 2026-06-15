Toggleable filter chip with an optional color dot + count. Used for phase filters on the projects list and the interactive map legend.

```jsx
<FilterChip label="Chantier" dotColor="var(--phase-chantier-bar)" count={3} active={f==='CHANTIER'} onClick={()=>setF('CHANTIER')} />
<FilterChip label="Tous" count={7} active={f==null} onClick={()=>setF(null)} />
```

Active chips go solid near-black with white text. Pair `dotColor` with a phase bar color for legends.
