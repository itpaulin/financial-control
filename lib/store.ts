import { create } from "zustand"
import { persist } from "zustand/middleware"
import { monthKey } from "./format"
import { createDefaultCategories } from "./seed"
import { SEED_CATEGORIES } from "./seed-data"
import type { CategoryKind, Month } from "./types"

type Store = {
  months: Record<string, Month>
  hydrated: boolean
  setHydrated: () => void
  ensureMonth: (year: number, month: number) => Month
  loadSeed: (year: number, month: number) => void
  updateItemName: (mk: string, categoryId: string, itemId: string, name: string) => void
  updateItemBudget: (mk: string, categoryId: string, itemId: string, value: number) => void
  updateItemSpent: (mk: string, categoryId: string, itemId: string, value: number) => void
  addItem: (mk: string, categoryId: string) => string
  deleteItem: (mk: string, categoryId: string, itemId: string) => void
  addCategory: (mk: string, name: string, kind: CategoryKind) => string
  deleteCategory: (mk: string, categoryId: string) => void
  updateCategoryName: (mk: string, categoryId: string, name: string) => void
  updateCategoryColor: (mk: string, categoryId: string, color: string | null) => void
  copyFromPreviousMonth: (year: number, month: number) => void
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function patchMonth(
  s: Store,
  mk: string,
  updater: (month: Month) => Month
): Partial<Store> {
  const month = s.months[mk]
  if (!month) return s
  return { months: { ...s.months, [mk]: updater(month) } }
}

export const useFinancialStore = create<Store>()(
  persist(
    (set, get) => ({
      months: {},
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      loadSeed: (year, month) => {
        const mk = monthKey(year, month)
        set((s) => ({
          months: {
            ...s.months,
            [mk]: { id: mk, year, month, categories: SEED_CATEGORIES },
          },
        }))
      },

      ensureMonth: (year, month) => {
        const mk = monthKey(year, month)
        const existing = get().months[mk]
        if (existing) return existing
        const newMonth: Month = { id: mk, year, month, categories: createDefaultCategories() }
        set((s) => ({ months: { ...s.months, [mk]: newMonth } }))
        return newMonth
      },

      updateItemName: (mk, categoryId, itemId, name) =>
        set((s) => patchMonth(s, mk, (m) => ({
          ...m,
          categories: m.categories.map((cat) =>
            cat.id !== categoryId ? cat : {
              ...cat,
              items: cat.items.map((i) => i.id !== itemId ? i : { ...i, name }),
            }
          ),
        }))),

      updateItemBudget: (mk, categoryId, itemId, value) =>
        set((s) => patchMonth(s, mk, (m) => ({
          ...m,
          categories: m.categories.map((cat) =>
            cat.id !== categoryId ? cat : {
              ...cat,
              items: cat.items.map((i) => i.id !== itemId ? i : { ...i, budget: value }),
            }
          ),
        }))),

      updateItemSpent: (mk, categoryId, itemId, value) =>
        set((s) => patchMonth(s, mk, (m) => ({
          ...m,
          categories: m.categories.map((cat) =>
            cat.id !== categoryId ? cat : {
              ...cat,
              items: cat.items.map((i) => i.id !== itemId ? i : { ...i, spent: value }),
            }
          ),
        }))),

      addItem: (mk, categoryId) => {
        const id = newId("item")
        set((s) => patchMonth(s, mk, (m) => ({
          ...m,
          categories: m.categories.map((cat) =>
            cat.id !== categoryId ? cat : {
              ...cat,
              items: [...cat.items, { id, name: "", budget: 0, spent: 0, order: cat.items.length }],
            }
          ),
        })))
        return id
      },

      deleteItem: (mk, categoryId, itemId) =>
        set((s) => patchMonth(s, mk, (m) => ({
          ...m,
          categories: m.categories.map((cat) =>
            cat.id !== categoryId ? cat : {
              ...cat,
              items: cat.items.filter((i) => i.id !== itemId),
            }
          ),
        }))),

      addCategory: (mk, name, kind) => {
        const id = newId("cat")
        set((s) => patchMonth(s, mk, (m) => {
          const maxOrder = m.categories.reduce((max, c) => Math.max(max, c.order), -1)
          return {
            ...m,
            categories: [...m.categories, { id, name, kind, order: maxOrder + 1, items: [] }],
          }
        }))
        return id
      },

      deleteCategory: (mk, categoryId) =>
        set((s) => patchMonth(s, mk, (m) => ({
          ...m,
          categories: m.categories.filter((c) => c.id !== categoryId),
        }))),

      updateCategoryName: (mk, categoryId, name) =>
        set((s) => patchMonth(s, mk, (m) => ({
          ...m,
          categories: m.categories.map((c) => c.id !== categoryId ? c : { ...c, name }),
        }))),

      updateCategoryColor: (mk, categoryId, color) =>
        set((s) => patchMonth(s, mk, (m) => ({
          ...m,
          categories: m.categories.map((c) =>
            c.id !== categoryId ? c : { ...c, color: color ?? undefined }
          ),
        }))),

      copyFromPreviousMonth: (year, month) => {
        const mk = monthKey(year, month)
        const [py, pm] = month === 1 ? [year - 1, 12] : [year, month - 1]
        const prev = get().months[monthKey(py, pm)]
        if (!prev) return
        set((s) => patchMonth(s, mk, (m) => ({
          ...m,
          categories: prev.categories.map((cat) => ({
            ...cat,
            items: cat.items.map((item) => ({ ...item, spent: 0 })),
          })),
        })))
      },
    }),
    { name: "financial-project:v1", skipHydration: true }
  )
)
