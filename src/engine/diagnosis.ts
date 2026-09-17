// Motor determinístico do Fluxo B: do sintoma observado na explicação ao
// diagnóstico e às intervenções.

import { PERGUNTA_B2 } from '../data/questions'
import { resolverReferencias } from '../data/references'
import type { Diagnostico, RespostasFluxoB, SintomaFluxoB } from './types'

interface Regra {
  causa: string
  intervencoes: string[]
  porque: string
  reavaliar: string
  refs: string[]
}

const REGRAS: Record<SintomaFluxoB, Regra> = {
  A: {
    causa: 'Instabilidade do modelo ou da explicação. As causas mais comuns são variáveis correlacionadas e o "efeito Rashomon": vários modelos igualmente bons que usam lógicas diferentes.',
    intervencoes: [
      'Repita a explicação com várias sementes ou reamostragens e relate a média e a variação, não uma única rodada.',
      'Agrupe variáveis correlacionadas e interprete o bloco, não cada variável isolada.',
      'Troque para importância por permutação agrupada/condicional ou ALE.',
      'Aumente as repetições (n_repeats) e o tamanho do background.',
    ],
    porque: 'Quando duas variáveis carregam a mesma informação, o modelo pode usar uma ou outra a cada treino, e a explicação acompanha essa troca.',
    reavaliar: 'Compare o ranking das variáveis entre rodadas (ex.: correlação de Spearman entre rankings). Conclusões só devem se apoiar no que se mantém estável.',
    refs: ['fisher2019', 'strobl2008', 'alvarez2018'],
  },
  B: {
    causa: 'Vazamento de dados (data leakage) ou atalho: a variável carrega informação do alvo que não estaria disponível no uso real — ex.: identificador, data de coleta, variável registrada depois do desfecho.',
    intervencoes: [
      'Descubra quando e como a variável é coletada em relação ao desfecho.',
      'Remova a variável, treine de novo e compare o desempenho: uma queda grande confirma a dependência.',
      'Procure casos duplicados ou do mesmo indivíduo em treino e teste; se houver, divida por grupo ou por tempo.',
    ],
    porque: 'Modelos exploram qualquer regularidade que preveja o alvo, inclusive as espúrias. A explicação está funcionando: ela revelou o problema.',
    reavaliar: 'Depois de corrigir, o desempenho em teste costuma cair; o novo valor é a estimativa honesta. Refaça a explicação e confira se a variável suspeita sumiu do topo.',
    refs: ['kaufman2012', 'lapuschkin2019'],
  },
  C: {
    causa: 'Os métodos respondem perguntas diferentes: SHAP e LIME explicam a previsão; a permutação mede impacto no desempenho. Eles também fazem suposições diferentes sobre como simular "ausência" de uma variável.',
    intervencoes: [
      'Defina qual pergunta você quer responder e escolha o método que responde a ela.',
      'Compare os métodos no mesmo conjunto de casos e pela ordem (ranking), não pelos valores absolutos.',
      'Use o mesmo conjunto de referência (background) em todos os métodos que o exigem.',
      'Relate a discordância em vez de escolher o método mais conveniente.',
    ],
    porque: 'Discordância entre métodos de explicação é frequente e documentada; ela indica que a conclusão depende da técnica e merece cautela.',
    reavaliar: 'Meça a concordância entre os métodos para as principais variáveis (ex.: sobreposição do top-5). Conclusões fortes só para o que todos apontam.',
    refs: ['krishna2022', 'lundberg2017', 'ribeiro2016'],
  },
  D: {
    causa: 'O LIME sorteia vizinhos aleatórios a cada rodada, e a largura da vizinhança é uma escolha arbitrária.',
    intervencoes: [
      'Fixe a semente e aumente o número de amostras (num_samples).',
      'Teste diferentes larguras de kernel e veja se a explicação muda.',
      'Meça a estabilidade com índices próprios para o LIME.',
      'Para modelos de árvore, prefira o TreeSHAP, que é determinístico.',
    ],
    porque: 'Com poucas amostras, a regressão local do LIME é ajustada sobre pontos diferentes a cada rodada e produz coeficientes diferentes.',
    reavaliar: 'Rode o mesmo caso 20 a 50 vezes e verifique se as principais variáveis e seus sinais se repetem.',
    refs: ['visani2022', 'alvarez2018', 'ribeiro2016'],
  },
  E: {
    causa: 'Duas possibilidades: o modelo aprendeu um atalho (efeito "Clever Hans" — marcas d’água, réguas, fundo típico de uma classe) ou o método de saliência não é fiel ao modelo.',
    intervencoes: [
      'Rode os sanity checks: aleatorize os pesos da rede e confirme que o mapa muda.',
      'Compare Grad-CAM, Integrated Gradients e oclusão nas mesmas imagens.',
      'Teste o modelo com o fundo trocado, recortado ou mascarado.',
      'Revise a coleta: as classes foram fotografadas em condições diferentes?',
    ],
    porque: 'Se o mapa sobrevive aos sanity checks e vários métodos concordam, o problema está no modelo (atalho), não na explicação.',
    reavaliar: 'Após corrigir os dados (ou aumentar a variedade de fundos), a acurácia em imagens com fundo alterado deve ficar próxima da original.',
    refs: ['adebayo2018', 'lapuschkin2019', 'selvaraju2017'],
  },
  F: {
    causa: 'A informação da variável continua disponível por meio de outras correlacionadas, ou a variável realmente contribui pouco para a previsão. Valores negativos pequenos indicam apenas ruído.',
    intervencoes: [
      'Use permutação agrupada ou condicional com as variáveis correlacionadas.',
      'Faça drop-column: treine sem a variável e compare o desempenho.',
      'Aumente as repetições e relate a dispersão da importância.',
      'Lembre que importância preditiva não é relevância teórica ou causal.',
    ],
    porque: 'Ao embaralhar uma variável, o modelo compensa com as "irmãs" correlacionadas, e a perda de desempenho fica pequena.',
    reavaliar: 'Compare a importância do grupo inteiro com a da variável isolada; se o grupo for importante, a informação está lá.',
    refs: ['strobl2008', 'hooker2021', 'fisher2019'],
  },
  G: {
    causa: 'A explicação está técnica demais para o público: muitas variáveis, escalas abstratas (log-odds, valores SHAP) ou falta de comparação.',
    intervencoes: [
      'Reduza a 3 a 5 fatores principais.',
      'Converta para a escala do desfecho (ex.: pontos percentuais de probabilidade).',
      'Use exemplos reais e explicações contrafactuais ("se X fosse Y, o resultado mudaria").',
      'Teste a compreensão com algumas pessoas do público antes de divulgar.',
    ],
    porque: 'Pessoas entendem melhor explicações contrastivas e seletivas; mais detalhe nem sempre aumenta a compreensão.',
    reavaliar: 'Peça a pessoas do público que prevejam o que o modelo faria em um caso novo, usando só a explicação. Acertos indicam que ela funcionou.',
    refs: ['miller2019', 'poursabzi2021', 'wachter2018'],
  },
  H: {
    causa: 'Explicações pós-hoc podem ocultar a dependência de atributos sensíveis, que chegam ao modelo por variáveis substitutas (proxies), como CEP ou escola.',
    intervencoes: [
      'Faça uma auditoria de equidade: compare taxas de erro e de decisão entre grupos.',
      'Verifique quais variáveis se associam fortemente ao atributo sensível.',
      'Não use a ausência do atributo na explicação como prova de ausência de viés.',
    ],
    porque: 'Já foi demonstrado que é possível construir modelos discriminatórios cujas explicações LIME e SHAP parecem neutras.',
    reavaliar: 'Relate métricas por grupo com intervalos de confiança; diferenças relevantes exigem ação no modelo ou nos dados, não só na explicação.',
    refs: ['slack2020', 'bird2020'],
  },
  I: {
    causa: 'Sintoma não mapeado diretamente. Use a lista abaixo para localizar a origem.',
    intervencoes: [
      'Confirme que o modelo generaliza (métricas em teste) antes de interpretar a explicação.',
      'Procure vazamento de dados e variáveis correlacionadas.',
      'Repita a explicação com outras sementes e com um segundo método.',
      'Aplique um teste de aleatorização (alvo embaralhado).',
    ],
    porque: 'A maioria dos problemas de explicação vem de um destes pontos: modelo ruim, dados com vazamento, correlação entre preditores ou instabilidade do método.',
    reavaliar: 'Descreva o sintoma com números (antes e depois) e refaça o diagnóstico.',
    refs: ['molnar2022', 'krishna2022'],
  },
}

