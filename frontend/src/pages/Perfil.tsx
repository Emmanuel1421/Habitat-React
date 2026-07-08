import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Mail, Shield } from 'lucide-react';

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ nome, email });
    toast({ 
      title: 'Perfil updated', 
      description: 'Suas informações foram salvas com sucesso.' 
    });
  };

  const roleLabels: Record<string, string> = {
    master: 'Administrador',
    coordenador: 'Coordenador',
    estagiario: 'Estagiário'
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user?.nome}</h2>
            <p className="text-sm text-muted-foreground">{roleLabels[user?.role || '']}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="pl-9" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nível de Acesso</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={roleLabels[user?.role || '']} disabled className="pl-9 bg-muted cursor-not-allowed" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">O nível de acesso só pode ser alterado por um Administrador.</p>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Perfil;