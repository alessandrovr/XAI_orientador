// Motor determinístico do Fluxo A: das respostas ao plano de explicabilidade.
// Não importa nada de components/ ou pages/.

import { TECNICAS, type ChaveTecnica } from '../data/techniques'
import { resolverReferencias } from '../data/references'
import { PERGUNTAS_FLUXO_A, textoDaOpcao } from '../data/questions'
import type { Alerta, PlanoExplicabilidade, RespostasFluxoA, Tecnica } from './types'

/** A pergunta de correlação só faz sentido para dados tabulares, séries ou "outro". */
export function perguntaAtiva(id: keyof RespostasFluxoA, r: RespostasFluxoA): boolean {
  if (id === 'correlacao') return r.dado !== 'B' && r.dado !== 'C'
  return true
}

function escolherTecnicas(r: RespostasFluxoA): ChaveTecnica[] {
  const m = r.modelo ?? 'F'
  const t = r.tarefa ?? 'A'
  const d = r.dado ?? 'A'
  const e = r.escopo ?? 'E'
  const p = r.publico ?? 'A'
  const rest = r.restricao ?? 'D'
  const correlacionado = r.correlacao !== 'B' // "não sei" é tratado de forma conservadora

  let lista: ChaveTecnica[]

  if (t === 'C') {
    lista = ['clusterSurrogate', 'clusterPerfil', e === 'C' ? 'shapTree' : 'perm']
  } else if (d === 'C') {
    if (m !== 'D') lista = ['oclusao', 'lime', 'anchors']
    else if (e === 'A') lista = ['tcav', 'gradcam', 'oclusao']
    else if (e === 'D') lista = ['oclusao', 'gradcam', 'ig']
    else lista = ['gradcam', 'ig', 'oclusao']
  } else if (d === 'B') {
    if (m === 'A' || m === 'B') lista = ['bowCoef', 'lime', e === 'D' ? 'cf' : 'anchors']
    else if (e === 'A') lista = ['textoAtrib', 'surrogate', 'lime']
    else if (e === 'D') lista = ['anchors', 'textoAtrib', 'lime']
    else lista = ['textoAtrib', 'lime', 'anchors']
  } else {
    const querIntrinseco = m === 'F' && (rest === 'A' || p === 'B' || p === 'C')
    if (m === 'A') {
      lista = ({
        A: ['coef', 'perm'],
        B: ['coef', 'gam'],
        C: ['contribLinear', 'coef'],
        D: ['cf', 'contribLinear'],
        E: ['coef', 'contribLinear', 'perm'],
      } as Record<string, ChaveTecnica[]>)[e]
    } else if (m === 'B') {
      lista = ({
        A: ['regras', 'perm'],
        B: ['regras', 'pdp'],
        C: ['regras', 'shapTree'],
        D: ['regras', 'cf'],
        E: ['regras', 'perm', 'shapTree'],
      } as Record<string, ChaveTecnica[]>)[e]
    } else if (querIntrinseco) {
      lista = ['gam', 'regras', e === 'D' ? 'cf' : 'perm']
    } else {
      const shap: ChaveTecnica = m === 'C' || m === 'F' ? 'shapTree' : m === 'D' ? 'shapDeep' : 'shapKernel'
      const efeito: ChaveTecnica = correlacionado ? 'ale' : 'pdp'
      const efeitoAlt: ChaveTecnica = correlacionado ? 'pdp' : 'ale'
      const importancia: ChaveTecnica = correlacionado ? 'permCond' : 'perm'
      const caro = rest === 'B' && shap === 'shapKernel'
      lista = ({
        A: caro ? [importancia, 'surrogate', shap] : [shap, importancia, 'surrogate'],
        B: [efeito, efeitoAlt, shap],
        C: caro ? ['lime', 'anchors', shap] : [shap, 'lime', 'anchors'],
        D: ['cf', 'anchors', shap],
        E: caro ? [importancia, efeito, 'lime'] : [shap, efeito, importancia],
      } as Record<string, ChaveTecnica[]>)[e]
    }
  }

  lista = [...lista]
  if (p === 'C' && d !== 'C' && !lista.includes('cf')) lista.push('cf')
  if ((rest === 'A' || rest === 'C') && !lista.includes('equidade')) lista.push('equidade')
  return [...new Set(lista)].slice(0, 5)
}

