import type { Category } from "./types"

export function createDefaultCategories(): Category[] {
  return [
    {
      id: "receita",
      name: "Receita",
      kind: "income",
      order: 0,
      items: [
        { id: "salario", name: "Salário", budget: 0, spent: 0, order: 0 },
        { id: "outros-receita", name: "Outros", budget: 0, spent: 0, order: 1 },
      ],
    },
    {
      id: "obrigacoes",
      name: "Obrigações",
      kind: "expense",
      order: 1,
      items: [
        { id: "aluguel", name: "Aluguel", budget: 0, spent: 0, order: 0 },
        { id: "luz-agua", name: "Luz/Água", budget: 0, spent: 0, order: 1 },
        { id: "energia", name: "Energia", budget: 0, spent: 0, order: 2 },
        { id: "internet", name: "Internet", budget: 0, spent: 0, order: 3 },
        { id: "fatura-cc", name: "Fatura CC", budget: 0, spent: 0, order: 4 },
        { id: "gas", name: "Gás", budget: 0, spent: 0, order: 5 },
      ],
    },
    {
      id: "alimentacao",
      name: "Alimentação",
      kind: "expense",
      order: 2,
      items: [
        { id: "supermercado", name: "Supermercado", budget: 0, spent: 0, order: 0 },
        { id: "marmita", name: "Marmita", budget: 0, spent: 0, order: 1 },
        { id: "lanche", name: "Lanche", budget: 0, spent: 0, order: 2 },
        { id: "comer-fora", name: "Comer fora", budget: 0, spent: 0, order: 3 },
      ],
    },
  ]
}
