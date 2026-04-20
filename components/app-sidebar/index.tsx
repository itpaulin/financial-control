"use client"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Logout01Icon,
  PieChart02Icon,
  Settings01Icon,
  Table01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { monthLabel, nextMonth, prevMonth } from "@/lib/format"
import { useFinancialStore } from "@/lib/store"
import { authClient } from "@/lib/auth-client"

type Props = {
  year: number
  month: number
}

export function AppSidebar({ year, month }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = authClient.useSession()

  const copyFromPreviousMonth = useFinancialStore((s) => s.copyFromPreviousMonth)
  const loadSeed = useFinancialStore((s) => s.loadSeed)
  const months = useFinancialStore((s) => s.months)

  const [py, pm] = prevMonth(year, month)
  const [ny, nm] = nextMonth(year, month)
  const label = monthLabel(year, month)

  const hasPreviousMonth = Boolean(
    months[`${py}-${String(pm).padStart(2, "0")}`]
  )

  const base = `/${year}/${month}`
  const isResumo = pathname === `${base}/resumo`

  const navItems = [
    {
      label: "Dashboard",
      href: `${base}/resumo`,
      icon: PieChart02Icon,
      active: isResumo,
    },
    {
      label: "Planilha",
      href: base,
      icon: Table01Icon,
      active: !isResumo,
    },
  ]

  function handleCopy() {
    copyFromPreviousMonth(year, month)
    toast.success("Orçamento copiado do mês anterior")
  }

  function handleLoadSeed() {
    loadSeed(year, month)
    toast.success("Dados de exemplo carregados")
  }

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
          router.refresh()
        },
      },
    })
  }

  const initials = session?.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?"

  return (
    <Sidebar>
      {/* Logo */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-bold text-base tracking-tight">
            finance<span className="text-primary">.</span>ai
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Month navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Mês</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex items-center justify-between px-2 py-1">
              <button
                onClick={() => router.push(`/${py}/${pm}`)}
                className="flex size-6 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                aria-label="Mês anterior"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
              </button>
              <span className="text-xs font-medium capitalize text-sidebar-foreground">
                {label}
              </span>
              <button
                onClick={() => router.push(`/${ny}/${nm}`)}
                className="flex size-6 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                aria-label="Próximo mês"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Page navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Visualização</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link href={item.href}>
                      <HugeiconsIcon icon={item.icon} />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick actions */}
        {(hasPreviousMonth || process.env.NODE_ENV === "development") && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Ações</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {hasPreviousMonth && (
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={handleCopy}>
                        Copiar orçamento anterior
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {process.env.NODE_ENV === "development" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={handleLoadSeed}
                        className="text-sidebar-foreground/50"
                      >
                        Carregar exemplo
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-xs/relaxed transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-semibold text-[0.65rem]">
                {initials}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">
                  {session?.user.name ?? "—"}
                </span>
                <span className="truncate text-sidebar-foreground/50">
                  {session?.user.email ?? "—"}
                </span>
              </div>
              <HugeiconsIcon
                icon={Settings01Icon}
                className="size-3.5 shrink-0 text-sidebar-foreground/40"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-52">
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <HugeiconsIcon icon={Logout01Icon} />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function LogoMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="8" fill="#39BE00" fillOpacity="0.15" />
      <path
        d="M7 14C7 10.134 10.134 7 14 7C17.866 7 21 10.134 21 14"
        stroke="#39BE00"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 14L10.5 17.5"
        stroke="#39BE00"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="14" cy="14" r="1.5" fill="#39BE00" />
    </svg>
  )
}
