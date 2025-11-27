"use client"

import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

interface OverviewChartProps {
  data: {
    name: string
    total: number
  }[]
}

export function OverviewChart({data}: OverviewChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}€`}
        />
        <Tooltip
          cursor={{fill: 'transparent'}}
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Bar
          dataKey="total"
          fill="#d97706" // Couleur Amber-600 (Thème pâtisserie)
          radius={[4, 4, 0, 0]} // Arrondi en haut des barres
        />
      </BarChart>
    </ResponsiveContainer>
  )
}