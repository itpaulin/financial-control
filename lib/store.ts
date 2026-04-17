import { create } from "zustand"
import { persist } from "zustand/middleware"
import { monthKey } from "./format"
import { createDefaultCategories } from "./seed"
import type { Month } from "./types"

type Store = {
  months: Record<string, Month>
  hydrated: boolean
  setHydrated: () => void
  ensureMonth: (year: number, month: number) => Month
  updateItemName: (mk: string, categoryId: string, itemId: string, name: string) => void
  updateItemBudget: (mk: string, categoryId: string, itemId: string, value: number) => void
  updateItemSpent: (mk: string, categoryId: string, itemId: string, value: number) => void
  addItem: (mk: string, categoryId: string) => string
  deleteItem: (mk: string, categoryId: string, itemId: string) => void
  copyFromPreviousMonth: (year: number, month: number) => void
}

export const useFinancialStore = create<Store>()(
  persist(
    (set, get) => ({
      months: {},
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      ensureMonth: (year, month) => {
        const mk = monthKey(year, month)
        const existing = get().months[mk]
        if (existing) return existing

        const newMonth: Month = {
          id: mk,
          year,
          month,
          categories: createDefaultCategories(),
        }
        set((s) => ({ months: { ...s.months, [mk]: newMonth } }))
        return newMonth
      },

      updateItemName: (mk, categoryId, itemId, name) =>
        set((s) => {
          const month = s.months[mk]
          if (!month) return s
          return {
            months: {
              ...s.months,
              [mk]: {
                ...month,
                categories: month.categories.map((cat) =>
                  cat.id !== categoryId
                    ? cat
                    : {
                        ...cat,
                        items: cat.items.map((item) =>
                          item.id !== itemId ? item : { ...item, name }
                        ),
                      }
                ),
              },
            },
          }
        }),

      updateItemBudget: (mk, categoryId, itemId, value) =>
        set((s) => {
          const month = s.months[mk]
          if (!month) return s
          return {
            months: {
              ...s.months,
              [mk]: {
                ...month,
                categories: month.categories.map((cat) =>
                  cat.id !== categoryId
                    ? cat
                    : {
                        ...cat,
                        items: cat.items.map((item) =>
                          item.id !== itemId ? item : { ...item, budget: value }
                        ),
                      }
                ),
              },
            },
          }
        }),

      updateItemSpent: (mk, categoryId, itemId, value) =>
        set((s) => {
          const month = s.months[mk]
          if (!month) return s
          return {
            months: {
              ...s.months,
              [mk]: {
                ...month,
                categories: month.categories.map((cat) =>
                  cat.id !== categoryId
                    ? cat
                    : {
                        ...cat,
                        items: cat.items.map((item) =>
                          item.id !== itemId ? item : { ...item, spent: value }
                        ),
                      }
                ),
              },
            },
          }
        }),

      addItem: (mk, categoryId) => {
        const id = `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        set((s) => {
          const month = s.months[mk]
          if (!month) return s
          return {
            months: {
              ...s.months,
              [mk]: {
                ...month,
                categories: month.categories.map((cat) =>
                  cat.id !== categoryId
                    ? cat
                    : {
                        ...cat,
                        items: [
                          ...cat.items,
                          { id, name: "", budget: 0, spent: 0, order: cat.items.length },
                        ],
                      }
                ),
              },
            },
          }
        })
        return id
      },

      deleteItem: (mk, categoryId, itemId) =>
        set((s) => {
          const month = s.months[mk]
          if (!month) return s
          return {
            months: {
              ...s.months,
              [mk]: {
                ...month,
                categories: month.categories.map((cat) =>
                  cat.id !== categoryId
                    ? cat
                    : { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
                ),
              },
            },
          }
        }),

      copyFromPreviousMonth: (year, month) => {
        const mk = monthKey(year, month)
        const [prevYear, prevMon] = month === 1 ? [year - 1, 12] : [year, month - 1]
        const prevMk = monthKey(prevYear, prevMon)
        const prev = get().months[prevMk]
        if (!prev) return

        set((s) => {
          const current = s.months[mk]
          if (!current) return s
          return {
            months: {
              ...s.months,
              [mk]: {
                ...current,
                categories: prev.categories.map((cat) => ({
                  ...cat,
                  items: cat.items.map((item) => ({
                    ...item,
                    spent: 0,
                  })),
                })),
              },
            },
          }
        })
      },
    }),
    {
      name: "financial-project:v1",
      skipHydration: true,
    }
  )
)
