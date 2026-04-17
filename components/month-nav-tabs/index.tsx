"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type Props = {
  year: number
  month: number
}

export function MonthNavTabs({ year, month }: Props) {
  const pathname = usePathname()
  const base = `/${year}/${month}`
  const isResumo = pathname === `${base}/resumo`

  const tabs = [
    { label: "Planilha", href: base },
    { label: "Resumo", href: `${base}/resumo` },
  ]

  return (
    <div className="flex border-b border-border bg-card px-6 gap-1">
      {tabs.map((tab) => {
        const active = tab.href === base ? !isResumo : isResumo
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              active
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
