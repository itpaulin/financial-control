import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { formatBRL } from "@/lib/format"
import type { CategoryKind } from "@/lib/types"

type Props = {
  name: string
  kind: CategoryKind | "balance"
  budget: number
  spent: number
  isBalance?: boolean
}

export function CategoryCard({ name, kind, budget, spent, isBalance }: Props) {
  const progress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const isOverspent = spent > budget && budget > 0
  const isIncome = kind === "income"
  const diff = budget - spent

  return (
    <Card className="gap-3">
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {name}
          </CardTitle>
          {!isBalance && (
            <span
              className={cn(
                "text-xs font-mono font-medium",
                isOverspent ? "text-overspend" : "text-muted-foreground"
              )}
            >
              {diff >= 0 ? "+" : ""}
              {formatBRL(diff)}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Gasto</p>
            <p
              className={cn(
                "text-2xl font-mono font-bold tabular-nums",
                isOverspent
                  ? "text-overspend"
                  : isIncome
                    ? "text-income"
                    : spent < 0
                      ? "text-overspend"
                      : "text-foreground"
              )}
            >
              {formatBRL(spent)}
            </p>
          </div>
          <div className="space-y-0.5 text-right">
            <p className="text-xs text-muted-foreground">Orçamento</p>
            <p className="text-sm font-mono tabular-nums text-muted-foreground">
              {formatBRL(budget)}
            </p>
          </div>
        </div>

        {!isBalance && budget > 0 && (
          <Progress
            value={progress}
            className={cn(
              "h-1.5",
              isOverspent && "[&>div]:bg-overspend",
              isIncome && "[&>div]:bg-income"
            )}
          />
        )}
      </CardContent>
    </Card>
  )
}
