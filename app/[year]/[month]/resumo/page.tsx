import { MonthDashboard } from "@/components/month-dashboard"

type Props = {
  params: Promise<{ year: string; month: string }>
}

export default async function ResumePage({ params }: Props) {
  const { year, month } = await params
  const y = parseInt(year, 10)
  const m = parseInt(month, 10)

  return <MonthDashboard year={y} month={m} />
}
