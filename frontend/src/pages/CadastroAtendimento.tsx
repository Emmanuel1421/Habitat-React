import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCasos } from '@/contexts/CasosContext';
import { useUsers } from '@/hooks/useUsers';
import { TipoAtendimento } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const CadastroAtendimento = () => {
  const { user } = useAuth();
  const { addCaso } = useCasos();
  const { users } = useUsers();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nome: '', cpf: '', telefone: '', endereco: '', descricao: '',
    tipo: 'judicial' as TipoAtendimento,
    estagiarioId: user?.role === 'estagiario' ? user.id : '',
    coordenadorId: user?.role === 'coordenador' ? user.id : '',
  });

  const estagiarios = users.filter(u => u.role === 'INTERN' && u.status);
  const coordenadores = users.filter(u => u.role === 'COORDINATOR' && u.status);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const formatCPF = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addCaso({
        nome: form.nome,
        cpf: form.cpf,
        telefone: form.telefone,
        endereco: form.endereco,
        descricao: form.descricao,
        tipo: form.tipo,
        estagiarioId: form.estagiarioId,
        coordenadorId: form.coordenadorId,
      });
      toast({ title: 'Sucesso!', description: 'Atendimento cadastrado com sucesso.' });
      navigate('/kanban');
    } catch (err) {
      toast({
        title: 'Erro ao cadastrar',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Novo Atendimento</h1>
        <p className="text-sm text-muted-foreground">Preencha todos os campos para cadastrar um novo caso</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-semibold text-foreground text-lg">Dados do Morador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Nome Completo *</Label>
              <Input value={form.nome} onChange={e => handleChange('nome', e.target.value)} placeholder="Nome completo do morador" required />
            </div>
            <div className="space-y-2">
              <Label>CPF *</Label>
              <Input value={form.cpf} onChange={e => handleChange('cpf', formatCPF(e.target.value))} placeholder="000.000.000-00" required />
            </div>
            <div className="space-y-2">
              <Label>Telefone *</Label>
              <Input value={form.telefone} onChange={e => handleChange('telefone', formatPhone(e.target.value))} placeholder="(00) 00000-0000" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Endereço *</Label>
              <Input value={form.endereco} onChange={e => handleChange('endereco', e.target.value)} placeholder="Rua, número, bairro, cidade" required />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-semibold text-foreground text-lg">Detalhes do Caso</h2>
          <div className="space-y-2">
            <Label>Descrição do Caso *</Label>
            <Textarea value={form.descricao} onChange={e => handleChange('descricao', e.target.value)} placeholder="Descreva detalhadamente o caso do morador..." rows={4} required />
          </div>
          <div className="space-y-2">
            <Label>Tipo de Atendimento *</Label>
            <div className="flex gap-4">
              {(['judicial', 'conciliacao'] as const).map(t => (
                <label key={t} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${form.tipo === t ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:border-accent/50'}`}>
                  <input type="radio" name="tipo" value={t} checked={form.tipo === t} onChange={() => handleChange('tipo', t)} className="sr-only" />
                  <span className="font-medium text-sm">{t === 'judicial' ? 'Judicial' : 'Conciliação'}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-semibold text-foreground text-lg">Responsáveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estagiário Responsável *</Label>
              <select value={form.estagiarioId} onChange={e => handleChange('estagiarioId', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground" required disabled={user?.role === 'estagiario'}>
                <option value="">Selecione...</option>
                {estagiarios.map(e => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Coordenador *</Label>
              <select value={form.coordenadorId} onChange={e => handleChange('coordenadorId', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground" required disabled={user?.role === 'coordenador'}>
                <option value="">Selecione...</option>
                {coordenadores.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cadastrar Atendimento'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CadastroAtendimento;
