// Perguntas dos Fluxos A e B, mantidas como dados de configuração.

import type { RespostasFluxoA } from '../engine/types'

export interface Opcao {
  letra: string
  texto: string
  dica?: string
  temTextoLivre?: boolean
}

export interface Pergunta {
  id: keyof RespostasFluxoA
  trilhaLabel: string
  rotuloRelatorio: string
  texto: string
  ajuda?: string
  opcoes: Opcao[]
}

export const PERGUNTAS_FLUXO_A: Pergunta[] = [
  {
    id: 'modelo',
    trilhaLabel: 'Modelo',
    rotuloRelatorio: 'Modelo utilizado',
    texto: 'Que tipo de modelo você treinou (ou pretende treinar)?',
    ajuda: 'Se usou mais de um, escolha o que vai para o artigo ou para uso real.',
    opcoes: [
      { letra: 'A', texto: 'Regressão linear, logística ou GAM', dica: 'modelos em que os coeficientes já têm significado' },
      { letra: 'B', texto: 'Uma única árvore de decisão' },
      { letra: 'C', texto: 'Ensemble de árvores', dica: 'Random Forest, XGBoost, LightGBM, CatBoost' },
      { letra: 'D', texto: 'Rede neural / deep learning' },
      { letra: 'E', texto: 'Outro modelo de caixa-preta', dica: 'SVM, kNN, stacking…' },
      { letra: 'F', texto: 'Ainda não escolhi o modelo' },
    ],
  },
  {
    id: 'tarefa',
    trilhaLabel: 'Tarefa',
    rotuloRelatorio: 'Tarefa',
    texto: 'O que o modelo faz?',
    opcoes: [
      { letra: 'A', texto: 'Classifica casos em categorias' },
      { letra: 'B', texto: 'Prevê um valor numérico' },
      { letra: 'C', texto: 'Agrupa casos sem um alvo (clustering)' },
    ],
  },
  {
    id: 'dado',
    trilhaLabel: 'Dados',
    rotuloRelatorio: 'Tipo de dado',
    texto: 'Com que tipo de dado ele trabalha?',
    opcoes: [
      { letra: 'A', texto: 'Tabular (planilha, questionário, banco de dados)' },
      { letra: 'B', texto: 'Texto' },
      { letra: 'C', texto: 'Imagem' },
      { letra: 'D', texto: 'Série temporal' },
      { letra: 'E', texto: 'Outro (áudio, grafo, multimodal…)' },
    ],
  },
  {
    id: 'escopo',
    trilhaLabel: 'Pergunta',
    rotuloRelatorio: 'Pergunta que a explicação deve responder',
    texto: 'Qual pergunta você quer que a explicação responda?',
    opcoes: [
      { letra: 'A', texto: 'Quais variáveis mais importam, no geral?' },
      { letra: 'B', texto: 'Como uma variável altera a previsão (a forma da relação)?' },
      { letra: 'C', texto: 'Por que o modelo decidiu isso para um caso específico?' },
      { letra: 'D', texto: 'O que precisaria mudar para o resultado ser outro?' },
      { letra: 'E', texto: 'Ainda não sei / preciso de um pouco de tudo' },
    ],
  },
  {
    id: 'publico',
    trilhaLabel: 'Público',
    rotuloRelatorio: 'Público da explicação',
    texto: 'Para quem é a explicação?',
    opcoes: [
      { letra: 'A', texto: 'Pesquisadores (artigo, dissertação, banca)' },
      { letra: 'B', texto: 'Profissionais não técnicos (gestores, clínicos, professores)' },
      { letra: 'C', texto: 'A pessoa afetada pela decisão do modelo' },
      { letra: 'D', texto: 'Eu mesmo, para depurar o modelo' },
    ],
  },
  {
    id: 'correlacao',
    trilhaLabel: 'Correlação',
    rotuloRelatorio: 'Correlação entre preditores',
    texto: 'As variáveis de entrada são correlacionadas entre si?',
    ajuda: 'Ex.: itens de uma mesma escala, peso e IMC, defasagens de uma série.',
    opcoes: [
      { letra: 'A', texto: 'Sim, várias são fortemente correlacionadas' },
      { letra: 'B', texto: 'Não, são razoavelmente independentes' },
      { letra: 'C', texto: 'Não sei' },
    ],
  },
  {
    id: 'restricao',
    trilhaLabel: 'Restrição',
    rotuloRelatorio: 'Restrição principal',
    texto: 'Existe alguma restrição importante?',
    opcoes: [
      { letra: 'A', texto: 'Uso de alto risco ou regulado', dica: 'saúde, crédito, seleção de pessoas, LGPD' },
      { letra: 'B', texto: 'Pouco tempo ou poder computacional' },
      { letra: 'C', texto: 'Preciso verificar vieses entre grupos' },
      { letra: 'D', texto: 'Nenhuma restrição relevante' },
    ],
  },
]

export const PERGUNTA_B2 = {
  texto: 'O que está estranho na sua explicação?',
  opcoes: [
    { letra: 'A', texto: 'A importância das variáveis muda muito entre execuções' },
    { letra: 'B', texto: 'Uma variável sem sentido aparece como a mais importante' },
    { letra: 'C', texto: 'Métodos diferentes (SHAP, LIME, permutação) discordam' },
    { letra: 'D', texto: 'O LIME dá uma explicação diferente a cada rodada' },
    { letra: 'E', texto: 'O mapa de saliência destaca fundo ou bordas da imagem' },
    { letra: 'F', texto: 'Uma variável que sei ser relevante aparece com importância baixa ou negativa' },
    { letra: 'G', texto: 'O público não entende a explicação' },
    { letra: 'H', texto: 'A explicação parece boa, mas desconfio de viés escondido' },
    { letra: 'I', texto: 'Outro', temTextoLivre: true },
  ] satisfies Opcao[],
}

export function textoDaOpcao(perguntaId: keyof RespostasFluxoA, letra: string | undefined): string | undefined {
  const pergunta = PERGUNTAS_FLUXO_A.find((p) => p.id === perguntaId)
  return pergunta?.opcoes.find((o) => o.letra === letra)?.texto
}
