// Geração do relatório em .docx no navegador (biblioteca `docx`, sem backend).
// Espelha o conteúdo de ResultadoA.tsx e ResultadoB.tsx, na mesma ordem.

import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'
import type { Diagnostico, PlanoExplicabilidade, Referencia } from '../engine/types'

const COR_TITULO = '1F2421'
const COR_SUBTITULO = '6B6F70'
const COR_CABECALHO_TABELA = 'E7E2D8'

function subtitulo(texto: string): Paragraph {
  return new Paragraph({
    spacing: { after: 240 },
    children: [new TextRun({ text: texto, italics: true, color: COR_SUBTITULO, size: 20 })],
  })
}

function h2(texto: string): Paragraph {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 320, after: 120 }, text: texto })
}

function paragrafo(texto: string): Paragraph {
  return new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: texto, size: 22 })] })
}

function celula(texto: string, opts: { cabecalho?: boolean; largura?: number } = {}): TableCell {
  return new TableCell({
    width: opts.largura ? { size: opts.largura, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.cabecalho ? { type: ShadingType.CLEAR, fill: COR_CABECALHO_TABELA } : undefined,
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    children: [
      new Paragraph({
        children: [new TextRun({ text: texto, bold: opts.cabecalho, size: 20 })],
      }),
    ],
  })
}

function tabela(cabecalhos: string[], linhas: string[][], larguras?: number[]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: cabecalhos.map((c, i) => celula(c, { cabecalho: true, largura: larguras?.[i] })) }),
      ...linhas.map((linha) => new TableRow({ children: linha.map((c, i) => celula(c, { largura: larguras?.[i] })) })),
    ],
  })
}

function tituloDocumento(texto: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 80 },
    children: [new TextRun({ text: texto, color: COR_TITULO })],
  })
}

async function baixarDocumento(doc: Document, nomeArquivo: string): Promise<void> {
  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function nomeArquivoComData(prefixo: string): string {
  const hoje = new Date()
  const iso = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  return `${prefixo}-${iso}.docx`
}

function item(texto: string, numero?: number): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    indent: { left: 360 },
    children: [new TextRun({ text: `${numero !== undefined ? `${numero}. ` : '• '}${texto}`, size: 22 })],
  })
}

function referencias(refs: Referencia[]): Paragraph[] {
  return refs.map((ref, i) => paragrafo(`[${i + 1}] ${ref.autores} (${ref.ano}). ${ref.titulo}. ${ref.veiculo}.`))
}

function premissas(itens: { campo: string; comoRefinar: string }[]): (Paragraph | Table)[] {
  if (itens.length === 0) return [paragrafo('Todas as informações relevantes foram fornecidas; nenhuma premissa foi necessária.')]
  return [tabela(['O que assumimos', 'Você pode refinar informando'], itens.map((p) => [p.campo, p.comoRefinar]), [45, 55])]
}

function documento(children: (Paragraph | Table)[]): Document {
  return new Document({
    sections: [{ properties: {}, children }],
    styles: { default: { document: { run: { font: 'Calibri' } } } },
  })
}

export async function baixarDocxPlano(p: PlanoExplicabilidade, dataFormatada: string): Promise<void> {
  const c: (Paragraph | Table)[] = []
  const confianca = { alto: 'Alta', moderado: 'Moderada', baixo: 'Baixa' }[p.nivelConfianca]

  c.push(tituloDocumento('Plano de Interpretabilidade e Explicabilidade'))
  c.push(subtitulo(`Gerado pelo XAI-Orientador em ${dataFormatada}, a partir das respostas fornecidas.`))

  c.push(h2('1. Resumo'))
  c.push(tabela(['Campo', 'Conteúdo'], [['Técnica principal', p.tecnicaPrincipal], ['Tipo de explicação', p.familia], ['Confiança do plano', confianca]], [35, 65]))

  c.push(h2('2. Contexto'))
  c.push(tabela(['Campo', 'Resposta'], p.contexto.map((x) => [x.campo, x.valor]), [40, 60]))

  c.push(h2('3. Por que esta técnica'))
  c.push(paragrafo(p.justificativa))

  c.push(h2('4. Técnicas do plano'))
  c.push(
    tabela(
      ['Técnica', 'O que responde', 'Cuidado', 'Papel'],
      p.tecnicas.map((t, i) => [t.nome, t.responde, t.cuidado, i === 0 ? 'Principal' : t.escopo === 'auditoria' ? 'Auditoria' : 'Complementar']),
      [20, 33, 35, 12],
    ),
  )

  c.push(h2('5. Passo a passo'))
  p.roteiro.forEach((passo, i) => c.push(item(passo, i + 1)))

  c.push(h2('6. Pacotes'))
  c.push(tabela(['Técnica', 'Python', 'R'], p.tecnicas.map((t) => [t.nome, t.python, t.r]), [34, 33, 33]))

  if (p.alertas.length > 0) {
    c.push(h2('7. Atenção no seu caso'))
    p.alertas.forEach((a) =>
      c.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: `${a.titulo}. `, bold: true, size: 22 }), new TextRun({ text: a.texto, size: 22 })] })),
    )
  }

  c.push(h2('8. Como saber se a explicação é confiável'))
  p.checagem.forEach((x) => c.push(item(x)))

  c.push(h2('9. Como relatar'))
  c.push(paragrafo(p.comoRelatar))

  c.push(h2('10. Referências'))
  c.push(...referencias(p.referencias))

  c.push(h2('11. O que você ainda pode informar'))
  c.push(...premissas(p.premissasAssumidas))

  c.push(h2('12. Explicação não é causalidade'))
  c.push(paragrafo('Estas técnicas mostram como o modelo usa os dados, não como o mundo funciona. Para afirmar efeitos causais, é preciso um desenho de estudo e uma análise próprios para isso.'))

  await baixarDocumento(documento(c), nomeArquivoComData('plano-xai'))
}

export async function baixarDocxDiagnostico(d: Diagnostico, dataFormatada: string): Promise<void> {
  const c: (Paragraph | Table)[] = []

  c.push(tituloDocumento('Diagnóstico de Explicação de Modelo'))
  c.push(subtitulo(`Gerado pelo XAI-Orientador em ${dataFormatada}, a partir do problema relatado.`))

  c.push(h2('1. O que foi relatado'))
  c.push(tabela(['Campo', 'Conteúdo'], [['Sintoma', d.sintoma], ['Modelo e técnica', d.relatoInformado ?? 'Não informado']], [35, 65]))

  c.push(h2('2. Causa provável'))
  c.push(paragrafo(d.causaProvavel))

  c.push(h2('3. O que fazer'))
  d.intervencoes.forEach((x, i) => c.push(item(x, i + 1)))

  c.push(h2('4. Por que isso acontece'))
  c.push(paragrafo(d.porQueSeAplica))

  c.push(h2('5. Como conferir se resolveu'))
  c.push(paragrafo(d.comoReavaliar))

  c.push(h2('6. Referências'))
  c.push(...referencias(d.referencias))

  c.push(h2('7. O que você ainda pode informar'))
  c.push(...premissas(d.premissasAssumidas))

  await baixarDocumento(documento(c), nomeArquivoComData('diagnostico-xai'))
}
