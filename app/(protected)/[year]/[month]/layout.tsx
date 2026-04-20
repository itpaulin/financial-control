import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ year: string; month: string }>
}

export default async function MonthLayout({ children, params }: LayoutProps) {
  const { year, month } = await params
  const y = parseInt(year, 10)
  const m = parseInt(month, 10)

  return (
    <SidebarProvider>
      <AppSidebar year={y} month={m} />
      <SidebarInset>
        <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
