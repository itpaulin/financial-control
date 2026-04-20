import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatBRL } from "@/lib/format"

type Variant = "income" | "expenses" | "balance" | "deviation"

type Props = {
  title: string
  variant: Variant
  budgeted: number
  actual: number
}

const variantConfig: Record<Variant, { accentClass: string; accentStyle?: string }> = {
  income: { accentClass: "text-income", accentStyle: undefined },
  expenses: { accentClass: "text-warning", accentStyle: undefined },
  balance: { accentClass: "", accentStyle: undefined },
  deviation: { accentClass: "", accentStyle: undefined },
}

export function SummaryCard({ title, variant, budgeted, actual }: Props) {
  const diff = budgeted - actual
  const isNegative = actual < 0 || (variant === "balance" && actual < 0)
  const isOverBudget = variant === "expenses" && actual > budgeted && budgeted > 0
  const { accentClass } = variantConfig[variant]

  const actualColorClass =
    isOverBudget
      ? "text-overspend"
      : variant === "income"
        ? "text-income"
        : variant === "expenses"
          ? "text-warning"
          : isNegative
            ? "text-overspend"
            : actual > 0
              ? "text-income"
              : "text-foreground"

  const diffColorClass =
    diff > 0
      ? variant === "expenses"
        ? "text-income"
        : "text-income"
      : diff < 0
        ? "text-overspend"
        : "text-muted-foreground"

  return (
    <Card className="shadow-[0_0_0_1px_rgba(255,255,255,0.08)] bg-card border-0 gap-0">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className={cn("text-[11px] font-semibold uppercase tracking-widest", accentClass || "text-foreground/50")}>
            {title}
          </p>
          {budgeted !== 0 && (
            <span className={cn("text-xs font-mono font-medium", diffColorClass)}>
              {diff > 0 ? "+" : ""}{formatBRL(diff)}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-foreground/35 mb-0.5">Real</p>
            <p className={cn("text-2xl font-mono font-bold tabular-nums leading-none", actualColorClass)}>
              {formatBRL(actual)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-foreground/35 mb-0.5">Orçado</p>
            <p className="text-sm font-mono tabular-nums text-foreground/50">
              {formatBRL(budgeted)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
