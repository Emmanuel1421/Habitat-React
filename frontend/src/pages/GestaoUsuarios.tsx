import React, { useState } from 'react';
import { mockUsers } from '@/data/mockData';
import { User, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const roleLabels: Record<UserRole, string> = { master: 'Administrador', coordenador: 'Coordenador', estagiario: 'Estagiário' };

const GestaoUsuarios = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editing, setEditing] = useState<User | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const emptyUser: User = { id: '', nome: '', email: '', role: 'estagiario', ativo: true };

  const openNew = () => { setEditing({ ...emptyUser, id: `u${Date.now()}` }); setIsNew(true); };
  const openEdit = (u: User) => { setEditing({ ...u }); setIsNew(false); };
  const close = () => { setEditing(null); setIsNew(false); };

  const save = () => {
    if (!editing) return;
    if (isNew) {
      setUsers(prev => [...prev, editing]);
      toast({ title: 'Usuário criado' });
    } else {
      setUsers(prev => prev.map(u => u.id === editing.id ? editing : u));
      toast({ title: 'Usuário atualizado' });
    }
    close();
  };

  const remove = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({ title: 'Usuário removido' });
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
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground">{isNew ? 'Novo Usuário' : 'Editar Usuário'}</h3>
              <button onClick={close}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Nome</Label><Input value={editing.nome} onChange={e => setEditing({ ...editing, nome: e.target.value })} /></div>
              <div className="space-y-1"><Label>E-mail</Label><Input value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} /></div>
              <div className="space-y-1">
                <Label>Perfil</Label>
                <select value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value as UserRole })} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground">
                  <option value="estagiario">Estagiário</option>
                  <option value="coordenador">Coordenador</option>
                  <option value="master">Administrador</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editing.ativo} onChange={e => setEditing({ ...editing, ativo: e.target.checked })} id="ativo" />
                <Label htmlFor="ativo">Ativo</Label>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={close}>Cancelar</Button>
              <Button onClick={save} className="bg-accent text-accent-foreground">Salvar</Button>
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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{u.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{roleLabels[u.role]}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.ativo ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{u.ativo ? 'Ativo' : 'Inativo'}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(u)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(u.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
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
