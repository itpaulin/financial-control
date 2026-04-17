"use client"

import { useEffect, useState } from "react"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { formatBRL, monthKey } from "@/lib/format"
import { useFinancialStore } from "@/lib/store"
import { CategoryCard } from "./category-card"

type Props = {
  year: number
  month: number
}

export function MonthTable({ year, month }: Props) {
  const [mounted, setMounted] = useState(false)
  const [newCategoryId, setNewCategoryId] = useState<string | null>(null)
  const mk = monthKey(year, month)

  const ensureMonth = useFinancialStore((s) => s.ensureMonth)
  const updateItemName = useFinancialStore((s) => s.updateItemName)
  const updateItemBudget = useFinancialStore((s) => s.updateItemBudget)
  const updateItemSpent = useFinancialStore((s) => s.updateItemSpent)
  const addItem = useFinancialStore((s) => s.addItem)
  const deleteItem = useFinancialStore((s) => s.deleteItem)
  const addCategory = useFinancialStore((s) => s.addCategory)
  const deleteCategory = useFinancialStore((s) => s.deleteCategory)
  const updateCategoryName = useFinancialStore((s) => s.updateCategoryName)
  const updateCategoryColor = useFinancialStore((s) => s.updateCategoryColor)
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
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 rounded-lg bg-white/[0.03] animate-pulse shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" />
        ))}
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

  function focusNewItem(categoryId: string, itemId: string) {
    setTimeout(() => {
      const cells = document.querySelectorAll<HTMLInputElement>("[data-cell]")
      const cell = Array.from(cells).find((c) =>
        c.dataset.cell?.includes(`${categoryId}-${itemId}-name`)
      )
      cell?.focus()
    }, 50)
  }

  function handleAddCategory() {
    const id = addCategory(mk, "", "expense")
    setNewCategoryId(id)
    setTimeout(() => setNewCategoryId(null), 500)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentMonth.categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              monthKey={mk}
              autoFocusName={category.id === newCategoryId}
              onUpdateName={(itemId, v) => updateItemName(mk, category.id, itemId, v)}
              onUpdateBudget={(itemId, v) => updateItemBudget(mk, category.id, itemId, v)}
              onUpdateSpent={(itemId, v) => updateItemSpent(mk, category.id, itemId, v)}
              onUpdateCategoryName={(v) => updateCategoryName(mk, category.id, v)}
              onUpdateColor={(color) => updateCategoryColor(mk, category.id, color)}
              onDeleteItem={(itemId) => deleteItem(mk, category.id, itemId)}
              onDeleteCategory={() => deleteCategory(mk, category.id)}
              onAddItem={() => {
                const newId = addItem(mk, category.id)
                focusNewItem(category.id, newId)
              }}
            />
          ))}

          <button
            onClick={handleAddCategory}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/10",
              "text-sm text-foreground/30 hover:text-foreground/60 hover:border-white/25",
              "transition-colors duration-200 min-h-24 cursor-pointer"
            )}
          >
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
            Nova categoria
          </button>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-card px-6 py-3 flex items-center justify-between shadow-[0_-1px_0_rgba(255,255,255,0.06)]">
        <span className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
          Saldo do mês
        </span>
        <div className="flex items-center gap-10">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-0.5">Orçado</p>
            <span className="text-base font-mono tabular-nums font-semibold text-foreground">
              {formatBRL(balanceBudget)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-0.5">Real</p>
            <span
              className={cn(
                "text-base font-mono tabular-nums font-semibold",
                balanceSpent < 0 ? "text-overspend" : "text-income"
              )}
            >
              {formatBRL(balanceSpent)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
