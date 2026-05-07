import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RadarSection({ data, colors, paramShort, CustomTooltip }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} margin={{ top: 12, right: 44, bottom: 12, left: 44 }}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" gridType="polygon" />
        <PolarAngleAxis dataKey="param" tick={{ fill: "rgba(255,255,255,0.45)", fontFamily: "'DM Mono',monospace", fontSize: 9.5 }} />
        <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Radar dataKey="value" stroke={colors[0]} strokeWidth={1.5} fill={colors[0]} fillOpacity={0.25} dot={{ r: 3, fill: colors[0], strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
