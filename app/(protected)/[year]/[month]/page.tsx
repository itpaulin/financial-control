import { MonthTable } from "@/components/month-table"

type Props = {
  params: Promise<{ year: string; month: string }>
}

export default async function MonthPage({ params }: Props) {
  const { year, month } = await params
  const y = parseInt(year, 10)
  const m = parseInt(month, 10)

  if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
    const now = new Date()
    return <MonthTable year={now.getFullYear()} month={now.getMonth() + 1} />
  }

  return <MonthTable year={y} month={m} />
}
