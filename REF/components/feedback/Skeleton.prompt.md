Shimmering skeleton placeholders for loading states. `Skeleton` is a single block; `SkeletonRow` lays out several as a table/list row.

```jsx
<Skeleton width={120} height={22} />
{Array.from({length:6}).map((_,i)=> <SkeletonRow key={i} cols={[40,"50%",90,70]} />)}
```

Use while project lists, schedules or costing tables load. Match the column widths of the real row so the layout doesn't jump.
