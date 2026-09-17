import { useState } from 'react'
import type { Diagnostico } from '../engine/types'
import { BotoesRelatorio, ListaReferencias, Premissas, Secao, Tabela } from '../components/Relatorio'

interface ResultadoBProps {
  diagnostico: Diagnostico
  onRecomecar: () => void
}

export function ResultadoB({ diagnostico: d, onRecomecar }: ResultadoBProps) {
  const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const [baixando, setBaixando] = useState(false)

  async function baixar() {
    setBaixando(true)
    try {
      const { baixarDocxDiagnostico } = await import('../utils/generateDocx')
      await baixarDocxDiagnostico(d, hoje)
    } finally {
      setBaixando(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="mb-1 font-mono text-xs text-ink-faint">Diagnóstico de explicação, {hoje}</p>
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">O que pode estar acontecendo</h1>

      <section className="mt-10 rounded-2xl border border-clay bg-clay-soft p-6 sm:p-8">
        <p className="text-sm text-clay">Causa provável</p>
        <p className="mt-2 font-display text-xl leading-snug font-semibold text-ink sm:text-2xl">{d.causaProvavel}</p>
      </section>

      <Secao titulo="O que você relatou">
        <Tabela
          linhas={[
            ['Sintoma', d.sintoma],
            ['Modelo e técnica', d.relatoInformado ?? 'Não informado'],
          ]}
        />
      </Secao>

      <Secao titulo="O que fazer">
        <ol className="flex flex-col gap-3">
          {d.intervencoes.map((passo, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pine font-mono text-xs text-pine">
                {i + 1}
              </span>
              <span className="pt-0.5 text-[15px] leading-relaxed text-ink-soft">{passo}</span>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao titulo="Por que isso acontece">
        <p className="text-[15px] leading-relaxed text-ink-soft">{d.porQueSeAplica}</p>
      </Secao>

      <Secao titulo="Como conferir se resolveu">
        <p className="text-[15px] leading-relaxed text-ink-soft">{d.comoReavaliar}</p>
      </Secao>

      <Secao titulo="Referências">
        <ListaReferencias referencias={d.referencias} />
      </Secao>

      <Secao titulo="O que você ainda pode informar">
        <Premissas itens={d.premissasAssumidas} />
      </Secao>

      <BotoesRelatorio baixando={baixando} onBaixar={baixar} onRecomecar={onRecomecar} rotuloRecomecar="Diagnosticar outro problema" />
    </div>
  )
}
