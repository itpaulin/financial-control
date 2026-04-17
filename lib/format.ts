const intl = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatBRL(value: number): string {
  return intl.format(value)
}

export function parseBRL(str: string): number {
  const cleaned = str.trim().replace(/[R$\s]/g, "")
  if (!cleaned) return 0
  if (/,\d{1,2}$/.test(cleaned)) {
    return parseFloat(cleaned.replace(/\./g, "").replace(",", "."))
  }
  const result = parseFloat(cleaned.replace(/,/g, ""))
  return isNaN(result) ? 0 : result
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`
}

export function prevMonth(year: number, month: number): [number, number] {
  if (month === 1) return [year - 1, 12]
  return [year, month - 1]
}

export function nextMonth(year: number, month: number): [number, number] {
  if (month === 12) return [year + 1, 1]
  return [year, month + 1]
}