function descreverFamilia(t: Tecnica): string {
  if (t.tipo === 'intrinseca') return 'Interpretabilidade intrínseca — o próprio modelo é a explicação'
  const escopo = {
    global: 'global (comportamento geral)',
    local: 'local (caso a caso)',
    efeito: 'de efeito (forma da relação)',
    contrafactual: 'contrafactual (o que mudaria o resultado)',
    'global e local': 'global e local',
    auditoria: 'de auditoria',
  }[t.escopo]
  return `Explicação pós-hoc ${escopo}, ${t.agnostica ? 'agnóstica ao modelo' : 'específica para este tipo de modelo'}`
}

function justificar(r: RespostasFluxoA, principal: ChaveTecnica): string {
  const partes: string[] = []
  const base: Partial<Record<ChaveTecnica, string>> = {
    coef: 'Seu modelo já é interpretável: os coeficientes (ou efeitos marginais) respondem diretamente à pergunta, sem precisar de uma camada de explicação aproximada por cima.',
    contribLinear: 'Em um modelo linear, a explicação de um caso é exata: basta multiplicar cada coeficiente pelo desvio do valor em relação à média.',
    cf: 'Sua pergunta é sobre o que mudaria o resultado — exatamente o que as explicações contrafactuais respondem, em linguagem que não exige conhecer o modelo.',
    regras: 'Uma árvore única é lida diretamente: as regras são a explicação. Técnicas pós-hoc só complementam.',
    gam: 'Como o modelo ainda não foi escolhido e a explicação precisa ser clara ou defensável, vale começar por um modelo interpretável por design. Se ele tiver acurácia próxima à de uma caixa-preta, não há motivo para aceitar a opacidade.',
    shapTree: 'Para ensembles de árvores, o TreeSHAP calcula valores exatos e rápidos, e a mesma análise serve para explicar casos individuais e o modelo como um todo.',
    shapDeep: 'Para redes neurais, variantes do SHAP baseadas em gradiente são muito mais rápidas que a versão agnóstica e mantêm a mesma leitura (contribuição por variável).',
    shapKernel: 'Seu modelo não tem uma versão específica do SHAP, então a versão agnóstica é o caminho mais completo para atribuições por caso e globais.',
    ale: 'Você quer a forma da relação e há (ou pode haver) variáveis correlacionadas. O ALE evita a extrapolação que distorce o PDP nesse cenário.',
    pdp: 'Você quer a forma da relação e as variáveis são pouco correlacionadas, então o PDP com curvas ICE é a leitura mais intuitiva e ainda mostra se o efeito varia entre casos.',
    permCond: 'Com restrição computacional e variáveis correlacionadas, a permutação agrupada é barata e evita atribuir importância a combinações irreais.',
    perm: 'Com restrição computacional, a importância por permutação é barata, agnóstica e fácil de comunicar.',
    lime: 'Com pouco poder computacional, o LIME explica casos individuais a baixo custo — desde que você teste a estabilidade.',
    clusterSurrogate: 'Clustering não tem alvo para explicar. O caminho usual é tratar o rótulo do cluster como alvo de um modelo legível e ver quais variáveis separam os grupos.',
    gradcam: 'Para redes convolucionais, o Grad-CAM é o ponto de partida mais usado para ver onde o modelo "olha" em cada imagem.',
    tcav: 'Para uma visão geral de redes de imagem, mapas de pixel não bastam; o TCAV testa se conceitos humanos pesam em uma classe.',
    oclusao: 'A oclusão funciona com qualquer modelo de imagem e responde diretamente o que acontece quando uma região some.',
    textoAtrib: 'Para modelos de linguagem, a atribuição por token mostra quais palavras sustentaram cada previsão.',
    anchors: 'Para saber o que sustenta uma decisão em texto, regras do tipo "se estas palavras estão presentes, a classe se mantém" são diretas e comunicáveis.',
    bowCoef: 'Com um modelo linear ou árvore sobre termos, os pesos já são a explicação.',
  }
  partes.push(base[principal] ?? 'A técnica principal foi escolhida por responder diretamente à sua pergunta para este tipo de modelo e dado.')

  if (r.correlacao === 'A' && (r.dado === 'A' || r.dado === 'D'))
    partes.push('Como há variáveis fortemente correlacionadas, o plano prefere técnicas que não extrapolam para combinações inexistentes e recomenda interpretar blocos de variáveis juntos.')
  if (r.publico === 'B' || r.publico === 'C')
    partes.push('Como o público não é técnico, a técnica principal deve ser traduzida em poucos fatores e exemplos concretos.')
  if (r.restricao === 'A')
    partes.push('Por ser um uso de alto risco, prefira modelos interpretáveis sempre que a perda de desempenho for pequena, e registre a explicação para permitir revisão humana.')
  if (r.restricao === 'C')
    partes.push('A auditoria de equidade entra no plano porque explicações, por si só, não detectam tratamento desigual entre grupos.')
  return partes.join(' ')
}

