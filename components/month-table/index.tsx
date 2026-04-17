"use client"

import { Fragment, useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatBRL, monthKey } from "@/lib/format"
import { useFinancialStore } from "@/lib/store"
import { MonthSwitcher } from "@/components/month-switcher"
import { CategoryHeader } from "./category-header"
import { ItemRow } from "./item-row"
import { TotalRow } from "./total-row"

type Props = {
  year: number
  month: number
}

export function MonthTable({ year, month }: Props) {
  const [mounted, setMounted] = useState(false)
  const mk = monthKey(year, month)

  const ensureMonth = useFinancialStore((s) => s.ensureMonth)
  const updateItemName = useFinancialStore((s) => s.updateItemName)
  const updateItemBudget = useFinancialStore((s) => s.updateItemBudget)
  const updateItemSpent = useFinancialStore((s) => s.updateItemSpent)
  const addItem = useFinancialStore((s) => s.addItem)
  const deleteItem = useFinancialStore((s) => s.deleteItem)
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
      <div className="flex flex-col flex-1">
        <div className="h-14 border-b border-border bg-card animate-pulse" />
        <div className="flex-1 animate-pulse bg-muted/20" />
      </div>
    )
  }

  const income = currentMonth.categories.filter((c) => c.kind === "income")
  const expenses = currentMonth.categories.filter((c) => c.kind === "expense")

  const totalIncomeBudget = income.reduce(
    (acc, c) => acc + c.items.reduce((s, i) => s + i.budget, 0),
    0
  )
  const totalIncomeSpent = income.reduce(
    (acc, c) => acc + c.items.reduce((s, i) => s + i.spent, 0),
    0
  )
  const totalExpenseBudget = expenses.reduce(
    (acc, c) => acc + c.items.reduce((s, i) => s + i.budget, 0),
    0
  )
  const totalExpenseSpent = expenses.reduce(
    (acc, c) => acc + c.items.reduce((s, i) => s + i.spent, 0),
    0
  )

  const balanceBudget = totalIncomeBudget - totalExpenseBudget
  const balanceSpent = totalIncomeSpent - totalExpenseSpent

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <MonthSwitcher year={year} month={month} />

      <div className="flex-1 overflow-auto">
        <Table className="min-w-[36rem]">
          <TableHeader>
            <TableRow className="border-b-2 border-border bg-card hover:bg-card">
              <TableHead className="py-2 pl-8 pr-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-full">
                Item
              </TableHead>
              <TableHead className="py-2 px-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-36">
                Orçamento
              </TableHead>
              <TableHead className="py-2 px-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-36">
                Gasto
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentMonth.categories.map((category) => {
              const totalBudget = category.items.reduce((s, i) => s + i.budget, 0)
              const totalSpent = category.items.reduce((s, i) => s + i.spent, 0)

              return (
                <Fragment key={category.id}>
                  <CategoryHeader
                    category={category}
                    onAddItem={() => {
                      const newId = addItem(mk, category.id)
                      setTimeout(() => {
                        const cells = document.querySelectorAll<HTMLInputElement>("[data-cell]")
                        const newCell = Array.from(cells).find((c) =>
                          c.dataset.cell?.includes(`${category.id}-${newId}-name`)
                        )
                        newCell?.focus()
                      }, 50)
                    }}
                  />
                  {category.items.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      categoryId={category.id}
                      monthKey={mk}
                      onUpdateName={(v) => updateItemName(mk, category.id, item.id, v)}
                      onUpdateBudget={(v) => updateItemBudget(mk, category.id, item.id, v)}
                      onUpdateSpent={(v) => updateItemSpent(mk, category.id, item.id, v)}
                      onDelete={() => deleteItem(mk, category.id, item.id)}
                    />
                  ))}
                  <TotalRow
                    totalBudget={totalBudget}
                    totalSpent={totalSpent}
                  />
                </Fragment>
              )
            })}
          </TableBody>
        </Table>

        <div className="border-t-2 border-border bg-card px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-4">
            Saldo do mês
          </span>
          <div className="flex items-center gap-8 pr-2">
            <div className="text-right w-36">
              <span className="text-sm font-mono tabular-nums font-bold text-foreground">
                {formatBRL(balanceBudget)}
              </span>
            </div>
            <div className="text-right w-36">
              <span
                className={cn(
                  "text-sm font-mono tabular-nums font-bold",
                  balanceSpent < 0 ? "text-overspend" : "text-income"
                )}
              >
                {formatBRL(balanceSpent)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
