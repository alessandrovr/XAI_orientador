interface HomeProps {
  onComecar: () => void
  onDiagnosticar: () => void
}

const PERGUNTAS = [
  { tipo: 'Global', pergunta: 'Quais variáveis mais importam?' },
  { tipo: 'Efeito', pergunta: 'Como uma variável muda a previsão?' },
  { tipo: 'Local', pergunta: 'Por que este caso recebeu esta previsão?' },
  { tipo: 'Contrafactual', pergunta: 'O que mudaria o resultado?' },
]

export function Home({ onComecar, onDiagnosticar }: HomeProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-2xl flex-col justify-center px-6 py-16">
      <h1 className="font-display text-4xl leading-[1.05] font-semibold text-ink sm:text-5xl">
        Como explicar o que meu modelo está fazendo?
      </h1>

      <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft">
        Responda 7 perguntas sobre seu modelo e receba um plano de interpretabilidade: quais técnicas usar, em que
        ordem, com quais pacotes, como checar se a explicação é confiável e como relatar.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onComecar}
          className="rounded-xl bg-ink px-7 py-3.5 text-[15px] font-medium text-canvas-raised transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Montar meu plano
        </button>
        <button
          type="button"
          onClick={onDiagnosticar}
          className="rounded-xl border border-line-strong bg-canvas-raised px-7 py-3.5 text-[15px] font-medium text-ink transition-colors hover:border-ink-soft"
        >
          Minha explicação parece estranha
        </button>
      </div>

      <div className="mt-14 border-t border-line pt-6">
        <p className="text-[13px] text-ink-faint">Cada técnica responde a uma destas perguntas:</p>
        <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {PERGUNTAS.map((p) => (
            <div key={p.tipo} className="bg-canvas-raised px-4 py-3">
              <dt className="font-display text-sm font-semibold text-pine">{p.tipo}</dt>
              <dd className="mt-0.5 text-[14px] text-ink-soft">{p.pergunta}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
