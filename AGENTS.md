<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

SEMPRE use TODAS as regras que estão em @.cursor/rules:

@.cursor/rules/general.mdc

@.cursor/rules/typescript.mdc

Este será um projeto financeiro com objetivo de controlar gastos separado por mes.

## Como os gastos funcionam
- Orcamento: O usuário preenche preferencialmente no início de cada mes informando quanto pretende gastar com aquele tipo de item
- Gasto: Quando o dinheiro sai do caixa/cai na fatura, ele deve ser incluido nesta coluna.
- Diferenca: subtracao entre orcamento e gasto, caso o gasto seja maior que o orcamento, deve alertar perigo (cor warn/error)
### Categorias
Uma categoria será RENDA, a entrada de receita daquele mes, as demais outras serão a separacão dos gastos. exemplo:
- Receita
- Obrigacoes: Aluguel, Luz, Agua, Internet, Gás
- Alimentacao: Supermercado, Marmita, Lanche, Comer fora.

No fim de toda categoria deve se ter informado o total, tanto do Orcamento, quanto do Gasto.

A UI deve ser completamente fluída e rápida, para que se assemelhe a facilidade de utilizar um EXCEL (Modelo anterior a este projeto que estamos criando para migrar o uso).