export function gerarDiagnostico(r: RespostasFluxoB): Diagnostico {
  const s = r.perguntaB2 ?? 'I'
  const regra = REGRAS[s]
  const textoSintoma = s === 'I' ? r.perguntaB2Outro?.trim() || 'Outro (não descrito)' : PERGUNTA_B2.opcoes.find((o) => o.letra === s)!.texto
  const relato = r.perguntaB1?.trim()

  const premissas: Diagnostico['premissasAssumidas'] = []
  if (!relato)
    premissas.push({
      campo: 'Modelo, método de explicação e dados não informados; o diagnóstico é genérico para o sintoma.',
      comoRefinar: 'Informe algoritmo, técnica (ex.: TreeSHAP), pacote e versão, conjunto usado e os números observados.',
    })
  if (s === 'I')
    premissas.push({
      campo: 'Sintoma fora da lista.',
      comoRefinar: 'Descreva o que esperava ver e o que viu, com um exemplo concreto.',
    })

  return {
    sintoma: textoSintoma,
    relatoInformado: relato || undefined,
    causaProvavel: regra.causa,
    intervencoes: regra.intervencoes,
    porQueSeAplica: regra.porque,
    comoReavaliar: regra.reavaliar,
    referencias: resolverReferencias(regra.refs),
    premissasAssumidas: premissas,
  }
}
