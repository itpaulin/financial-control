import type { Category } from "./types"

export const SEED_CATEGORIES: Category[] = [
  {
    id: "seed-cat-renda",
    name: "RENDA",
    kind: "income",
    order: 0,
    items: [
      { id: "seed-item-salario",     name: "Salário",               budget: 5000, spent: 3000, order: 0 },
      { id: "seed-item-juros",       name: "Renda de Juros",         budget: 0,        spent: 0,        order: 1 },
      { id: "seed-item-dividendos",  name: "Dividendos",             budget: 0,        spent: 0,        order: 2 },
      { id: "seed-item-inesperado",  name: "Dinheiro Inesperado",    budget: 0,        spent: 0,        order: 3 },
      { id: "seed-item-reembolsos",  name: "Reembolsos",             budget: 250.00,   spent: 250.00,   order: 4 },
    ],
  },
  {
    id: "seed-cat-fixas",
    name: "FIXAS",
    kind: "expense",
    order: 1,
    items: [
      { id: "seed-item-agua",     name: "Água",     budget: 110, spent: 0, order: 0 },
      { id: "seed-item-energia",  name: "Energia",  budget: 220, spent: 0, order: 1 },
      { id: "seed-item-internet", name: "Internet", budget: 79.99, spent: 0, order: 2 },
      { id: "seed-item-telefone", name: "Telefone", budget: 30, spent: 0, order: 3 },
      { id: "seed-item-gas",      name: "Gás",      budget: 0, spent: 0, order: 4 },
    ],
  },
  {
    id: "seed-cat-transporte",
    name: "TRANSPORTE",
    kind: "expense",
    order: 3,
    items: [
      { id: "seed-item-combustivel",  name: "Combustível",                   budget: 220, spent: 0, order: 0 },
      { id: "seed-item-moto",         name: "Manutenção Moto",               budget: 60, spent: 0, order: 1 },
      { id: "seed-item-aplicativo",   name: "Carro de Aplicativo + público", budget: 0, spent: 0, order: 2 },
    ],
  },
  {
    id: "seed-cat-assinaturas",
    name: "ASSINATURAS",
    kind: "expense",
    order: 4,
    items: [
      { id: "seed-item-academia",    name: "Academia",         budget: 95.00,  spent: 0,      order: 0 },
      { id: "seed-item-mma",         name: "MMA",budget: 140,      spent: 0,      order: 1 },
      { id: "seed-item-meli",        name: "Streamings MELI+", budget: 74.90,  spent: 0,      order: 2 },
      { id: "seed-item-crunchyroll", name: "Crunchyroll rateio",budget: 5.00,   spent: 5.00,   order: 3 },
      { id: "seed-item-psplus",      name: "Playstation Plus",  budget: 200.00, spent: 193.44, order: 5 },
    ],
  },
  {
    id: "seed-cat-alimentacao",
    name: "ALIMENTAÇÃO",
    kind: "expense",
    order: 7,
    items: [
      { id: "seed-item-supermercado", name: "Supermercado", budget: 0, spent: 0, order: 0 },
      { id: "seed-item-marmitas",     name: "Quentinhas",     budget: 0, spent: 0, order: 1 },
      { id: "seed-item-comer-fora",   name: "Comer fora",   budget: 0, spent: 0, order: 2 },
      { id: "seed-item-lanches",      name: "Lanches",      budget: 0, spent: 0, order: 3 },
      { id: "seed-item-suplementos",  name: "Suplementos",  budget: 0, spent: 0, order: 4 },
    ],
  },
  {
    id: "seed-cat-pets",
    name: "PETS",
    kind: "expense",
    order: 8,
    items: [
      { id: "seed-item-chico",      name: "Chico",        budget: 0, spent: 0, order: 0 },
      { id: "seed-item-med-pets",   name: "Medicamentos", budget: 0, spent: 300, order: 2 },
      { id: "seed-item-brinquedos", name: "Brinquedos",   budget: 0, spent: 0, order: 3 },
    ],
  },
  {
    id: "seed-cat-entretenimento",
    name: "ENTRETENIMENTO",
    kind: "expense",
    order: 10,
    items: [
      { id: "seed-item-cinema",   name: "Filmes/Cinema",    budget: 0, spent: 0, order: 0 },
      { id: "seed-item-jogos",    name: "Jogos",            budget: 0, spent: 10, order: 1 },
      { id: "seed-item-shows",    name: "Shows - ingresso", budget: 0, spent: 120, order: 2 },
      { id: "seed-item-livros",   name: "Livros",           budget: 0, spent: 0, order: 3 },
      { id: "seed-item-passeios", name: "Passeios",         budget: 0, spent: 0, order: 4 },
    ],
  },
  
]