function montarRoteiro(r: RespostasFluxoA, tecnicas: Tecnica[]): string[] {
  const [principal, ...outras] = tecnicas.filter((t) => t.escopo !== 'auditoria')
  const auditoria = tecnicas.find((t) => t.escopo === 'auditoria')
  const passos: string[] = []

  if (r.tarefa === 'C') {
    passos.push('Verifique a qualidade e a estabilidade dos clusters (ex.: silhueta, reamostragem) antes de tentar interpretá-los.')
  } else {
    passos.push('Confirme o desempenho do modelo no conjunto de teste. Explicar um modelo ruim é explicar ruído.')
  }

  if (r.dado === 'C') passos.push('Separe imagens representativas de cada classe, incluindo acertos e erros do modelo.')
  else if (r.dado === 'B') passos.push('Separe textos representativos de cada classe, incluindo acertos, erros e casos de fronteira.')
  else passos.push('Audite as variáveis: procure identificadores, datas ou informações do futuro (vazamento) e verifique as correlações entre preditores.')

  passos.push(`Aplique ${principal.nome}${principal.tipo === 'pos-hoc' ? ' no conjunto de teste ou nos casos selecionados' : ''}.`)
  if (outras.length > 0)
    passos.push(`Confirme com ${outras.map((t) => t.nome).join(' e ')}. Métodos diferentes que concordam aumentam a confiança; se discordarem, investigue antes de relatar.`)
  if (auditoria) passos.push('Rode a auditoria de equidade, comparando métricas de erro e de decisão entre os grupos.')
  passos.push('Teste a estabilidade: repita com outras sementes ou reamostragens (bootstrap) e veja se as conclusões se mantêm.')

  const traducao = {
    A: 'Prepare os gráficos com incerteza e descreva método, pacote, versão e parâmetros.',
    B: 'Traduza o resultado para 3 a 5 fatores, na linguagem do domínio e na escala do desfecho (ex.: probabilidade).',
    C: 'Transforme a explicação em uma mensagem curta e acionável, indicando também como pedir revisão humana.',
    D: 'Compare as explicações de acertos e erros para encontrar atalhos e vazamentos; corrija e treine de novo.',
  }[r.publico ?? 'A']
  passos.push(traducao)
  passos.push('Relate as limitações: a explicação descreve o que o modelo faz, não relações causais no mundo.')
  return passos
}

