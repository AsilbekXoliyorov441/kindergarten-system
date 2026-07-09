function ChartTooltip({ active, payload, label, formatter = (v) => v }) {
  if (!active || !payload?.length) return null

  return (
    <div className="glass-panel min-w-[9rem] rounded-xl px-3.5 py-2.5 text-sm shadow-lg">
      {label != null && <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>}
      <div className="flex flex-col gap-1.5">
        {payload.map((entry) => (
          <div key={entry.dataKey ?? entry.name} className="flex items-center gap-2">
            <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-semibold tabular-nums text-foreground">{formatter(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ChartTooltip }
