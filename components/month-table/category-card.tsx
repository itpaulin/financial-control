"use client"

import { useEffect, useRef, useState } from "react"
import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatBRL } from "@/lib/format"
import { EditableCell } from "./editable-cell"
import type { Category } from "@/lib/types"

const COLOR_OPTIONS: (string | null)[] = [
  null,
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#a855f7",
  "#ef4444",
  "#eab308",
  "#ec4899",
]

type Props = {
  category: Category
  monthKey: string
  autoFocusName?: boolean
  onUpdateName: (itemId: string, v: string) => void
  onUpdateBudget: (itemId: string, v: number) => void
  onUpdateSpent: (itemId: string, v: number) => void
  onUpdateCategoryName: (v: string) => void
  onUpdateColor: (color: string | null) => void
  onAddItem: () => void
  onDeleteItem: (itemId: string) => void
  onDeleteCategory: () => void
}

export function CategoryCard({
  category,
  monthKey,
  autoFocusName,
  onUpdateName,
  onUpdateBudget,
  onUpdateSpent,
  onUpdateCategoryName,
  onUpdateColor,
  onAddItem,
  onDeleteItem,
  onDeleteCategory,
}: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const [nameValue, setNameValue] = useState(category.name)
  const [contextItemId, setContextItemId] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setNameValue(category.name) }, [category.name])

  useEffect(() => {
    if (autoFocusName) {
      setTimeout(() => nameInputRef.current?.focus(), 40)
    }
  }, [autoFocusName])

  const totalBudget = category.items.reduce((s, i) => s + i.budget, 0)
  const totalSpent = category.items.reduce((s, i) => s + i.spent, 0)
  const isIncome = category.kind === "income"
  const isOverspentTotal = !isIncome && totalSpent > totalBudget && totalBudget > 0
  const spentColLabel = isIncome ? "Recebido" : "Gasto"
  const accentColor = category.color ?? null

  const cardStyle = accentColor
    ? { boxShadow: `0 0 0 1px ${accentColor}50, 0 4px 24px ${accentColor}12` }
    : undefined

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              A categoria <strong>&ldquo;{category.name || "sem nome"}&rdquo;</strong> e todos os
              seus itens serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ContextMenu onOpenChange={(open) => { if (!open) setContextItemId(null) }}>
      <ContextMenuTrigger asChild>
      <div
        onContextMenu={() => {
          const active = document.activeElement
          const row = active?.closest<HTMLElement>("[data-item-id]")
          setContextItemId(row?.dataset.itemId ?? null)
        }}
        className={cn(
          "group/card relative flex flex-col rounded-lg overflow-hidden bg-card",
          "transition-all duration-200 ease-out will-change-transform",
          !accentColor && "shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
          !accentColor && !isIncome && "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.20),0_4px_24px_rgba(255,255,255,0.04)]",
          !accentColor && isIncome && "hover:shadow-[0_0_0_1px_rgba(57,190,0,0.40),0_4px_24px_rgba(57,190,0,0.07)]",
          "hover:-translate-y-px"
        )}
        style={cardStyle}
      >
        {accentColor && (
          <div
            className="absolute left-0 top-0 bottom-0 w-[3px] z-10"
            style={{ backgroundColor: accentColor }}
          />
        )}

        <div
          className={cn(
            "flex items-center gap-2 pl-4 pr-3 py-2.5 border-b border-border transition-colors duration-200",
            isIncome ? "group-hover/card:bg-income/5" : "group-hover/card:bg-white/[0.02]"
          )}
        >
          <Popover open={colorOpen} onOpenChange={setColorOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "size-2.5 rounded-full shrink-0 transition-opacity ring-1 ring-white/20",
                  "opacity-40 group-hover/card:opacity-100 hover:scale-125"
                )}
                style={{ backgroundColor: accentColor ?? "rgba(255,255,255,0.25)" }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2.5" align="start" side="bottom">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Cor da categoria</p>
              <div className="grid grid-cols-4 gap-1.5">
                {COLOR_OPTIONS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => { onUpdateColor(c); setColorOpen(false) }}
                    className={cn(
                      "size-5 rounded-full ring-1 ring-white/20 transition-transform hover:scale-110",
                      c === accentColor && "ring-2 ring-white/70 scale-110"
                    )}
                    style={{ backgroundColor: c ?? "rgba(255,255,255,0.12)" }}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <input
            ref={nameInputRef}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={(e) => onUpdateCategoryName(e.target.value.trim())}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur()
            }}
            placeholder="Nome da categoria"
            className={cn(
              "flex-1 min-w-0 bg-transparent border-none outline-none",
              "text-xs font-semibold uppercase tracking-widest transition-colors duration-200",
              "placeholder:text-foreground/20",
              isIncome && !accentColor
                ? "text-income"
                : accentColor
                  ? ""
                  : "text-foreground/70 group-hover/card:text-foreground"
            )}
            style={accentColor ? { color: accentColor } : undefined}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={onAddItem}
            className="size-5 text-muted-foreground hover:text-foreground opacity-0 group-hover/card:opacity-60 hover:!opacity-100 transition-opacity shrink-0"
          >
            <HugeiconsIcon icon={Add01Icon} className="size-3" />
          </Button>
        </div>

        <div className="grid grid-cols-[1fr_5.5rem_5.5rem] pl-4 pr-3 pt-2 pb-1">
          <span className="text-xs uppercase tracking-wider text-foreground/30">Item</span>
          <span className="text-xs uppercase tracking-wider text-foreground/30 text-right">Orç.</span>
          <span className="text-xs uppercase tracking-wider text-foreground/30 text-right">
            {spentColLabel}
          </span>
        </div>

        <div
          className="flex-1 min-h-8 cursor-default"
          onClick={(e) => {
            if (e.target === e.currentTarget) onAddItem()
          }}
        >
          {category.items.map((item) => {
            const isOverspent = !isIncome && item.spent > item.budget && item.budget > 0
            const cellPrefix = `${monthKey}-${category.id}-${item.id}`

            return (
              <div
                key={item.id}
                data-item-id={item.id}
                className="grid grid-cols-[1fr_5.5rem_5.5rem] pl-4 pr-3 group/row hover:bg-white/3 items-center"
              >
                <div className="flex items-center gap-0.5 min-w-0">
                  <EditableCell
                    value={item.name}
                    type="text"
                    onSave={(v) => onUpdateName(item.id, v as string)}
                    cellId={`${cellPrefix}-name`}
                    placeholder="Item"
                    compact
                    className="text-sm text-foreground/80 font-sans"
                  />
                </div>

                <EditableCell
                  value={item.budget}
                  type="number"
                  onSave={(v) => onUpdateBudget(item.id, v as number)}
                  cellId={`${cellPrefix}-budget`}
                  placeholder="—"
                  align="right"
                  compact
                  className="text-sm text-foreground/55"
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
                    "text-sm",
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

        <div className="grid grid-cols-[1fr_5.5rem_5.5rem] pl-4 pr-3 py-2.5 mt-auto border-t border-border items-center bg-white/[0.01] group-hover/card:bg-white/[0.02] transition-colors duration-200">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
            Total
          </span>
          <span className="text-sm font-mono tabular-nums text-right text-foreground/55">
            {formatBRL(totalBudget)}
          </span>
          <span
            className={cn(
              "text-sm font-mono tabular-nums text-right font-semibold",
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
      </ContextMenuTrigger>

      <ContextMenuContent>
        {contextItemId && (
          <>
            <ContextMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => { onDeleteItem(contextItemId); setContextItemId(null) }}
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5 mr-2" />
              Apagar item
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          Apagar categoria
        </ContextMenuItem>
      </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