function montarChecagem(r: RespostasFluxoA, chaves: ChaveTecnica[]): string[] {
  const itens = [
    'Estabilidade: a ordem das variáveis mais importantes se mantém em diferentes sementes e reamostragens?',
    'Concordância: pelo menos dois métodos apontam na mesma direção? Discordâncias são comuns e devem ser relatadas, não escondidas.',
    'Teste de aleatorização: treine com o alvo embaralhado (ou pesos aleatórios, em redes). Se a explicação continuar "fazendo sentido", ela não reflete o que o modelo aprendeu.',
  ]
  if (chaves.some((c) => c === 'surrogate' || c === 'clusterSurrogate' || c === 'lime'))
    itens.push('Fidelidade: relate quanto o modelo substituto (global ou local) reproduz as previsões do modelo original.')
  if (r.dado === 'C') itens.push('Sanity check de saliência: com os pesos da rede aleatorizados, o mapa deve mudar visivelmente.')
  itens.push('Plausibilidade: mostre a especialistas do domínio. Não é prova, mas ajuda a detectar vazamentos e atalhos.')
  return itens
}

function montarAlertas(r: RespostasFluxoA): Alerta[] {
  const alertas: Alerta[] = []
  const tabularOuSerie = r.dado === 'A' || r.dado === 'D' || r.dado === 'E' || r.dado === undefined
  if (tabularOuSerie && r.correlacao !== 'B' && r.tarefa !== 'C')
    alertas.push({
      titulo: 'Variáveis correlacionadas',
      texto: 'PDP, permutação simples e KernelSHAP criam casos artificiais combinando valores que não coexistem nos dados. Prefira ALE e importância agrupada, e interprete blocos de variáveis (ex.: itens de um mesmo fator) em conjunto.',
    })
  if ((r.modelo === 'C' || r.modelo === 'F') && tabularOuSerie)
    alertas.push({
      titulo: 'Evite a importância por impureza como resultado principal',
      texto: 'O feature_importances_ padrão de Random Forest e boosting (MDI) favorece variáveis contínuas e com muitas categorias. Use SHAP ou permutação no lugar.',
    })
  if (r.dado === 'D')
    alertas.push({
      titulo: 'Séries temporais',
      texto: 'Defasagens de uma mesma variável são muito correlacionadas: some as atribuições por variável original e respeite a ordem temporal ao escolher os casos explicados.',
    })
  if (r.dado === 'B' && r.modelo === 'D')
    alertas.push({ titulo: 'Atenção não é explicação', texto: 'Pesos de atenção de transformers não indicam, por si só, quais palavras determinaram a previsão.' })
  if (r.dado === 'C')
    alertas.push({ titulo: 'Mapas de saliência enganam', texto: 'Alguns métodos produzem mapas convincentes mesmo com a rede aleatorizada. Sempre rode os sanity checks.' })
  if (r.restricao === 'A')
    alertas.push({
      titulo: 'Alto risco e LGPD',
      texto: 'O art. 20 da LGPD garante ao titular o direito de pedir revisão de decisões tomadas unicamente com base em tratamento automatizado e de receber informações claras sobre os critérios usados. Planeje explicações que possam ser entregues a essa pessoa.',
    })
  if (r.restricao === 'B')
    alertas.push({
      titulo: 'Pouco poder computacional',
      texto: 'Explique uma amostra de casos (algumas centenas bastam para visões globais) e resuma o background do SHAP (ex.: k-means com poucos centros).',
    })
  if (r.publico === 'B')
    alertas.push({
      titulo: 'Público não técnico',
      texto: 'Pessoas preferem explicações contrastivas ("por que A e não B?") com poucas causas. Evite gráficos com valores SHAP sem legenda na escala do desfecho.',
    })
  if (r.publico === 'C')
    alertas.push({
      titulo: 'Pessoa afetada',
      texto: 'Mostre apenas mudanças que a pessoa pode realmente fazer. Contrafactuais com variáveis imutáveis (idade, histórico) não ajudam e podem ser discriminatórios.',
    })
  return alertas
}

