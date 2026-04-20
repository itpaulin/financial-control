"use client"

import { useEffect, useState } from "react"
import { useFinancialStore } from "@/lib/store"
import { monthKey } from "@/lib/format"
import { SummaryCard } from "./summary-card"
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
      <div className="flex-1 p-6 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-white/[0.03] animate-pulse shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" />
          ))}
        </div>
      </div>
    )
  }

  const income = currentMonth.categories.filter((c) => c.kind === "income")
  const expenses = currentMonth.categories.filter((c) => c.kind === "expense")

  const totalIncomeBudget = income.reduce((a, c) => a + c.items.reduce((s, i) => s + i.budget, 0), 0)
  const totalIncomeSpent = income.reduce((a, c) => a + c.items.reduce((s, i) => s + i.spent, 0), 0)
  const totalExpenseBudget = expenses.reduce((a, c) => a + c.items.reduce((s, i) => s + i.budget, 0), 0)
  const totalExpenseSpent = expenses.reduce((a, c) => a + c.items.reduce((s, i) => s + i.spent, 0), 0)

  const balanceBudget = totalIncomeBudget - totalExpenseBudget
  const balanceSpent = totalIncomeSpent - totalExpenseSpent

  const deviationBudget = balanceBudget
  const deviationActual = balanceSpent - balanceBudget

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          title="Renda"
          variant="income"
          budgeted={totalIncomeBudget}
          actual={totalIncomeSpent}
        />
        <SummaryCard
          title="Despesas"
          variant="expenses"
          budgeted={totalExpenseBudget}
          actual={totalExpenseSpent}
        />
        <SummaryCard
          title="Saldo"
          variant="balance"
          budgeted={balanceBudget}
          actual={balanceSpent}
        />
        <SummaryCard
          title="Desvio do Orçamento"
          variant="deviation"
          budgeted={deviationBudget}
          actual={deviationActual}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <SpendingBarChart categories={currentMonth.categories} />
        <SpendingDonutChart categories={currentMonth.categories} />
      </div>
    </div>
  )
}
