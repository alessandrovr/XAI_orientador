import { useMemo, useState } from 'react'
import { PERGUNTAS_FLUXO_A } from '../data/questions'
import { OpcaoCard } from '../components/OpcaoCard'
import { TrilhaDecisao } from '../components/TrilhaDecisao'
import { perguntaAtiva } from '../engine/plan'
import type { RespostasFluxoA } from '../engine/types'

interface FluxoAProps {
  onConcluir: (respostas: RespostasFluxoA) => void
  onVoltarInicio: () => void
}

export function FluxoA({ onConcluir, onVoltarInicio }: FluxoAProps) {
  const [respostas, setRespostas] = useState<RespostasFluxoA>({})
  const [passo, setPasso] = useState(0)

  const sequencia = useMemo(() => PERGUNTAS_FLUXO_A.filter((p) => perguntaAtiva(p.id, respostas)), [respostas])
  const pergunta = sequencia[passo]
  const total = sequencia.length

  function responder(letra: string) {
    const novas = { ...respostas, [pergunta.id]: letra } as RespostasFluxoA
    // Mudar o tipo de dado pode esconder a pergunta de correlação: limpa a resposta órfã.
    if (!perguntaAtiva('correlacao', novas)) delete novas.correlacao
    setRespostas(novas)
    const novaSequencia = PERGUNTAS_FLUXO_A.filter((p) => perguntaAtiva(p.id, novas))
    const proximo = novaSequencia.findIndex((p) => p.id === pergunta.id) + 1
    if (proximo >= novaSequencia.length) onConcluir(novas)
    else setPasso(proximo)
  }

  function voltar() {
    if (passo === 0) onVoltarInicio()
    else setPasso((p) => p - 1)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-2xl flex-col px-6 py-10">
      <button
        type="button"
        onClick={voltar}
        className="mb-8 flex w-fit items-center gap-1.5 font-mono text-xs text-ink-faint transition-colors hover:text-ink"
      >
        ← Voltar
      </button>

      <TrilhaDecisao rotulos={sequencia.map((p) => p.trilhaLabel)} indiceAtual={passo} />

      <div className="mt-6 mb-8">
        <div className="mb-2 font-mono text-xs text-ink-faint">
          Pergunta {passo + 1} de {total}
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-signal transition-all duration-500 ease-out"
            style={{ width: `${((passo + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="font-display text-2xl leading-snug font-semibold text-ink sm:text-[28px]">{pergunta.texto}</h2>
      {pergunta.ajuda && <p className="mt-2 text-sm text-ink-faint">{pergunta.ajuda}</p>}

      <div className="mt-8 flex flex-col gap-3">
        {pergunta.opcoes.map((opcao) => (
          <OpcaoCard
            key={opcao.letra}
            opcao={opcao}
            selecionada={respostas[pergunta.id] === opcao.letra}
            onSelecionar={() => responder(opcao.letra)}
          />
        ))}
      </div>
    </div>
  )
}
