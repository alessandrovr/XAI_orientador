import { useState } from 'react'
import { Home } from './pages/Home'
import { FluxoA } from './pages/FluxoA'
import { FluxoB } from './pages/FluxoB'
import { ResultadoA } from './pages/ResultadoA'
import { ResultadoB } from './pages/ResultadoB'
import { gerarPlano } from './engine/plan'
import { gerarDiagnostico } from './engine/diagnosis'
import type { Diagnostico, PlanoExplicabilidade } from './engine/types'

type Tela =
  | { nome: 'home' }
  | { nome: 'fluxoA' }
  | { nome: 'fluxoB' }
  | { nome: 'resultadoA'; plano: PlanoExplicabilidade }
  | { nome: 'resultadoB'; diagnostico: Diagnostico }

export default function App() {
  const [tela, setTela] = useState<Tela>({ nome: 'home' })

  function ir(t: Tela) {
    setTela(t)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="bg-grid min-h-dvh w-full">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
        <button
          type="button"
          onClick={() => ir({ nome: 'home' })}
          className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-ink"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-ink text-[9px] text-canvas-raised">X</span>
          XAI-Orientador
        </button>
      </header>

      {tela.nome === 'home' && <Home onComecar={() => ir({ nome: 'fluxoA' })} onDiagnosticar={() => ir({ nome: 'fluxoB' })} />}
      {tela.nome === 'fluxoA' && (
        <FluxoA onConcluir={(r) => ir({ nome: 'resultadoA', plano: gerarPlano(r) })} onVoltarInicio={() => ir({ nome: 'home' })} />
      )}
      {tela.nome === 'fluxoB' && (
        <FluxoB onConcluir={(r) => ir({ nome: 'resultadoB', diagnostico: gerarDiagnostico(r) })} onVoltarInicio={() => ir({ nome: 'home' })} />
      )}
      {tela.nome === 'resultadoA' && <ResultadoA plano={tela.plano} onRecomecar={() => ir({ nome: 'fluxoA' })} />}
      {tela.nome === 'resultadoB' && <ResultadoB diagnostico={tela.diagnostico} onRecomecar={() => ir({ nome: 'fluxoB' })} />}

      <footer className="mx-auto w-full max-w-3xl px-6 pb-10 pt-4">
        <p className="text-[12px] text-ink-faint">
          XAI-Orientador V1. Motor de decisão determinístico que roda no seu navegador; nenhum dado é enviado.
        </p>
      </footer>
    </div>
  )
}
