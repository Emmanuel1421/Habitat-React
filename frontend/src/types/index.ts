export type UserRole = 'master' | 'coordenador' | 'estagiario';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;export type UserRole = 'master' | 'coordenador' | 'estagiario';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
}

export type CaseStatus = 'triagem' | 'documentacao' | 'processo' | 'finalizado';
export type TipoAtendimento = 'judicial' | 'conciliacao';

export interface Morador {
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

export interface CaminhoJudicial {
  numeroProcesso: string;
  varaJudicial: string;
  dataEntrada: string;
  statusProcesso: string;
}

export interface Conciliacao {
  dadosOutraParte: string;
  dataAudiencia: string;
  local: string;
  resultado: string;
}

export interface Anotacao {
  id: string;
  texto: string;
  autor: string;
  data: string;
}

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
}

export interface TimelineEvent {
  id: string;
  descricao: string;
  data: string;
  autor: string;
  tipo: 'status' | 'anotacao' | 'documento' | 'criacao';
}

export interface Caso {
  id: string;
  morador: Morador;
  descricao: string;
  tipo: TipoAtendimento;
  status: CaseStatus;
  estagiarioId: string;
  coordenadorId: string;
  dataCriacao: string;
  dataAtualizacao: string;
  caminhoJudicial?: CaminhoJudicial;
  conciliacao?: Conciliacao;
  anotacoes: Anotacao[];
  documentos: Documento[];
  timeline: TimelineEvent[];
  /** Orientação jurídica (campo livre do Associate no backend) */
  legalGuidance?: string;
}

  ativo: boolean;export type UserRole = 'master' | 'coordenador' | 'estagiario';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
}

export type CaseStatus = 'triagem' | 'documentacao' | 'processo' | 'finalizado';
export type TipoAtendimento = 'judicial' | 'conciliacao';

export interface Morador {
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

export interface CaminhoJudicial {
  numeroProcesso: string;
  varaJudicial: string;
  dataEntrada: string;
  statusProcesso: string;
}

export interface Conciliacao {
  dadosOutraParte: string;
  dataAudiencia: string;
  local: string;
  resultado: string;
}

export interface Anotacao {
  id: string;
  texto: string;
  autor: string;
  data: string;
}

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
}

export interface TimelineEvent {
  id: string;
  descricao: string;
  data: string;
  autor: string;
  tipo: 'status' | 'anotacao' | 'documento' | 'criacao';
}

export interface Caso {
  id: string;
  morador: Morador;
  descricao: string;
  tipo: TipoAtendimento;
  status: CaseStatus;
  estagiarioId: string;
  coordenadorId: string;
  dataCriacao: string;
  dataAtualizacao: string;
  caminhoJudicial?: CaminhoJudicial;
  conciliacao?: Conciliacao;
  anotacoes: Anotacao[];
  documentos: Documento[];
  timeline: TimelineEvent[];
  /** Orientação jurídica (campo livre do Associate no backend) */
  legalGuidance?: string;
}

}

export type CaseStatus = 'triagem' | 'documentacao' | 'processo' | 'finalizado';
export type TipoAtendimento = 'judicial' | 'conciliacao';

export interface Morador {
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

export interface CaminhoJudicial {
  numeroProcesso: string;
  varaJudicial: string;
  dataEntrada: string;
  statusProcesso: string;
}

export interface Conciliacao {
  dadosOutraParte: string;
  dataAudiencia: string;
  local: string;
  resultado: string;
}

export interface Anotacao {
  id: string;
  texto: string;
  autor: string;
  data: string;
}

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
}

export interface TimelineEvent {
  id: string;
  descricao: string;
  data: string;
  autor: string;
  tipo: 'status' | 'anotacao' | 'documento' | 'criacao';
}

export interface Caso {
  id: string;
  morador: Morador;
  descricao: string;
  tipo: TipoAtendimento;
  status: CaseStatus;
  estagiarioId: string;
  coordenadorId: string;
  dataCriacao: string;
  dataAtualizacao: string;
  caminhoJudicial?: CaminhoJudicial;
  conciliacao?: Conciliacao;
  anotacoes: Anotacao[];
  documentos: Documento[];
  timeline: TimelineEvent[];
}
