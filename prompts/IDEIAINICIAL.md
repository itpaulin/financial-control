# Ideia Inicial — App de Controle Financeiro Mensal (v1)

## Objetivo

Migrar a planilha Excel de controle de gastos mensais para uma web app Next.js 16 que preserve a **fluidez do Excel**, adicionando histórico por mês, totais automáticos e alertas de estouro. A v1 é 100% local — sem autenticação, sem banco, sem backend.

## Escopo

**Entra (v1):**
- Tabela editável por mês com categorias e itens
- Colunas `Orçamento`, `Gasto`, derivado `Diferença`
- Totais automáticos por categoria e geral do mês
- Navegação entre meses (ano/mês)
- Persistência em **localStorage** (single-device, single-user)
- Atalhos de teclado (Tab/Enter/Esc) para edição inline
- Copiar orçamento do mês anterior
- Destaque visual quando `Gasto > Orçamento`
- Export/Import JSON (backup manual)

**Não entra (v1):**
- Autenticação (usuário único local)
- Banco de dados / backend / Server Actions
- Multi-device / sincronização
- Gráficos e relatórios anuais
- Importação de CSV/extrato bancário
- Categorização automática
- App mobile nativo
- Integração com Open Finance

## Modelo de Dados (TypeScript)

```ts
type CategoryKind = "income" | "expense";

type Item = {
  id: string;
  name: string;
  budget: number;
  spent: number;
  order: number;
};

type Category = {
  id: string;
  name: string;
  kind: CategoryKind;
  order: number;
  items: Item[];
};

type Month = {
  id: string;        // "YYYY-MM"
  year: number;
  month: number;     // 1-12
  categories: Category[];
};

type AppState = {
  months: Record<string, Month>;  // key = "YYYY-MM"
  version: number;                 // para migração futura
};
```

Totais (`totalBudget`, `totalSpent`, diferença) são **sempre derivados em runtime**, nunca armazenados.

Storage key: `financial-project:v1`.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) + React 19 |
| Linguagem | TypeScript (kebab-case, sem comentários) |
| UI | shadcn/ui + Radix + Tailwind 4 (tokens em `app/globals.css`, rem apenas) |
| Ícones | hugeicons |
| Forms/Validação | react-hook-form + zod |
| Estado | Zustand com middleware `persist` (localStorage) |
| UX fluida | Edição otimista local + debounce de gravação no storage |

## Arquitetura (estrutura de pastas)

```
app/
  page.tsx                → redireciona para mês atual
  [year]/[month]/page.tsx → MonthTable principal
  layout.tsx
  globals.css
lib/
  store.ts                → Zustand store com persist
  format.ts               → parse/format BRL, parse atalhos numéricos
  seed.ts                 → categorias padrão (Receita, Obrigações, Alimentação)
components/
  ui/                     → shadcn
  month-table/            → tabela, linha, célula editável
  month-switcher/         → seletor ano/mês
```

Sem `actions/`, sem `data/`, sem `prisma/` — tudo client-side.

## Estratégia para UX "Excel-like"

Como tudo é local, não há roundtrips — a UI muda instantaneamente:
1. **Edição inline** em `<Input>` invisível (sem borda até hover/focus)
2. **Debounce de 300ms** antes de gravar no localStorage (evita escrita a cada tecla)
3. **Atalhos**: `Tab`/`Shift+Tab` navegam células, `Enter` desce, `Esc` cancela
4. **`Enter` na última linha** cria item novo na mesma categoria
5. **Backspace em linha vazia** remove o item
6. **`Ctrl+Z`/`Ctrl+Shift+Z`** — undo/redo local (stack de até 20 operações em memória)
7. **Formatação BRL** na exibição, parse flexível (`1.234,56` e `1234.56`)

## Etapas de Execução

| # | Etapa | Estimativa |
|---|-------|------------|
| 1 | Limpar boilerplate, tema base, layout com shadcn | 1-2h |
| 2 | `lib/store.ts` Zustand + persist + seed de categorias | 2h |
| 3 | `lib/format.ts` (BRL, parse pt-BR) | 1h |
| 4 | `MonthTable` estática (Table shadcn, agrupamento por categoria) | 3h |
| 5 | Edição inline + navegação por teclado | 4-5h |
| 6 | Totais derivados + destaque `Gasto > Orçamento` | 1-2h |
| 7 | `MonthSwitcher` + "Copiar do mês anterior" | 2h |
| 8 | Adicionar/remover itens e categorias (por teclado) | 2-3h |
| 9 | Undo/redo (Ctrl+Z) | 2h |
| 10 | Export/Import JSON (backup) | 1-2h |
| 11 | Polimento: atalhos documentados, dark mode, acessibilidade | 2-3h |
| | **Total** | **~21-27h** |

