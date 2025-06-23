'use client'

import {
  Bar, BarChart,
  Line, LineChart,
  Pie, PieChart, Cell,
  XAxis, YAxis, CartesianGrid, Label,
  TooltipProps
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from '@/components/ui/chart'
import type { ChartData } from '@/app/dashboard/chat/page'
import { ReactElement } from 'react'

interface ChatMessageChartProps {
  chartData: ChartData
}

const generateChartConfig = (yKeys: string[], chartType: string): ChartConfig => {
  const config: ChartConfig = {}
  yKeys.forEach((key, index) => {
    const colorName = `chart-${(index % 5) + 1}`
    config[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: `hsl(var(--${colorName}))`,
    }
  })
  return config
}

const PIE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function ChatMessageChart({ chartData }: ChatMessageChartProps) {
  const { chart_type, title, data, x_axis_key, y_axis_keys } = chartData

  if (!data || data.length === 0) {
    return (
      <div className="my-4 p-4 border rounded-md text-center text-muted-foreground">
        <p>{title ? `${title}: ` : ''}No hay datos disponibles para mostrar el gráfico.</p>
      </div>
    )
  }

  const chartConfig = generateChartConfig(y_axis_keys, chart_type)
  const chartHeight = Math.max(280, data.length * 30 + 120)

  let chartElement: ReactElement | null = null

  switch (chart_type) {
    case 'bar':
      chartElement = (
        <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey={x_axis_key}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => {
              if (typeof value === 'string') {
                let date = new Date(value)
                if (isNaN(date.getTime())) {
                  const parts = value.split(/[-/ ]/)
                  if (parts.length === 3) {
                    if (parts[0].length === 4) date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
                    else if (parts[2].length === 4) date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
                  }
                }
                if (!isNaN(date.getTime())) {
                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                }
              }
              return value
            }}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={10}>
            {y_axis_keys.length === 1 && (
              <Label value={y_axis_keys[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            )}
          </YAxis>
          <ChartTooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            content={<ChartTooltipContent indicator='dot' hideLabel={y_axis_keys.length <= 1 && data.length > 1} />}
          />
          {y_axis_keys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
          {y_axis_keys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={chartConfig[key]?.color || PIE_COLORS[index % PIE_COLORS.length]} radius={4} />
          ))}
        </BarChart>
      )
      break
    case 'line':
      chartElement = (
        <LineChart accessibilityLayer data={data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey={x_axis_key}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => {
              if (typeof value === 'string') {
                let date = new Date(value)
                if (isNaN(date.getTime())) {
                  const parts = value.split(/[-/ ]/)
                  if (parts.length === 3) {
                    if (parts[0].length === 4) date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
                    else if (parts[2].length === 4) date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
                  }
                }
                if (!isNaN(date.getTime())) {
                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                }
              }
              return value
            }}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={10}>
            {y_axis_keys.length === 1 && (
              <Label value={y_axis_keys[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            )}
          </YAxis>
          <ChartTooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={<ChartTooltipContent indicator='dot' hideLabel={y_axis_keys.length <= 1 && data.length > 1} />}
          />
          {y_axis_keys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
          {y_axis_keys.map((key, index) => (
            <Line key={key} type="monotone" dataKey={key} stroke={chartConfig[key]?.color || PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={2} dot={{ r: 6 }} activeDot={{ r: 8 }} />
          ))}
        </LineChart>
      )
      break
    case 'pie':
      if (y_axis_keys.length > 0) {
        chartElement = (
          <PieChart accessibilityLayer margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' nameKey={x_axis_key} formatter={(value, name, entry) => `${entry.payload[x_axis_key]}: ${value}`} />}
            />
            <Pie
              data={data}
              dataKey={y_axis_keys[0]}
              nameKey={x_axis_key}
              cx="50%"
              cy="45%"
              outerRadius={Math.min(100, chartHeight / 3.5 - 40)}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="hsl(var(--background))" style={{ outline: 'none' }} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey={x_axis_key} className="mt-[-10px]" />} />
          </PieChart>
        )
      } else {
        chartElement = (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">{`No se puede mostrar el gráfico tipo '${chart_type}' sin claves de datos (y_axis_keys).`}</p>
          </div>
        )
      }
      break
    default:
      chartElement = (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">{`Tipo de gráfico '${chart_type}' no soportado.`}</p>
        </div>
      )
  }

  return (
    <div className="my-4 p-2 border rounded-md bg-card text-card-foreground">
      {title && <h3 className="text-md font-semibold mb-3 text-center px-2">{title}</h3>}
      <ChartContainer
        config={chartConfig}
        className="w-full text-xs"
        style={{ minHeight: `${chartHeight}px` }}
      >
        {chartElement}
      </ChartContainer>
    </div>
  )
} 