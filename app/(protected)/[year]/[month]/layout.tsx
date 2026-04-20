import { MonthSwitcher } from "@/components/month-switcher"
import { MonthNavTabs } from "@/components/month-nav-tabs"

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ year: string; month: string }>
}

export default async function MonthLayout({ children, params }: LayoutProps) {
  const { year, month } = await params
  const y = parseInt(year, 10)
  const m = parseInt(month, 10)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <MonthSwitcher year={y} month={m} />
      <MonthNavTabs year={y} month={m} />
      {children}
    </div>
  )
}
