interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: { tip?: string } }>;
}

/** Tooltip sederhana: menampilkan teks `tip` dari data grafik (nama, nilai, persen). */
export default function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const tip = payload[0]?.payload?.tip;
  if (!tip) return null;
  return <div className="chart-tip">{tip}</div>;
}
