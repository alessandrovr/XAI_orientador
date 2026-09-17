// Tipos centrais do motor de orientação em interpretabilidade/explicabilidade.

export type Modelo = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type Tarefa = 'A' | 'B' | 'C'
export type TipoDado = 'A' | 'B' | 'C' | 'D' | 'E'
export type Escopo = 'A' | 'B' | 'C' | 'D' | 'E'
export type Publico = 'A' | 'B' | 'C' | 'D'
export type Correlacao = 'A' | 'B' | 'C'
export type Restricao = 'A' | 'B' | 'C' | 'D'

export interface RespostasFluxoA {
  modelo?: Modelo
  tarefa?: Tarefa
  dado?: TipoDado
  escopo?: Escopo
  publico?: Publico
  correlacao?: Correlacao
  restricao?: Restricao
}

export type SintomaFluxoB = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'

export interface RespostasFluxoB {
  perguntaB1?: string
  perguntaB2?: SintomaFluxoB
  perguntaB2Outro?: string
}

export interface Referencia {
  autores: string
  ano: string
  titulo: string
  veiculo: string
}

export type TipoTecnica = 'intrinseca' | 'pos-hoc'
export type EscopoTecnica = 'global' | 'local' | 'efeito' | 'contrafactual' | 'global e local' | 'auditoria'

export interface Tecnica {
  nome: string
  tipo: TipoTecnica
  escopo: EscopoTecnica
  agnostica: boolean
  responde: string
  cuidado: string
  python: string
  r: string
  refs: string[]
}

export interface ItemRotulado {
  campo: string
  valor: string
}

export interface Alerta {
  titulo: string
  texto: string
}

export interface PlanoExplicabilidade {
  tecnicaPrincipal: string
  familia: string
  nivelConfianca: 'alto' | 'moderado' | 'baixo'
  contexto: ItemRotulado[]
  tecnicas: Tecnica[] // primeira = principal
  justificativa: string
  roteiro: string[]
  checagem: string[]
  comoRelatar: string
  alertas: Alerta[]
  referencias: Referencia[]
  premissasAssumidas: { campo: string; comoRefinar: string }[]
}

export interface Diagnostico {
  sintoma: string
  relatoInformado?: string
  causaProvavel: string
  intervencoes: string[]
  porQueSeAplica: string
  comoReavaliar: string
  referencias: Referencia[]
  premissasAssumidas: { campo: string; comoRefinar: string }[]
}
