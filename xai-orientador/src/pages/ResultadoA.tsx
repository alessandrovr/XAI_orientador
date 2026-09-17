import { useState } from 'react'
import type { PlanoExplicabilidade } from '../engine/types'
import { BotoesRelatorio, ListaReferencias, Premissas, Secao, Tabela } from '../components/Relatorio'

interface ResultadoAProps {
  plano: PlanoExplicabilidade
  onRecomecar: () => void
}

const CONFIANCA = { alto: 'Alta', moderado: 'Moderada', baixo: 'Baixa' }

export function ResultadoA({ plano, onRecomecar }: ResultadoAProps) {
  const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const [baixando, setBaixando] = useState(false)

  async function baixar() {
    setBaixando(true)
    try {
      const { baixarDocxPlano } = await import('../utils/generateDocx')
      await baixarDocxPlano(plano, hoje)
    } finally {
      setBaixando(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="mb-1 font-mono text-xs text-ink-faint">Plano de explicabilidade, {hoje}</p>
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Seu plano de interpretabilidade</h1>

      <section className="mt-10 rounded-2xl border border-clay bg-clay-soft p-6 sm:p-8">
        <p className="text-sm text-clay">Comece por</p>
        <p className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">{plano.tecnicaPrincipal}</p>
        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-clay/30 pt-5 sm:grid-cols-[2fr_1fr]">
          <div>
            <dt className="text-[12px] text-ink-faint">Tipo de explicação</dt>
            <dd className="mt-1 text-[15px] text-ink">{plano.familia}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-ink-faint">Confiança do plano</dt>
            <dd className="mt-1 text-[15px] text-ink">{CONFIANCA[plano.nivelConfianca]}</dd>
          </div>
        </dl>
      </section>

      <Secao titulo="Seu contexto">
        <Tabela linhas={plano.contexto.map((c) => [c.campo, c.valor])} />
      </Secao>

      <Secao titulo="Por que esta técnica">
        <p className="text-[15px] leading-relaxed text-ink-soft">{plano.justificativa}</p>
      </Secao>

      <Secao titulo="Técnicas do plano">
        <Tabela
          cabecalhos={['Técnica', 'O que responde', 'Cuidado', 'Papel']}
          linhas={plano.tecnicas.map((t, i) => [
            t.nome,
            t.responde,
            t.cuidado,
            <span
              key="papel"
              className={`inline-block rounded-full px-2.5 py-1 font-mono text-[10px] whitespace-nowrap ${
                i === 0 ? 'bg-pine text-canvas-raised' : 'bg-canvas text-ink-faint'
              }`}
            >
              {i === 0 ? 'Principal' : t.escopo === 'auditoria' ? 'Auditoria' : 'Complementar'}
            </span>,
          ])}
        />
      </Secao>

      <Secao titulo="Passo a passo">
        <ol className="flex flex-col gap-3">
          {plano.roteiro.map((passo, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pine font-mono text-xs text-pine">
                {i + 1}
              </span>
              <span className="pt-0.5 text-[15px] leading-relaxed text-ink-soft">{passo}</span>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao titulo="Pacotes">
        <Tabela
          cabecalhos={['Técnica', 'Python', 'R']}
          linhas={plano.tecnicas.map((t) => [t.nome, <code key="py" className="font-mono text-[13px]">{t.python}</code>, <code key="r" className="font-mono text-[13px]">{t.r}</code>])}
        />
      </Secao>

      {plano.alertas.length > 0 && (
        <Secao titulo="Atenção no seu caso">
          <div className="flex flex-col gap-3">
            {plano.alertas.map((a) => (
              <div key={a.titulo} className="rounded-xl border border-signal/40 bg-signal-soft p-5">
                <p className="font-display text-[15px] font-semibold text-ink">{a.titulo}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{a.texto}</p>
              </div>
            ))}
          </div>
        </Secao>
      )}

      <Secao titulo="Como saber se a explicação é confiável">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-ink-soft marker:text-pine">
          {plano.checagem.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Secao>

      <Secao titulo="Como relatar">
        <p className="text-[15px] leading-relaxed text-ink-soft">{plano.comoRelatar}</p>
      </Secao>

      <Secao titulo="Referências">
        <ListaReferencias referencias={plano.referencias} />
      </Secao>

      <Secao titulo="O que você ainda pode informar">
        <Premissas itens={plano.premissasAssumidas} />
      </Secao>

      <section className="mt-10 rounded-xl border border-line bg-canvas-raised p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Explicação não é causalidade</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
          Estas técnicas mostram como o modelo usa os dados, não como o mundo funciona. Para afirmar efeitos causais, é
          preciso um desenho de estudo e uma análise próprios para isso.
        </p>
      </section>

      <BotoesRelatorio baixando={baixando} onBaixar={baixar} onRecomecar={onRecomecar} rotuloRecomecar="Montar outro plano" />
    </div>
  )
}
