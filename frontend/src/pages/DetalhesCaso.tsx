import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react--dom';
import {router useCasos } from '@/contexts/CasosContext';
import { useUsers } from '@/hooks/useUsers';
import { CaseStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, FileText, Clock, Upload, Download, Scale, Handshake,
  FileUp, PenLine, Loader2, Plus,
} from 'lucide-react';
import { associateService } from '@/services/associateService';
import { consultationService } from '@/services/consultationService';
import { processService } from '@/services/processService';
import { conciliationService } from '@/services/conciliationService';
import { documentService } from '@/services/documentService';
import { fileService } from '@/services/fileService';
import {
  CaseHistoryEntry,
  ConciliationResponse,
  ConsultationResponse,
  ProcessResponse,
  ProcessStatusApi,
  CitationStatusApi,
  FileAttachmentResponse,
} from '@/types/api';

const statusLabels: Record<string, string> = {
  triagem: 'Triagem', documentacao: 'Documentação', processo: 'Em Processo Judicial', finalizado: 'Finalizado',
};
const statusOptions: CaseStatus[] = ['triagem', 'documentacao', 'processo', 'finalizado'];

const processStatusLabels: Record<ProcessStatusApi, string> = {
  INITIAL: 'Inicial', CITATION: 'Citação', INSTRUCTION: 'Instrução', JUDGMENT: 'Julgamento',
  APPEAL: 'Recurso', EXECUTION: 'Execução', CLOSED: 'Encerrado', ARCHIVED: 'Arquivado',
};
const processStatusOptions: ProcessStatusApi[] = ['INITIAL', 'CITATION', 'INSTRUCTION', 'JUDGMENT', 'APPEAL', 'EXECUTION', 'CLOSED', 'ARCHIVED'];

const citationStatusLabels: Record<CitationStatusApi, string> = {
  PENDING: 'Pendente', CITED: 'Citado(a)', NOT_FOUND: 'Não encontrado(a)', REFUSED: 'Recusado(a)', NOTICE: 'Intimado(a)',
};
const citationStatusOptions: CitationStatusApi[] = ['PENDING', 'CITED', 'NOT_FOUND', 'REFUSED', 'NOTICE'];

