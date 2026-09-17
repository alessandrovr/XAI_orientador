import type { ReactNode } from 'react'
import type { Referencia } from '../engine/types'

export function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold text-ink">{titulo}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function Tabela({ cabecalhos, linhas }: { cabecalhos?: string[]; linhas: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-left text-sm">
        {cabecalhos && (
          <thead>
            <tr className="border-b border-line bg-canvas-raised">
              {cabecalhos.map((c) => (
                <th key={c} className="px-4 py-3 font-mono text-[11px] font-medium text-ink-faint">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {linhas.map((linha, i) => (
            <tr key={i} className={i !== linhas.length - 1 ? 'border-b border-line' : ''}>
              {linha.map((celula, j) => (
                <td key={j} className={`px-4 py-3 align-top ${j === 0 ? 'font-medium text-ink' : 'text-ink-soft'}`}>
                  {celula}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ListaReferencias({ referencias }: { referencias: Referencia[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {referencias.map((ref, i) => (
        <li key={i} className="text-[14px] leading-relaxed text-ink-soft">
          <span className="font-mono text-ink-faint">[{i + 1}]</span> {ref.autores} ({ref.ano}). {ref.titulo}.{' '}
          <em>{ref.veiculo}</em>.
        </li>
      ))}
    </ol>
  )
}

export function Premissas({ itens }: { itens: { campo: string; comoRefinar: string }[] }) {
  if (itens.length === 0)
    return <p className="text-[14px] text-ink-soft">Todas as informações relevantes foram fornecidas; nenhuma premissa foi necessária.</p>
  return <Tabela cabecalhos={['O que assumimos', 'Você pode refinar informando']} linhas={itens.map((p) => [p.campo, p.comoRefinar])} />
}

export function BotoesRelatorio({
  baixando,
  onBaixar,
  onRecomecar,
  rotuloRecomecar,
}: {
  baixando: boolean
  onBaixar: () => void
  onRecomecar: () => void
  rotuloRecomecar: string
}) {
  return (
    <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-8">
      <button
        type="button"
        onClick={onBaixar}
        disabled={baixando}
        className="rounded-xl border border-line-strong bg-canvas-raised px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink-soft disabled:cursor-wait disabled:opacity-60"
      >
        {baixando ? 'Gerando .docx…' : 'Baixar relatório (.docx)'}
      </button>
      <button
        type="button"
        onClick={onRecomecar}
        className="rounded-xl px-6 py-3 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        {rotuloRecomecar}
      </button>
    </div>
  )
}
