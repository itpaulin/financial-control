import { MonthSelector } from "./month-selector"

const BG_IMAGE =
  "https://www.figma.com/api/mcp/asset/cde255b2-2360-4cda-a7c9-984f12a81075"

export function WelcomePage() {
  return (
    <div className="min-h-screen flex bg-[#0b0b0d]">
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 lg:px-16">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-white font-bold text-2xl tracking-tight">
              finance<span className="text-[#39BE00]">.</span>ai
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-white font-bold text-4xl leading-tight">
              Bem-vindo
            </h1>
            <p className="text-white/60 text-base leading-relaxed">
              Controle seus gastos mensais de forma simples e rápida, com uma
              interface fluida como uma planilha.
            </p>
          </div>

          <div className="rounded-xl border border-white/8 p-5 bg-white/[0.02]">
            <MonthSelector />
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-[55%] overflow-hidden">
        <img
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0d] via-[#0b0b0d]/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d]/80 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-12">
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg opacity-80">
            <StatCard label="Receita" value="R$ 9.200" positive />
            <StatCard label="Despesas" value="R$ 7.350" />
            <StatCard label="Saldo" value="R$ 1.850" positive />
            <StatCard label="Categorias" value="3 ativas" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LogoMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="8" fill="#39BE00" fillOpacity="0.15" />
      <path
        d="M7 14C7 10.134 10.134 7 14 7C17.866 7 21 10.134 21 14"
        stroke="#39BE00"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 14L10.5 17.5"
        stroke="#39BE00"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="14" cy="14" r="1.5" fill="#39BE00" />
    </svg>
  )
}

function StatCard({
  label,
  value,
  positive,
}: {
  label: string
  value: string
  positive?: boolean
}) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm">
      <p className="text-white/40 text-xs mb-1">{label}</p>
      <p
        className={
          positive ? "text-[#39BE00] font-mono font-semibold" : "text-white font-mono font-semibold"
        }
      >
        {value}
      </p>
    </div>
  )
}
