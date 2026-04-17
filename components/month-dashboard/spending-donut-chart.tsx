"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Category } from "@/lib/types"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

type Props = {
  categories: Category[]
}

export function SpendingDonutChart({ categories }: Props) {
  const expenseCategories = categories.filter((c) => c.kind === "expense")

  const data = expenseCategories.map((cat, i) => ({
    name: cat.name,
    value: cat.items.reduce((s, i) => s + i.spent, 0),
    color: COLORS[i % COLORS.length],
  })).filter((d) => d.value > 0)

  const chartConfig = Object.fromEntries(
    expenseCategories.map((cat, i) => [
      cat.name,
      { label: cat.name, color: COLORS[i % COLORS.length] },
    ])
  ) satisfies ChartConfig

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Distribuição de Gastos
        </CardTitle>
        <CardDescription>Apenas despesas realizadas</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {total === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            Nenhum gasto registrado
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={2}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      new Intl.NumberFormat("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(value as number)
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
