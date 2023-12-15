import React from 'react'
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type DatesChartProps = {
  data: Array<any>
  lines: string[]
}

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360)
  const saturation = Math.floor(Math.random() * 100)
  const lightness = Math.floor(Math.random() * 50) + 50

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-muted">
        <div className="space-y-2">
          {Object.entries(payload[0].payload).map((item) => (
            <p key={item[0]}>
              {item[0] === 'name' ? 'Dia' : item[0]}: {String(item[1])}
            </p>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export function DatesChart({ data, lines }: DatesChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="white" />

        <YAxis />
        <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
        <Legend />
      
        {lines.map((line) => (
          <Bar key={line} dataKey={line} fill={getRandomColor()} barSize={20} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
