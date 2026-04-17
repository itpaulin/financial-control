import { TableRow, TableCell } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatBRL } from "@/lib/format"

type Props = {
  totalBudget: number
  totalSpent: number
}

export function TotalRow({ totalBudget, totalSpent }: Props) {
  const isOverspent = totalSpent > totalBudget && totalBudget > 0

  return (
    <TableRow className="border-b border-border bg-muted/60 hover:bg-muted/60">
      <TableCell className="py-1.5 pl-8 pr-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Total
      </TableCell>
      <TableCell className="py-1.5 px-2 w-36 text-right font-mono tabular-nums text-sm font-semibold">
        {formatBRL(totalBudget)}
      </TableCell>
      <TableCell
        className={cn(
          "py-1.5 px-2 w-36 text-right font-mono tabular-nums text-sm font-semibold",
          isOverspent ? "text-overspend" : "text-foreground"
        )}
      >
        {formatBRL(totalSpent)}
      </TableCell>
    </TableRow>
  )
}
