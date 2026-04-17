"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  type ChartConfig,
} from "@/components/ui/chart"
import type { Category } from "@/lib/types"

const chartConfig = {
  budget: {
    label: "Orçamento",
    color: "var(--color-muted-foreground)",
  },
  spent: {
    label: "Gasto",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

type Props = {
  categories: Category[]
}

export function SpendingBarChart({ categories }: Props) {
  const data = categories.map((cat) => ({
    name: cat.name,
    budget: cat.items.reduce((s, i) => s + i.budget, 0),
    spent: cat.items.reduce((s, i) => s + i.spent, 0),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Orçamento vs Gasto
        </CardTitle>
        <CardDescription>Comparação por categoria</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={90}
              tick={{ fontSize: 12 }}
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) =>
                new Intl.NumberFormat("pt-BR", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(v as number)
              }
            />
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
            <Bar
              dataKey="budget"
              fill="var(--color-muted-foreground)"
              radius={[0, 4, 4, 0]}
              opacity={0.35}
            />
            <Bar
              dataKey="spent"
              fill="var(--color-primary)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
