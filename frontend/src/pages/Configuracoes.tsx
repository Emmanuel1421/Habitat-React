import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bell, Sun } from 'lucide-react';

const Configuracoes = () => {
  const { toast } = useToast();
  
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesSistema, setNotificacoesSistema] = useState(true);

  const handleSavePreferences = () => {
    toast({ 
      title: 'Configurações salvas', 
      description: 'As suas preferências gerais foram atualizadas.' 
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Ajuste as preferências do sistema</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Aparência</h2>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <Label className="text-base">Modo de Exibição</Label>
              <p className="text-sm text-muted-foreground">O sistema está fixo no modo claro padrão.</p>
            </div>
            <div className="px-3 py-1 bg-muted rounded-full text-xs font-medium">Light Mode</div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notificações</h2>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <Label className="text-base cursor-pointer" htmlFor="notif-email">Notificações por E-mail</Label>
              <p className="text-sm text-muted-foreground">Receba updates de casos no seu e-mail.</p>
            </div>
            <input 
              id="notif-email"
              type="checkbox" 
              checked={notificacoesEmail} 
              onChange={(e) => setNotificacoesEmail(e.target.checked)} 
              className="w-5 h-5 accent-accent cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <Label className="text-base cursor-pointer" htmlFor="notif-sis">Notificações no Sistema</Label>
              <p className="text-sm text-muted-foreground">Exibir alertas flutuantes no canto do ecrã.</p>
            </div>
            <input 
              id="notif-sis"
              type="checkbox" 
              checked={notificacoesSistema} 
              onChange={(e) => setNotificacoesSistema(e.target.checked)} 
              className="w-5 h-5 accent-accent cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSavePreferences} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Salvar Preferências
        </Button>
      </div>
    </div>
  );
};

export default Configuracoes;