const DetalhesCaso = () => {
  const { id } = useParams();
  const { casos, updateCaso, loading: casosLoading } = useCasos();
  const { getUserName } = useUsers();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tab, setTab] = useState<'info' | 'timeline' | 'docs' | 'judicial' | 'conciliacao'>('info');

  const caso = casos.find(c => c.id === id);
  const casoId = id ? Number(id) : undefined;

  // -------- Anotações (mapeadas para Consultation no backend) --------
  const [notas, setNotas] = useState<ConsultationResponse[]>([]);
  const [notasLoading, setNotasLoading] = useState(true);
  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [savingNota, setSavingNota] = useState(false);

  const loadNotas = async () => {
    if (!casoId) return;
    setNotasLoading(true);
    try {
      const page = await consultationService.byAssociate(casoId, { size: 200 });
      setNotas(page.content);
    } finally {
      setNotasLoading(false);
    }
  };

  // -------- Histórico automático do caso --------
  const [historico, setHistorico] = useState<CaseHistoryEntry[]>([]);
  const loadHistorico = async () => {
    if (!casoId) return;
    try {
      setHistorico(await associateService.history(casoId));
    } catch {
      // segue sem histórico se der erro
    }
  };

  // -------- Documentos anexados --------
  const [arquivos, setArquivos] = useState<FileAttachmentResponse[]>([]);
  const [uploading, setUploading] = useState(false);
  const loadArquivos = async () => {
    if (!id) return;
    try {
      setArquivos(await fileService.listByReference(id));
    } catch {
      // segue sem arquivos se der erro
    }
  };

  // -------- Processos judiciais --------
  const [processos, setProcessos] = useState<ProcessResponse[]>([]);
  const [novoProcesso, setNovoProcesso] = useState({ processNumber: '', city: '', court: '', description: '', status: 'INITIAL' as ProcessStatusApi });
  const [savingProcesso, setSavingProcesso] = useState(false);
  const loadProcessos = async () => {
    if (!casoId) return;
    try {
      setProcessos(await processService.byAssociate(casoId));
    } catch {
      // segue sem processos se der erro
    }
  };

  // -------- Conciliações --------
  const [conciliacoes, setConciliacoes] = useState<ConciliationResponse[]>([]);
  const [novaConciliacao, setNovaConciliacao] = useState({ oppositePartyName: '', oppositePartyContact: '', audienceDateTime: '', summary: '', citationStatus: 'PENDING' as CitationStatusApi });
  const [savingConciliacao, setSavingConciliacao] = useState(false);
  const loadConciliacoes = async () => {
    if (!casoId) return;
    try {
      setConciliacoes(await conciliationService.byAssociate(casoId));
    } catch {
      // segue sem conciliações se der erro
    }
  };

  useEffect(() => {
    if (!casoId) return;
    loadNotas();
    loadHistorico();
    loadArquivos();
    loadProcessos();
    loadConciliacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [casoId]);

  if (casosLoading && !caso) {
    return <div className="p-8 text-center text-muted-foreground">Carregando caso...</div>;
  }
  if (!caso) return <div className="p-8 text-center text-muted-foreground">Caso não encontrado.</div>;

  const handleStatusChange = async (newStatus: CaseStatus) => {
    try {
      await updateCaso(caso.id, { status: newStatus });
      toast({ title: 'Status atualizado', description: `Caso movido para ${statusLabels[newStatus]}` });
    } catch (err) {
      toast({ title: 'Erro ao atualizar status', description: err instanceof Error ? err.message : 'Tente novamente.', variant: 'destructive' });
    }
  };

  const addAnotacao = async () => {
    if (!novaAnotacao.trim() || !casoId) return;
    setSavingNota(true);
    try {
      await consultationService.create({
        summary: novaAnotacao,
        date: new Date().toISOString().split('T')[0],
        associateId: casoId,
      });
      setNovaAnotacao('');
      await loadNotas();
      toast({ title: 'Anotação adicionada' });
    } catch (err) {
      toast({ title: 'Erro ao salvar anotação', description: err instanceof Error ? err.message : 'Tente novamente.', variant: 'destructive' });
    } finally {
      setSavingNota(false);
    }
  };

  const generateDoc = async (type: 'POWER_OF_ATTORNEY' | 'DECLARATION_OF_INSUFFICIENCY_OF_RESOURCES') => {
    if (!casoId) return;
    try {
      const doc = await documentService.generate({
        type,
        format: 'PDF',
        associateId: casoId,
        coordinatorId: caso.coordenadorId ? Number(caso.coordenadorId) : null,
      });
      documentService.triggerDownload(doc);
      toast({ title: 'Documento gerado', description: `${type === 'POWER_OF_ATTORNEY' ? 'Procuração' : 'Declaração'} baixada com sucesso.` });
    } catch (err) {
      toast({ title: 'Erro ao gerar documento', description: err instanceof Error ? err.message : 'Tente novamente.', variant: 'destructive' });
    }
  };

  const handleUpload = async (file: File) => {
    if (!id) return;
    setUploading(true);
    try {
      await fileService.upload(file, id);
      await loadArquivos();
      toast({ title: 'Arquivo enviado' });
    } catch (err) {
      toast({ title: 'Erro no upload', description: err instanceof Error ? err.message : 'Tente novamente.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const addProcesso = async () => {
    if (!casoId || !novoProcesso.processNumber || !novoProcesso.city || !novoProcesso.court) return;
    setSavingProcesso(true);
    try {
      await processService.create({ ...novoProcesso, associateId: casoId });
      setNovoProcesso({ processNumber: '', city: '', court: '', description: '', status: 'INITIAL' });
      await loadProcessos();
      toast({ title: 'Processo cadastrado' });
    } catch (err) {
      toast({ title: 'Erro ao cadastrar processo', description: err instanceof Error ? err.message : 'Tente novamente.', variant: 'destructive' });
    } finally {
      setSavingProcesso(false);
    }
  };

  const updateProcessoStatus = async (processoId: number, status: ProcessStatusApi) => {
    try {
      await processService.updateStatus(processoId, status);
      await loadProcessos();
    } catch (err) {
      toast({ title: 'Erro ao atualizar processo', description: err instanceof Error ? err.message : 'Tente novamente.', variant: 'destructive' });
    }
  };

  const addConciliacao = async () => {
    if (!casoId || !novaConciliacao.oppositePartyName) return;
    setSavingConciliacao(true);
    try {
      await conciliationService.create({
        ...novaConciliacao,
        audienceDateTime: novaConciliacao.audienceDateTime || undefined,
        associateId: casoId,
      });
      setNovaConciliacao({ oppositePartyName: '', oppositePartyContact: '', audienceDateTime: '', summary: '', citationStatus: 'PENDING' });
      await loadConciliacoes();
      toast({ title: 'Conciliação cadastrada' });
    } catch (err) {
      toast({ title: 'Erro ao cadastrar conciliação', description: err instanceof Error ? err.message : 'Tente novamente.', variant: 'destructive' });
    } finally {
      setSavingConciliacao(false);
    }
  };

  const updateConciliacaoStatus = async (conciliacaoId: number, status: CitationStatusApi) => {
    try {
      await conciliationService.updateStatus(conciliacaoId, status);
      await loadConciliacoes();
    } catch (err) {
      toast({ title: 'Erro ao atualizar conciliação', description: err instanceof Error ? err.message : 'Tente novamente.', variant: 'destructive' });
    }
  };

  const tabs = [
    { key: 'info', label: 'Informações', icon: FileText },
    { key: 'timeline', label: 'Linha do Tempo', icon: Clock },
    { key: 'docs', label: 'Documentos', icon: FileUp },
    ...(caso.tipo === 'judicial' ? [{ key: 'judicial', label: 'Processos', icon: Scale }] : []),
    ...(caso.tipo === 'conciliacao' ? [{ key: 'conciliacao', label: 'Conciliação', icon: Handshake }] : []),
  ] as { key: typeof tab; label: string; icon: React.ElementType }[];

  const timelineItems = [
    ...historico.map(h => ({ id: `h${h.id}`, descricao: h.action, autor: h.userName, data: h.createdAt })),
    ...notas.map(n => ({ id: `n${n.id}`, descricao: n.summary, autor: n.internName, data: n.createdAt || n.date })),
  ].sort((a, b) => (a.data < b.data ? 1 : -1));

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
          <Button size="sm" variant="outline" onClick={() => generateDoc('POWER_OF_ATTORNEY')} className="text-xs"><Download className="w-3 h-3 mr-1" />Procuração</Button>
          <Button size="sm" variant="outline" onClick={() => generateDoc('DECLARATION_OF_INSUFFICIENCY_OF_RESOURCES')} className="text-xs"><Download className="w-3 h-3 mr-1" />Decl. Hipossuficiência</Button>
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

      {/* Info */}
      {tab === 'info' && (
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h3 className="font-semibold text-foreground">Descrição do Caso</h3>
          <p className="text-sm text-muted-foreground">{caso.descricao || 'Sem descrição.'}</p>

          {caso.legalGuidance && (
            <>
              <h3 className="font-semibold text-foreground mt-4">Orientação Jurídica</h3>
              <p className="text-sm text-muted-foreground">{caso.legalGuidance}</p>
            </>
          )}

          <h3 className="font-semibold text-foreground mt-6">Anotações</h3>
          {notasLoading ? (
            <p className="text-sm text-muted-foreground">Carregando anotações...</p>
          ) : (
            <div className="space-y-3">
              {notas.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma anotação ainda.</p>}
              {notas.slice().reverse().map(n => (
                <div key={n.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span className="font-medium text-foreground">{n.internName}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="text-sm text-foreground">{n.summary}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Textarea value={novaAnotacao} onChange={e => setNovaAnotacao(e.target.value)} placeholder="Adicionar anotação..." rows={2} className="flex-1" />
            <Button onClick={addAnotacao} disabled={savingNota} className="bg-accent text-accent-foreground self-end">
              {savingNota ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {tab === 'timeline' && (
        <div className="bg-card rounded-xl border border-border p-5">
          {timelineItems.length === 0 && <p className="text-sm text-muted-foreground">Sem eventos registrados.</p>}
          <div className="space-y-0">
            {timelineItems.map((ev, i) => (
              <div key={ev.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full mt-1.5 bg-accent" />
                  {i < timelineItems.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-foreground">{ev.descricao}</p>
                  <p className="text-xs text-muted-foreground">{ev.autor} • {ev.data?.split('T')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documentos anexados */}
      {tab === 'docs' && (
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Documentos</h3>
            <label>
              <input
                type="file"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = '';
                }}
              />
              <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input bg-background text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
              </span>
            </label>
          </div>
          {arquivos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum documento anexado.</p>
          ) : (
            <div className="divide-y divide-border">
              {arquivos.map(d => (
                <div key={d.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.fileName}</p>
                      <p className="text-xs text-muted-foreground">{d.contentType}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => fileService.download(d.id, d.fileName)}><Download className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Processos judiciais */}
      {tab === 'judicial' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h3 className="font-semibold text-foreground">Novo Processo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Número do Processo</Label><Input value={novoProcesso.processNumber} onChange={e => setNovoProcesso(p => ({ ...p, processNumber: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Vara</Label><Input value={novoProcesso.court} onChange={e => setNovoProcesso(p => ({ ...p, court: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Cidade</Label><Input value={novoProcesso.city} onChange={e => setNovoProcesso(p => ({ ...p, city: e.target.value }))} /></div>
              <div className="space-y-1">
                <Label>Fase</Label>
                <select value={novoProcesso.status} onChange={e => setNovoProcesso(p => ({ ...p, status: e.target.value as ProcessStatusApi }))} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground">
                  {processStatusOptions.map(s => <option key={s} value={s}>{processStatusLabels[s]}</option>)}
                </select>
              </div>
              <div className="space-y-1 md:col-span-2"><Label>Descrição</Label><Textarea value={novoProcesso.description} onChange={e => setNovoProcesso(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
            </div>
            <Button onClick={addProcesso} disabled={savingProcesso} className="bg-accent text-accent-foreground">
              {savingProcesso ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" />Adicionar Processo</>}
            </Button>
          </div>

          {processos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum processo cadastrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {processos.map(p => (
                <div key={p.id} className="bg-card rounded-xl border border-border p-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{p.processNumber}</p>
                      <p className="text-xs text-muted-foreground">{p.court} • {p.city}</p>
                    </div>
                    <select value={p.currentStatus} onChange={e => updateProcessoStatus(p.id, e.target.value as ProcessStatusApi)} className="text-xs px-2 py-1 rounded-lg border border-border bg-card text-foreground">
                      {processStatusOptions.map(s => <option key={s} value={s}>{processStatusLabels[s]}</option>)}
                    </select>
                  </div>
                  {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Conciliações */}
      {tab === 'conciliacao' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h3 className="font-semibold text-foreground">Nova Audiência de Conciliação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2"><Label>Parte Contrária</Label><Input value={novaConciliacao.oppositePartyName} onChange={e => setNovaConciliacao(p => ({ ...p, oppositePartyName: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Contato da Parte Contrária</Label><Input value={novaConciliacao.oppositePartyContact} onChange={e => setNovaConciliacao(p => ({ ...p, oppositePartyContact: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Data/Hora da Audiência</Label><Input type="datetime-local" value={novaConciliacao.audienceDateTime} onChange={e => setNovaConciliacao(p => ({ ...p, audienceDateTime: e.target.value }))} /></div>
              <div className="space-y-1">
                <Label>Status de Citação</Label>
                <select value={novaConciliacao.citationStatus} onChange={e => setNovaConciliacao(p => ({ ...p, citationStatus: e.target.value as CitationStatusApi }))} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground">
                  {citationStatusOptions.map(s => <option key={s} value={s}>{citationStatusLabels[s]}</option>)}
                </select>
              </div>
              <div className="space-y-1 md:col-span-2"><Label>Resumo</Label><Textarea value={novaConciliacao.summary} onChange={e => setNovaConciliacao(p => ({ ...p, summary: e.target.value }))} rows={2} /></div>
            </div>
            <Button onClick={addConciliacao} disabled={savingConciliacao} className="bg-accent text-accent-foreground">
              {savingConciliacao ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" />Adicionar Audiência</>}
            </Button>
          </div>

          {conciliacoes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma audiência cadastrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {conciliacoes.map(c => (
                <div key={c.id} className="bg-card rounded-xl border border-border p-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{c.oppositePartyName}</p>
                      <p className="text-xs text-muted-foreground">{c.audienceDateTime ? new Date(c.audienceDateTime).toLocaleString('pt-BR') : 'Sem data definida'}</p>
                    </div>
                    <select value={c.citationStatus} onChange={e => updateConciliacaoStatus(c.id, e.target.value as CitationStatusApi)} className="text-xs px-2 py-1 rounded-lg border border-border bg-card text-foreground">
                      {citationStatusOptions.map(s => <option key={s} value={s}>{citationStatusLabels[s]}</option>)}
                    </select>
                  </div>
                  {c.summary && <p className="text-sm text-muted-foreground">{c.summary}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetalhesCaso;
