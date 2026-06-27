import { User, Caso } from '@/types';

export const mockUsers: User[] = [
  { id: '1', nome: 'Carlos Mendes', email: 'carlos@habitat.org', role: 'master', ativo: true },
  { id: '2', nome: 'Ana Silva', email: 'ana@habitat.org', role: 'coordenador', ativo: true },
  { id: '3', nome: 'Pedro Santos', email: 'pedro@habitat.org', role: 'coordenador', ativo: true },
  { id: '4', nome: 'Mariana Costa', email: 'mariana@habitat.org', role: 'estagiario', ativo: true },
  { id: '5', nome: 'Lucas Oliveira', email: 'lucas@habitat.org', role: 'estagiario', ativo: true },
  { id: '6', nome: 'Beatriz Ferreira', email: 'beatriz@habitat.org', role: 'estagiario', ativo: true },
];

export const mockCasos: Caso[] = [
  {
    id: 'c1',
    morador: { nome: 'Maria da Conceição', cpf: '123.456.789-00', telefone: '(11) 98765-4321', endereco: 'Rua das Flores, 123 - Cidade Alta' },
    descricao: 'Disputa de posse de imóvel em área de regularização fundiária.',
    tipo: 'judicial',
    status: 'processo',
    estagiarioId: '4',
    coordenadorId: '2',
    dataCriacao: '2025-01-15',
    dataAtualizacao: '2025-03-20',
    caminhoJudicial: { numeroProcesso: '0001234-56.2025.8.26.0001', varaJudicial: '3ª Vara Cível', dataEntrada: '2025-02-10', statusProcesso: 'Aguardando audiência' },
    anotacoes: [
      { id: 'a1', texto: 'Documentos de posse reunidos.', autor: 'Mariana Costa', data: '2025-01-20' },
      { id: 'a2', texto: 'Petição inicial protocolada.', autor: 'Ana Silva', data: '2025-02-10' },
    ],
    documentos: [
      { id: 'd1', nome: 'Comprovante de residência', tipo: 'pdf', data: '2025-01-18' },
      { id: 'd2', nome: 'Petição inicial', tipo: 'pdf', data: '2025-02-10' },
    ],
    timeline: [
      { id: 't1', descricao: 'Caso criado', data: '2025-01-15', autor: 'Mariana Costa', tipo: 'criacao' },
      { id: 't2', descricao: 'Status alterado para Documentação', data: '2025-01-20', autor: 'Mariana Costa', tipo: 'status' },
      { id: 't3', descricao: 'Petição inicial protocolada', data: '2025-02-10', autor: 'Ana Silva', tipo: 'documento' },
      { id: 't4', descricao: 'Status alterado para Em Processo Judicial', data: '2025-02-10', autor: 'Ana Silva', tipo: 'status' },
    ],
  },
  {
    id: 'c2',
    morador: { nome: 'José Aparecido', cpf: '987.654.321-00', telefone: '(11) 91234-5678', endereco: 'Av. Brasil, 456 - Jardim Esperança' },
    descricao: 'Acordo de vizinhança por conta de obra irregular.',
    tipo: 'conciliacao',
    status: 'documentacao',
    estagiarioId: '5',
    coordenadorId: '2',
    dataCriacao: '2025-02-01',
    dataAtualizacao: '2025-03-10',
    conciliacao: { dadosOutraParte: 'Antônio Ferreira - CPF 111.222.333-44', dataAudiencia: '2025-04-15', local: 'CEJUSC - Fórum Central', resultado: '' },
    anotacoes: [
      { id: 'a3', texto: 'Morador relatou danos na parede.', autor: 'Lucas Oliveira', data: '2025-02-05' },
    ],
    documentos: [
      { id: 'd3', nome: 'Fotos do dano', tipo: 'jpg', data: '2025-02-05' },
    ],
    timeline: [
      { id: 't5', descricao: 'Caso criado', data: '2025-02-01', autor: 'Lucas Oliveira', tipo: 'criacao' },
      { id: 't6', descricao: 'Status alterado para Documentação', data: '2025-02-05', autor: 'Lucas Oliveira', tipo: 'status' },
    ],
  },
  {
    id: 'c3',
    morador: { nome: 'Francisca Almeida', cpf: '456.789.123-00', telefone: '(11) 99876-5432', endereco: 'Trav. São Jorge, 78 - Vila Nova' },
    descricao: 'Usucapião de terreno ocupado há mais de 10 anos.',
    tipo: 'judicial',
    status: 'triagem',
    estagiarioId: '6',
    coordenadorId: '3',
    dataCriacao: '2025-03-01',
    dataAtualizacao: '2025-03-01',
    anotacoes: [],
    documentos: [],
    timeline: [
      { id: 't7', descricao: 'Caso criado', data: '2025-03-01', autor: 'Beatriz Ferreira', tipo: 'criacao' },
    ],
  },
  {
    id: 'c4',
    morador: { nome: 'Roberto Lima', cpf: '321.654.987-00', telefone: '(11) 98888-7777', endereco: 'Rua Esperança, 200 - Parque das Nações' },
    descricao: 'Regularização de escritura de imóvel comprado informalmente.',
    tipo: 'judicial',
    status: 'finalizado',
    estagiarioId: '4',
    coordenadorId: '2',
    dataCriacao: '2024-08-10',
    dataAtualizacao: '2025-01-20',
    caminhoJudicial: { numeroProcesso: '0009876-54.2024.8.26.0001', varaJudicial: '1ª Vara de Registros Públicos', dataEntrada: '2024-09-15', statusProcesso: 'Sentença favorável transitada em julgado' },
    anotacoes: [
      { id: 'a4', texto: 'Escritura registrada com sucesso.', autor: 'Ana Silva', data: '2025-01-20' },
    ],
    documentos: [
      { id: 'd4', nome: 'Escritura registrada', tipo: 'pdf', data: '2025-01-20' },
    ],
    timeline: [
      { id: 't8', descricao: 'Caso criado', data: '2024-08-10', autor: 'Mariana Costa', tipo: 'criacao' },
      { id: 't9', descricao: 'Status alterado para Finalizado', data: '2025-01-20', autor: 'Ana Silva', tipo: 'status' },
    ],
  },
  {
    id: 'c5',
    morador: { nome: 'Sandra Nascimento', cpf: '654.321.098-00', telefone: '(11) 97777-6666', endereco: 'Rua do Sol, 55 - Jardim Primavera' },
    descricao: 'Conflito com construtora por vícios de construção.',
    tipo: 'conciliacao',
    status: 'triagem',
    estagiarioId: '5',
    coordenadorId: '3',
    dataCriacao: '2025-03-15',
    dataAtualizacao: '2025-03-15',
    anotacoes: [],
    documentos: [],
    timeline: [
      { id: 't10', descricao: 'Caso criado', data: '2025-03-15', autor: 'Lucas Oliveira', tipo: 'criacao' },
    ],
  },
  {
    id: 'c6',
    morador: { nome: 'Antônia Pereira', cpf: '789.012.345-00', telefone: '(11) 96666-5555', endereco: 'Av. Central, 890 - Centro' },
    descricao: 'Ação de despejo por falta de pagamento de aluguel.',
    tipo: 'judicial',
    status: 'processo',
    estagiarioId: '6',
    coordenadorId: '3',
    dataCriacao: '2025-01-05',
    dataAtualizacao: '2025-03-18',
    caminhoJudicial: { numeroProcesso: '0005555-33.2025.8.26.0001', varaJudicial: '5ª Vara Cível', dataEntrada: '2025-01-25', statusProcesso: 'Citação realizada' },
    anotacoes: [
      { id: 'a5', texto: 'Defesa apresentada pelo morador.', autor: 'Beatriz Ferreira', data: '2025-02-20' },
    ],
    documentos: [
      { id: 'd5', nome: 'Contestação', tipo: 'pdf', data: '2025-02-20' },
    ],
    timeline: [
      { id: 't11', descricao: 'Caso criado', data: '2025-01-05', autor: 'Beatriz Ferreira', tipo: 'criacao' },
      { id: 't12', descricao: 'Status alterado para Em Processo Judicial', data: '2025-01-25', autor: 'Pedro Santos', tipo: 'status' },
    ],
  },
];
