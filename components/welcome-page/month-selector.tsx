"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const MONTHS = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
]

const now = new Date()
const CURRENT_YEAR = now.getFullYear()
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1]

export function MonthSelector() {
  const router = useRouter()
  const [month, setMonth] = useState(String(now.getMonth() + 1))
  const [year, setYear] = useState(String(CURRENT_YEAR))

  function handleNavigate() {
    router.push(`/${year}/${month}`)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-sm text-white/60">Selecione o período para começar</p>

      <div className="flex gap-3">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/8 focus:ring-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-28 bg-white/5 border-white/10 text-white hover:bg-white/8 focus:ring-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleNavigate}
        className="w-full bg-[#39BE00] hover:bg-[#2fa300] text-black font-semibold h-11 rounded-xl"
      >
        Acessar planilha
      </Button>
    </div>
  )
}
