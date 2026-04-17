"use client"

import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EditableCell } from "./editable-cell"
import type { Item } from "@/lib/types"

type Props = {
  item: Item
  categoryId: string
  monthKey: string
  onUpdateName: (v: string) => void
  onUpdateBudget: (v: number) => void
  onUpdateSpent: (v: number) => void
  onDelete: () => void
}

export function ItemRow({
  item,
  categoryId,
  monthKey,
  onUpdateName,
  onUpdateBudget,
  onUpdateSpent,
  onDelete,
}: Props) {
  const isOverspent = item.spent > item.budget && item.budget > 0
  const cellPrefix = `${monthKey}-${categoryId}-${item.id}`

  return (
    <TableRow className="border-b border-border/30 group/row hover:bg-muted/40 transition-colors">
      <TableCell className="py-0.5 pl-8 pr-2">
        <div className="flex items-center gap-1">
          <EditableCell
            value={item.name}
            type="text"
            onSave={(v) => onUpdateName(v as string)}
            cellId={`${cellPrefix}-name`}
            placeholder="Item"
            className="text-foreground text-sm font-sans"
            align="left"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="size-5 opacity-0 group-hover/row:opacity-40 hover:!opacity-100 hover:text-destructive transition-opacity shrink-0"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
          </Button>
        </div>
      </TableCell>

      <TableCell className="py-0.5 px-2 w-36">
        <EditableCell
          value={item.budget}
          type="number"
          onSave={(v) => onUpdateBudget(v as number)}
          cellId={`${cellPrefix}-budget`}
          placeholder="0,00"
          align="right"
        />
      </TableCell>

      <TableCell className="py-0.5 px-2 w-36">
        <EditableCell
          value={item.spent}
          type="number"
          onSave={(v) => onUpdateSpent(v as number)}
          cellId={`${cellPrefix}-spent`}
          placeholder="0,00"
          align="right"
          className={cn(isOverspent && "text-overspend")}
        />
      </TableCell>
    </TableRow>
  )
}
