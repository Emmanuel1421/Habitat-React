import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCasos } from '@/contexts/CasosContext';
import { mockUsers } from '@/data/mockData';
import { CaseStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, FileText, MessageSquare, Clock, Upload, Download, Scale, Handshake,
  Circle, CheckCircle2, FileUp, PenLine
} from 'lucide-react';

const statusLabels: Record<string, string> = {
  triagem: 'Triagem', documentacao: 'Documentação', processo: 'Em Processo Judicial', finalizado: 'Finalizado',
};

const statusOptions: CaseStatus[] = ['triagem', 'documentacao', 'processo', 'finalizado'];

const DetalhesCaso = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { casos, updateCaso } = useCasos();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<'info' | 'timeline' | 'docs' | 'judicial' | 'conciliacao'>('info');
  const [novaAnotacao, setNovaAnotacao] = useState('');

  // Judicial form
  const [judicialForm, setJudicialForm] = useState({ numeroProcesso: '', varaJudicial: '', dataEntrada: '', statusProcesso: '' });
  // Conciliação form
  const [conciliacaoForm, setConciliacaoForm] = useState({ dadosOutraParte: '', dataAudiencia: '', local: '', resultado: '' });

  const caso = casos.find(c => c.id === id);
  if (!caso) return <div className="p-8 text-center text-muted-foreground">Caso não encontrado.</div>;

  const getUserName = (uid: string) => mockUsers.find(u => u.id === uid)?.nome || '';

  const handleStatusChange = (newStatus: CaseStatus) => {
    const now = new Date().toISOString().split('T')[0];
    updateCaso(caso.id, {
      status: newStatus,
      dataAtualizacao: now,
      timeline: [...caso.timeline, { id: `t${Date.now()}`, descricao: `Status alterado para ${statusLabels[newStatus]}`, data: now, autor: user?.nome || '', tipo: 'status' }],
    });
    toast({ title: 'Status atualizado', description: `Caso movido para ${statusLabels[newStatus]}` });
  };

  const addAnotacao = () => {
    if (!novaAnotacao.trim()) return;
    const now = new Date().toISOString().split('T')[0];
    updateCaso(caso.id, {
      anotacoes: [...caso.anotacoes, { id: `a${Date.now()}`, texto: novaAnotacao, autor: user?.nome || '', data: now }],
      timeline: [...caso.timeline, { id: `t${Date.now()}`, descricao: novaAnotacao, data: now, autor: user?.nome || '', tipo: 'anotacao' }],
    });
    setNovaAnotacao('');
    toast({ title: 'Anotação adicionada' });
  };

  const saveJudicial = () => {
    updateCaso(caso.id, { caminhoJudicial: judicialForm });
    toast({ title: 'Dados judiciais salvos' });
  };

  const saveConciliacao = () => {
    updateCaso(caso.id, { conciliacao: conciliacaoForm });
    toast({ title: 'Dados de conciliação salvos' });
  };

  const generateDoc = (type: 'procuracao' | 'hipossuficiencia') => {
    const coord = mockUsers.find(u => u.id === caso.coordenadorId);
    const content = type === 'procuracao'
      ? `PROCURAÇÃO\n\nOutorgante: ${caso.morador.nome}\nCPF: ${caso.morador.cpf}\nEndereço: ${caso.morador.endereco}\n\nOutorgado(a): ${coord?.nome || 'Advogado(a) Responsável'}\n\nPoderes: Para o foro em geral, com a cláusula "ad judicia", podendo propor contra quem de direito as medidas judiciais necessárias.\n\nData: ${new Date().toLocaleDateString('pt-BR')}`
      : `DECLARAÇÃO DE HIPOSSUFICIÊNCIA\n\nEu, ${caso.morador.nome}, CPF ${caso.morador.cpf}, residente em ${caso.morador.endereco}, declaro para os devidos fins de direito, sob as penas da lei, que não possuo condições financeiras de arcar com as despesas processuais e honorários advocatícios sem prejuízo do sustento próprio e de minha família.\n\nData: ${new Date().toLocaleDateString('pt-BR')}\n\n___________________________\n${caso.morador.nome}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${caso.morador.nome.replace(/\s/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Documento gerado', description: `${type === 'procuracao' ? 'Procuração' : 'Declaração'} baixada com sucesso.` });
  };

  const tabs = [
    { key: 'info', label: 'Informações', icon: FileText },
    { key: 'timeline', label: 'Linha do Tempo', icon: Clock },
    { key: 'docs', label: 'Documentos', icon: FileUp },
    ...(caso.tipo === 'judicial' ? [{ key: 'judicial', label: 'Caminho Judicial', icon: Scale }] : []),
    ...(caso.tipo === 'conciliacao' ? [{ key: 'conciliacao', label: 'Conciliação', icon: Handshake }] : []),
  ] as { key: typeof tab; label: string; icon: React.ElementType }[];

  const jud = caso.caminhoJudicial || judicialForm;
  const conc = caso.conciliacao || conciliacaoForm;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{caso.morador.nome}</h1>
            <p className="text-sm text-muted-foreground">{caso.morador.cpf} • {caso.morador.telefone}</p>
            <p className="text-sm text-muted-foreground">{caso.morador.endereco}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium status-${caso.status}`}>{statusLabels[caso.status]}</span>
            <select value={caso.status} onChange={e => handleStatusChange(e.target.value as CaseStatus)} className="text-xs px-2 py-1 rounded-lg border border-border bg-card text-foreground">
              {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>Tipo: <strong className="text-foreground">{caso.tipo === 'judicial' ? 'Judicial' : 'Conciliação'}</strong></span>
          <span>Estagiário: <strong className="text-foreground">{getUserName(caso.estagiarioId)}</strong></span>
          <span>Coordenador: <strong className="text-foreground">{getUserName(caso.coordenadorId)}</strong></span>
          <span>Criado em: <strong className="text-foreground">{caso.dataCriacao}</strong></span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => generateDoc('procuracao')} className="text-xs"><Download className="w-3 h-3 mr-1" />Procuração</Button>
          <Button size="sm" variant="outline" onClick={() => generateDoc('hipossuficiencia')} className="text-xs"><Download className="w-3 h-3 mr-1" />Decl. Hipossuficiência</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.key ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'info' && (
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h3 className="font-semibold text-foreground">Descrição do Caso</h3>
          <p className="text-sm text-muted-foreground">{caso.descricao}</p>
          <h3 className="font-semibold text-foreground mt-6">Anotações</h3>
          <div className="space-y-3">
            {caso.anotacoes.map(a => (
              <div key={a.id} className="bg-muted/50 rounded-lg p-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span className="font-medium text-foreground">{a.autor}</span>
                  <span>{a.data}</span>
                </div>
                <p className="text-sm text-foreground">{a.texto}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea value={novaAnotacao} onChange={e => setNovaAnotacao(e.target.value)} placeholder="Adicionar anotação..." rows={2} className="flex-1" />
            <Button onClick={addAnotacao} className="bg-accent text-accent-foreground self-end"><PenLine className="w-4 h-4" /></Button>
          </div>
        </div>
      )}

      {tab === 'timeline' && (
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="space-y-0">
            {caso.timeline.slice().reverse().map((ev, i) => (
              <div key={ev.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${ev.tipo === 'criacao' ? 'bg-accent' : ev.tipo === 'status' ? 'bg-info' : ev.tipo === 'documento' ? 'bg-warning' : 'bg-muted-foreground'}`} />
                  {i < caso.timeline.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-foreground">{ev.descricao}</p>
                  <p className="text-xs text-muted-foreground">{ev.autor} • {ev.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'docs' && (
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Documentos</h3>
            <Button size="sm" variant="outline"><Upload className="w-4 h-4 mr-1" /> Upload</Button>
          </div>
          {caso.documentos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum documento anexado.</p>
          ) : (
            <div className="divide-y divide-border">
              {caso.documentos.map(d => (
                <div key={d.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.nome}</p>
                      <p className="text-xs text-muted-foreground">{d.tipo.toUpperCase()} • {d.data}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'judicial' && (
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h3 className="font-semibold text-foreground">Caminho Judicial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Número do Processo</Label>
              <Input value={jud.numeroProcesso} onChange={e => caso.caminhoJudicial ? updateCaso(caso.id, { caminhoJudicial: { ...jud, numeroProcesso: e.target.value } }) : setJudicialForm(p => ({ ...p, numeroProcesso: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Vara Judicial</Label>
              <Input value={jud.varaJudicial} onChange={e => caso.caminhoJudicial ? updateCaso(caso.id, { caminhoJudicial: { ...jud, varaJudicial: e.target.value } }) : setJudicialForm(p => ({ ...p, varaJudicial: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Data de Entrada</Label>
              <Input type="date" value={jud.dataEntrada} onChange={e => caso.caminhoJudicial ? updateCaso(caso.id, { caminhoJudicial: { ...jud, dataEntrada: e.target.value } }) : setJudicialForm(p => ({ ...p, dataEntrada: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Status do Processo</Label>
              <Input value={jud.statusProcesso} onChange={e => caso.caminhoJudicial ? updateCaso(caso.id, { caminhoJudicial: { ...jud, statusProcesso: e.target.value } }) : setJudicialForm(p => ({ ...p, statusProcesso: e.target.value }))} />
            </div>
          </div>
          {!caso.caminhoJudicial && <Button onClick={saveJudicial} className="bg-accent text-accent-foreground">Salvar</Button>}
        </div>
      )}

      {tab === 'conciliacao' && (
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h3 className="font-semibold text-foreground">Conciliação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Dados da Outra Parte</Label>
              <Input value={conc.dadosOutraParte} onChange={e => caso.conciliacao ? updateCaso(caso.id, { conciliacao: { ...conc, dadosOutraParte: e.target.value } }) : setConciliacaoForm(p => ({ ...p, dadosOutraParte: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Data da Audiência</Label>
              <Input type="date" value={conc.dataAudiencia} onChange={e => caso.conciliacao ? updateCaso(caso.id, { conciliacao: { ...conc, dataAudiencia: e.target.value } }) : setConciliacaoForm(p => ({ ...p, dataAudiencia: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Local</Label>
              <Input value={conc.local} onChange={e => caso.conciliacao ? updateCaso(caso.id, { conciliacao: { ...conc, local: e.target.value } }) : setConciliacaoForm(p => ({ ...p, local: e.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Resultado da Conciliação</Label>
              <Textarea value={conc.resultado} onChange={e => caso.conciliacao ? updateCaso(caso.id, { conciliacao: { ...conc, resultado: e.target.value } }) : setConciliacaoForm(p => ({ ...p, resultado: e.target.value }))} rows={3} />
            </div>
          </div>
          {!caso.conciliacao && <Button onClick={saveConciliacao} className="bg-accent text-accent-foreground">Salvar</Button>}
        </div>
      )}
    </div>
  );
};

export default DetalhesCaso;