## Entregas Esperadas

1. Página `/` redirecionando para o mês atual
2. Rota `/[year]/[month]` exibindo tabela editável do mês
3. Persistência automática em localStorage após cada edição
4. Totais e alertas em tempo real
5. Export/Import JSON funcionais
6. README com atalhos, comandos `pnpm` e convenções

---

## Mapa Mental de Análise

```
                       [App Financeiro Mensal v1]
                                 |
        +------------------------+------------------------+
        |            |            |            |          |
   DIFICULDADES  PONTOS DE   CHANCE DE      LOE        TEMPO
                 MELHORIA    SUCESSO
        |            |            |            |          |
  - UX Excel    - Fórmulas    9/10          M        ~2-3 semanas
    exige         inline        (escopo      (~24h)   (part-time)
    trabalho      (=100+200)    enxuto,
    fino em     - Export        stack
    teclado       CSV           pronto)
  - Next 16    - Tags
    breaking     por item
    changes    - Dark mode
  - pt-BR      - Atalhos
    numérico    custom

        +------------------------+------------------------+
        |            |            |            |          |
  RENTABILIDADE  RISCOS      DIFERENCIAIS APRENDIZADO  PRÓXIMO
                                                       PASSO
        |            |            |            |          |
  Não direta   - Perda de   - Foco        - Next 16   Instalar
  (uso          dados ao      radical       (App       zustand
  pessoal)      limpar        em UX         Router)    e criar
  Base para     cache        - Zero        - Zustand   lib/store.ts
  v2 com DB    - Formato      atrito        persist    com seed
  no futuro     pt-BR         (sem auth,  - Edição     das
                edge cases    sem DB)       inline     categorias
              - Escopo      - Mental-      React 19
                crescer      model 1:1    - Tailwind 4
                             com a          + shadcn
                             planilha
```

## Análise Detalhada

| Critério | Avaliação |
|----------|-----------|
| **Dificuldades** | (1) Atalhos e navegação por teclado tipo Excel exigem polimento; (2) Next.js 16 tem breaking changes — consultar `node_modules/next/dist/docs/`; (3) parsing pt-BR de números (`1.234,56`) |
| **Pontos de Melhoria** | Fórmulas inline (`=100+200`), tags por item, export CSV, dark mode, atalhos configuráveis |
| **Chance de Sucesso** | **9/10** — escopo enxuto, sem servidor, sem auth, stack conhecido |
| **LOE** | **M** (Médio) — ~24h |
| **Tempo** | ~2-3 semanas part-time (2-3h/dia); ~4-5 dias full-time |
| **Rentabilidade** | Direta: nenhuma. Indireta: alta — ferramenta diária + base sólida para v2 (DB + auth) |
| **Riscos** | **Alto**: perda de dados se usuário limpar cache → mitigar com export JSON desde o MVP. **Médio**: escopo crescer. **Baixo**: tudo o resto |
| **Diferenciais** | UX focada em velocidade; zero fricção de onboarding (abriu, usou); arquitetura simples que evolui para v2 sem reescrita |
| **Aprendizado** | Next.js 16 (App Router, RSC), Tailwind 4, shadcn avançado, Zustand + persist, edição inline com atalhos, formatação pt-BR |
| **Complexidade Técnica** | **Baixa-Média** — a dificuldade está no polimento da UX, não na arquitetura |
| **Impacto** | Alto pessoal (uso diário); bom portfólio (UX refinada); baixo financeiro direto |
| **Dependências** | Instalar `zustand`. Ler guias de `node_modules/next/dist/docs/01-app/` antes de codar |
| **Próximo Passo** | `pnpm add zustand` + criar `lib/store.ts` com o modelo acima e seed das categorias |

## Veredito

**Vale a pena?** Sim.
**Recomendação:** Foco na tabela editável e nos atalhos. Tudo o resto (export, dark mode, undo) é secundário até a célula editável estar impecável.
**Se eu fosse você:** Entregaria v1 em ~1 semana, usaria diariamente por 2-3 meses, e só depois decidiria se vale migrar para v2 com Prisma + Better Auth — a planilha vai te mostrar quais features realmente faltam.

## Roadmap pós-v1 (fora do escopo atual)

- **v2**: Prisma 7 + SQLite + Better Auth (tudo local mas com DB robusto)
- **v3**: Supabase/Postgres remoto + multi-device
- **v4**: Gráficos, relatórios anuais, tags, fórmulas inline
