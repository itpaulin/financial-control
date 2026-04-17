export type CategoryKind = "income" | "expense"

export type Item = {
  id: string
  name: string
  budget: number
  spent: number
  order: number
}

export type Category = {
  id: string
  name: string
  kind: CategoryKind
  order: number
  items: Item[]
  color?: string
}

export type Month = {
  id: string
  year: number
  month: number
  categories: Category[]
}

export type AppState = {
  months: Record<string, Month>
  version: number
}
