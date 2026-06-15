Underlined tab bar — the project page nav (Cédule · Extras · Paiements · GCR · Costing · Documents). Active tab gets a red underline.

```jsx
<Tabs
  value={tab}
  onChange={setTab}
  tabs={["Cédule", { id: "Extras", label: "Extras", count: 4 }, "Paiements", "GCR", "Costing", "Documents"]}
/>
```

Tabs are strings or `{id,label,count}`. The optional `count` chip turns red when its tab is active.
