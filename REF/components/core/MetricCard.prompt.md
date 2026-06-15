Dashboard KPI tile — small label + icon, big tabular figure, supporting sub-line. The figure color carries urgency.

```jsx
<MetricCard icon={<i className="ti ti-alert-triangle" />} label="Alertes" value="3" sub="1 urgente" tone="danger" />
<MetricCard icon={<i className="ti ti-currency-dollar" />} label="Valeur en chantier" value="2,1 M$" sub="valeur totale active" tone="success" />
```

`tone` colors the figure: `neutral` · `success` · `warning` · `danger` · `info`. Pre-format `value` with the Québec money/number format (`2,1 M$`, `187 500 $`). Lay five across a `repeat(5, 1fr)` grid with a 10px gap on the dashboard.
