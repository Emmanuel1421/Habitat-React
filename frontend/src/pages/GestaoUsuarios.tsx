import React, { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { userService } from '@/services/userService';
import { UserRoleApi } from '@/types/api';
import { roleLabelsApi } from '@/lib/roleMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Ban, X, Loader2 } from 'lucide-react';

interface UserFormState {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: UserRoleApi;
  coordinatorId: string;
  status: boolean;
}

const emptyForm: UserFormState = { name: '', email: '', password: '', role: 'INTERN', coordinatorId: '', status: true };

const GestaoUsuarios = () => {
  const { users, loading, refresh } = useUsers();
  const [form, setForm] = useState<UserFormState | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const coordenadores = users.filter(u => u.role === 'COORDINATOR' && u.status);

  const openNew = () => { setForm({ ...emptyForm }); setIsNew(true); };
  const openEdit = (u: typeof users[number]) => {
    setForm({ id: u.id, name: u.name, email: u.email, password: '', role: u.role, coordinatorId: '', status: u.status });
    setIsNew(false);
  };
  const close = () => { setForm(null); setIsNew(false); };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      if (isNew) {
        await userService.create({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          coordinatorId: form.role === 'INTERN' && form.coordinatorId ? Number(form.coordinatorId) : null,
        });
        toast({ title: 'Usuário criado' });
      } else if (form.id) {
        await userService.update(form.id, {
          name: form.name,
          email: form.email,
          password: form.password ? form.password : undefined,
          coordinatorId: form.coordinatorId ? Number(form.coordinatorId) : undefined,
          status: form.status,
        });
        toast({ title: 'Usuário atualizado' });
      }
      await refresh();
      close();
    } catch (err) {
      toast({
        title: 'Erro ao salvar usuário',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const inactivate = async (id: number) => {
    try {
      await userService.inactivate(id);
      await refresh();
      toast({ title: 'Usuário desativado' });
    } catch (err) {
      toast({
        title: 'Erro ao desativar usuário',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Usuários</h1>
          <p className="text-sm text-muted-foreground">Gerencie os acessos ao sistema</p>
        </div>
        <Button onClick={openNew} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="w-4 h-4 mr-1" />Novo Usuário</Button>
      </div>

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground">{isNew ? 'Novo Usuário' : 'Editar Usuário'}</h3>
              <button onClick={close}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Nome</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1"><Label>E-mail</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="space-y-1">
                <Label>{isNew ? 'Senha' : 'Nova senha (deixe em branco para manter)'}</Label>
                <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                {isNew && <p className="text-xs text-muted-foreground">Mínimo 6 caracteres, com maiúscula, minúscula, número e caractere especial.</p>}
              </div>
              <div className="space-y-1">
                <Label>Perfil</Label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value as UserRoleApi })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground disabled:opacity-60"
                  disabled={!isNew}
                >
                  <option value="INTERN">Estagiário</option>
                  <option value="COORDINATOR">Coordenador</option>
                  {!isNew && form.role === 'ADMINISTRATOR' && <option value="ADMINISTRATOR">Administrador</option>}
                </select>
                {!isNew && <p className="text-xs text-muted-foreground">O perfil não pode ser alterado após a criação.</p>}
              </div>
              {form.role === 'INTERN' && (
                <div className="space-y-1">
                  <Label>Coordenador{isNew ? ' *' : ''}</Label>
                  <select
                    value={form.coordinatorId}
                    onChange={e => setForm({ ...form, coordinatorId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground"
                  >
                    <option value="">{isNew ? 'Selecione...' : 'Manter atual'}</option>
                    {coordenadores.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                  </select>
                </div>
              )}
              {!isNew && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.status} onChange={e => setForm({ ...form, status: e.target.checked })} id="ativo" />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={close}>Cancelar</Button>
              <Button onClick={save} disabled={saving} className="bg-accent text-accent-foreground">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">E-mail</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Perfil</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Coordenador</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Carregando...</td></tr>
              )}
              {!loading && users.map(u => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{roleLabelsApi[u.role]}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{u.coordinatorName === 'N/A' ? '—' : u.coordinatorName}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.status ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{u.status ? 'Ativo' : 'Inativo'}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(u)}><Pencil className="w-4 h-4" /></Button>
                      {u.status && (
                        <Button size="sm" variant="ghost" onClick={() => inactivate(u.id)} className="text-destructive hover:text-destructive" title="Desativar">
                          <Ban className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestaoUsuarios;
