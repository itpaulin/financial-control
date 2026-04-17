"use client"

import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatBRL } from "@/lib/format"
import type { Category } from "@/lib/types"

type Props = {
  category: Category
  onAddItem: () => void
}

function categoryTotals(category: Category) {
  return category.items.reduce(
    (acc, item) => ({
      budget: acc.budget + item.budget,
      spent: acc.spent + item.spent,
    }),
    { budget: 0, spent: 0 }
  )
}

export function CategoryHeader({ category, onAddItem }: Props) {
  const totals = categoryTotals(category)
  const isIncome = category.kind === "income"

  return (
    <TableRow
      className={cn(
        "border-b border-border/60 group/header",
        isIncome
          ? "bg-income text-income-foreground hover:bg-income"
          : "bg-primary text-primary-foreground hover:bg-primary"
      )}
    >
      <TableCell className="py-2 px-4 font-semibold tracking-wider text-xs uppercase">
        <div className="flex items-center gap-2">
          {category.name}
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddItem}
            className={cn(
              "size-5 opacity-0 group-hover/header:opacity-60 hover:!opacity-100 transition-opacity",
              isIncome
                ? "text-income-foreground hover:bg-income-foreground/20"
                : "text-primary-foreground hover:bg-primary-foreground/20"
            )}
          >
            <HugeiconsIcon icon={Add01Icon} className="size-3" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="py-2 px-4 text-right font-mono tabular-nums text-xs font-medium opacity-80">
        {formatBRL(totals.budget)}
      </TableCell>
      <TableCell className="py-2 px-4 text-right font-mono tabular-nums text-xs font-medium opacity-80">
        {formatBRL(totals.spent)}
      </TableCell>
    </TableRow>
  )
}
