"use client"

import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatBRL } from "@/lib/format"
import { EditableCell } from "./editable-cell"
import type { Category } from "@/lib/types"

type Props = {
  category: Category
  monthKey: string
  onUpdateName: (itemId: string, v: string) => void
  onUpdateBudget: (itemId: string, v: number) => void
  onUpdateSpent: (itemId: string, v: number) => void
  onAddItem: () => void
  onDeleteItem: (itemId: string) => void
}

export function CategoryCard({
  category,
  monthKey,
  onUpdateName,
  onUpdateBudget,
  onUpdateSpent,
  onAddItem,
  onDeleteItem,
}: Props) {
  const totalBudget = category.items.reduce((s, i) => s + i.budget, 0)
  const totalSpent = category.items.reduce((s, i) => s + i.spent, 0)
  const isIncome = category.kind === "income"
  const isOverspentTotal = totalSpent > totalBudget && totalBudget > 0
  const spentColLabel = isIncome ? "Recebido" : "Gasto"

  return (
    <div
      className={cn(
        "group/card flex flex-col rounded-lg overflow-hidden bg-card",
        "transition-all duration-200 ease-out will-change-transform",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
        "hover:-translate-y-px",
        isIncome
          ? "hover:shadow-[0_0_0_1px_rgba(57,190,0,0.45),0_4px_24px_rgba(57,190,0,0.08)]"
          : "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.20),0_4px_24px_rgba(255,255,255,0.04)]"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 border-b border-border",
          "transition-colors duration-200",
          isIncome
            ? "group-hover/card:bg-income/5"
            : "group-hover/card:bg-white/[0.02]"
        )}
      >
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-widest transition-colors duration-200",
            isIncome
              ? "text-income group-hover/card:text-income"
              : "text-foreground/70 group-hover/card:text-foreground"
          )}
        >
          {category.name}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddItem}
          className="size-5 text-muted-foreground hover:text-foreground opacity-50 group-hover/card:opacity-100 transition-opacity"
        >
          <HugeiconsIcon icon={Add01Icon} className="size-3" />
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_5rem_5rem] px-3 pt-2 pb-1">
        <span className="text-[10px] uppercase tracking-wider text-foreground/30">Item</span>
        <span className="text-[10px] uppercase tracking-wider text-foreground/30 text-right">Orç.</span>
        <span className="text-[10px] uppercase tracking-wider text-foreground/30 text-right">
          {spentColLabel}
        </span>
      </div>

      <div className="flex-1">
        {category.items.map((item) => {
          const isOverspent = !isIncome && item.spent > item.budget && item.budget > 0
          const cellPrefix = `${monthKey}-${category.id}-${item.id}`

          return (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_5rem_5rem] px-3 group/row hover:bg-white/[0.03] items-center"
            >
              <div className="flex items-center gap-0.5 min-w-0">
                <EditableCell
                  value={item.name}
                  type="text"
                  onSave={(v) => onUpdateName(item.id, v as string)}
                  cellId={`${cellPrefix}-name`}
                  placeholder="Item"
                  compact
                  className="text-foreground/80 font-sans"
                />
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="opacity-0 group-hover/row:opacity-40 hover:!opacity-100 text-destructive shrink-0 p-0.5 rounded transition-opacity"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-2.5" />
                </button>
              </div>

              <EditableCell
                value={item.budget}
                type="number"
                onSave={(v) => onUpdateBudget(item.id, v as number)}
                cellId={`${cellPrefix}-budget`}
                placeholder="—"
                align="right"
                compact
                className="text-foreground/60"
              />

              <EditableCell
                value={item.spent}
                type="number"
                onSave={(v) => onUpdateSpent(item.id, v as number)}
                cellId={`${cellPrefix}-spent`}
                placeholder="—"
                align="right"
                compact
                className={cn(
                  isOverspent
                    ? "text-overspend"
                    : isIncome
                      ? "text-income"
                      : "text-foreground/90"
                )}
              />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-[1fr_5rem_5rem] px-3 py-2.5 mt-auto border-t border-border items-center bg-white/[0.01] group-hover/card:bg-white/[0.025] transition-colors duration-200">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
          Total
        </span>
        <span className="text-xs font-mono tabular-nums text-right text-foreground/60">
          {formatBRL(totalBudget)}
        </span>
        <span
          className={cn(
            "text-xs font-mono tabular-nums text-right font-semibold",
            isOverspentTotal
              ? "text-overspend"
              : isIncome
                ? "text-income"
                : "text-foreground"
          )}
        >
          {formatBRL(totalSpent)}
        </span>
      </div>
    </div>
  )
}