function comoRelatar(r: RespostasFluxoA): string {
  return {
    A: 'Descreva a técnica, o pacote e a versão, o conjunto em que foi aplicada (preferencialmente teste) e o background usado. Apresente um resumo global e os efeitos das principais variáveis, com incerteza por reamostragem. Deixe explícito que atribuições não são efeitos causais.',
    B: 'Use poucas variáveis (3 a 5), gráficos simples com rótulos na linguagem do domínio, frases como "quando X aumenta, o risco previsto sobe" e dois ou três casos reais como exemplo.',
    C: 'Entregue uma explicação curta, contrastiva e acionável ("o resultado seria diferente se…"), sem jargão, com o caminho para solicitar revisão humana.',
    D: 'Priorize casos errados e de fronteira. Registre o que cada explicação revelou e o que foi corrigido no modelo ou nos dados.',
  }[r.publico ?? 'A']
}

function premissas(r: RespostasFluxoA) {
  const lista: { campo: string; comoRefinar: string }[] = []
  if (r.modelo === 'F' || !r.modelo)
    lista.push({
      campo: 'Modelo ainda não escolhido; para dados tabulares, assumimos um ensemble de árvores (caso mais comum) ou um modelo interpretável, conforme o risco e o público.',
      comoRefinar: 'Informe o algoritmo final. Se for uma rede neural ou SVM, as técnicas específicas mudam.',
    })
  if (r.escopo === 'E' || !r.escopo)
    lista.push({
      campo: 'Pergunta de explicação indefinida; o plano combina visão global, efeitos e explicação local.',
      comoRefinar: 'Escreva a pergunta concreta (ex.: "por que o participante 12 foi classificado como alto risco?").',
    })
  if (r.correlacao === 'C' && perguntaAtiva('correlacao', r))
    lista.push({
      campo: 'Assumimos que pode haver preditores correlacionados (cenário conservador).',
      comoRefinar: 'Calcule a matriz de correlação ou o VIF. Se as correlações forem fracas, PDP e permutação simples passam a ser adequados.',
    })
  if (r.dado === 'E')
    lista.push({
      campo: 'Tipo de dado sem regra específica; tratamos como tabular.',
      comoRefinar: 'Descreva o formato (áudio, grafo, multimodal). Técnicas agnósticas como oclusão e KernelSHAP costumam se aplicar.',
    })
  return lista
}

function confianca(r: RespostasFluxoA): PlanoExplicabilidade['nivelConfianca'] {
  if (r.dado === 'E' || (r.modelo === 'F' && r.escopo === 'E')) return 'baixo'
  if (r.modelo === 'F' || r.escopo === 'E' || r.tarefa === 'C' || (r.correlacao === 'C' && perguntaAtiva('correlacao', r))) return 'moderado'
  return 'alto'
}

export function gerarPlano(r: RespostasFluxoA): PlanoExplicabilidade {
  const chaves = escolherTecnicas(r)
  const tecnicas = chaves.map((c) => TECNICAS[c])
  const principal = tecnicas[0]
  const contexto = PERGUNTAS_FLUXO_A.filter((p) => perguntaAtiva(p.id, r)).map((p) => ({
    campo: p.rotuloRelatorio,
    valor: textoDaOpcao(p.id, r[p.id]) ?? 'Não informado',
  }))

  return {
    tecnicaPrincipal: principal.nome,
    familia: descreverFamilia(principal),
    nivelConfianca: confianca(r),
    contexto,
    tecnicas,
    justificativa: justificar(r, chaves[0]),
    roteiro: montarRoteiro(r, tecnicas),
    checagem: montarChecagem(r, chaves),
    comoRelatar: comoRelatar(r),
    alertas: montarAlertas(r),
    referencias: resolverReferencias([
      ...tecnicas.flatMap((t) => t.refs),
      ...(r.restricao === 'A' ? ['rudin2019', 'lgpd2018'] : []),
      ...(r.publico === 'B' || r.publico === 'C' ? ['miller2019'] : []),
      ...(r.correlacao !== 'B' && r.dado !== 'B' && r.dado !== 'C' ? ['hooker2021', 'apley2020'] : []),
      ...((r.modelo === 'C' || r.modelo === 'F') && r.dado !== 'B' && r.dado !== 'C' ? ['strobl2007'] : []),
      'krishna2022',
      'molnar2022',
    ]),
    premissasAssumidas: premissas(r),
  }
}
