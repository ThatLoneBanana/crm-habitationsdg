Crisp bordered container — the dominant surface. White, 1px border, 8px radius, **no shadow at rest** (borders do the structural work).

```jsx
<Card padding={false}>
  <CardHeader icon={<i className="ti ti-bell" />} title="Alertes prioritaires" action={<Badge tone="danger">3</Badge>} />
  <div>{/* rows */}</div>
</Card>
```

Use `padding={false}` when the card holds a header + a list (so rows span edge to edge). `CardHeader` sits on the subtle surface with a hairline below and takes `icon`, `title`, and a right-aligned `action`.
