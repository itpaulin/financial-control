"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { monthLabel, prevMonth, nextMonth } from "@/lib/format"
import { useFinancialStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { toast } from "sonner"

type Props = {
  year: number
  month: number
}

export function MonthSwitcher({ year, month }: Props) {
  const router = useRouter()
  const copyFromPreviousMonth = useFinancialStore((s) => s.copyFromPreviousMonth)
  const loadSeed = useFinancialStore((s) => s.loadSeed)
  const months = useFinancialStore((s) => s.months)

  const [py, pm] = prevMonth(year, month)
  const [ny, nm] = nextMonth(year, month)
  const label = monthLabel(year, month)

  const hasPreviousMonth = Boolean(months[`${py}-${String(pm).padStart(2, "0")}`])

  function handleCopy() {
    copyFromPreviousMonth(year, month)
    toast.success("Orçamento copiado do mês anterior")
  }

  function handleLoadSeed() {
    loadSeed(year, month)
    toast.success("Dados de exemplo carregados")
  }

  return (
    <div className="flex items-center justify-between px-6 py-2.5 border-b border-border bg-card shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${py}/${pm}`)}
          className="size-8"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} />
        </Button>
        <h1 className="text-base font-semibold capitalize min-w-[12rem] text-center">
          {label}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${ny}/${nm}`)}
          className="size-8"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {process.env.NODE_ENV === "development" && (
          <Button variant="ghost" size="sm" className="text-foreground/40 hover:text-foreground/70" onClick={handleLoadSeed}>
            Carregar exemplo
          </Button>
        )}
        {hasPreviousMonth && (
          <Button variant="outline" size="sm" onClick={handleCopy}>
            Copiar orçamento anterior
          </Button>
        )}
        <UserMenu />
      </div>
    </div>
  )
}
