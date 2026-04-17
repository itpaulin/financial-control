import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Controle Financeiro",
  description: "Controle de gastos mensais",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn("h-full antialiased dark", inter.variable, jetBrainsMono.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
