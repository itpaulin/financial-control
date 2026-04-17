"use client"

import { useEffect, useState } from "react"
import { useFinancialStore } from "@/lib/store"
import { monthKey } from "@/lib/format"
import { CategoryCard } from "./category-card"
import { SpendingBarChart } from "./spending-bar-chart"
import { SpendingDonutChart } from "./spending-donut-chart"

type Props = {
  year: number
  month: number
}

export function MonthDashboard({ year, month }: Props) {
  const [mounted, setMounted] = useState(false)
  const mk = monthKey(year, month)

  const ensureMonth = useFinancialStore((s) => s.ensureMonth)
  const currentMonth = useFinancialStore((s) => s.months[mk])

  useEffect(() => {
    const result = useFinancialStore.persist.rehydrate()
    if (result instanceof Promise) {
      result.then(() => setMounted(true))
    } else {
      setMounted(true) // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [])

  useEffect(() => {
    if (mounted) ensureMonth(year, month)
  }, [mounted, year, month, ensureMonth])

  if (!mounted || !currentMonth) {
    return (
      <div className="flex-1 p-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  const income = currentMonth.categories.filter((c) => c.kind === "income")
  const expenses = currentMonth.categories.filter((c) => c.kind === "expense")

  const totalIncomeBudget = income.reduce(
    (acc, c) => acc + c.items.reduce((s, i) => s + i.budget, 0), 0
  )
  const totalIncomeSpent = income.reduce(
    (acc, c) => acc + c.items.reduce((s, i) => s + i.spent, 0), 0
  )
  const totalExpenseBudget = expenses.reduce(
    (acc, c) => acc + c.items.reduce((s, i) => s + i.budget, 0), 0
  )
  const totalExpenseSpent = expenses.reduce(
    (acc, c) => acc + c.items.reduce((s, i) => s + i.spent, 0), 0
  )

  const balanceBudget = totalIncomeBudget - totalExpenseBudget
  const balanceSpent = totalIncomeSpent - totalExpenseSpent

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentMonth.categories.map((category) => {
          const budget = category.items.reduce((s, i) => s + i.budget, 0)
          const spent = category.items.reduce((s, i) => s + i.spent, 0)
          return (
            <CategoryCard
              key={category.id}
              name={category.name}
              kind={category.kind}
              budget={budget}
              spent={spent}
            />
          )
        })}

        <CategoryCard
          name="Saldo"
          kind="balance"
          budget={balanceBudget}
          spent={balanceSpent}
          isBalance
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SpendingBarChart categories={currentMonth.categories} />
        <SpendingDonutChart categories={currentMonth.categories} />
      </div>
    </div>
  )
}
