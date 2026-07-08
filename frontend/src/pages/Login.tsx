import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Scale, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      toast({
        title: 'Erro de autenticação',
        description: 'E-mail ou senha inválidos. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">Sistema Habitat</h1>
          <p className="text-primary-foreground/60 text-sm mt-1">Gestão Jurídica de Projetos Sociais</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 shadow-xl space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input id="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Entrar</Button>

          <p className="text-center text-xs text-muted-foreground">
            Esqueceu a senha? Entre em contato com o administrador.
          </p>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground text-center mb-2">Contas de demonstração:</p>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Master:</span> carlos@habitat.org</p>
              <p><span className="font-medium text-foreground">Coordenador:</span> ana@habitat.org</p>
              <p><span className="font-medium text-foreground">Estagiário:</span> mariana@habitat.org</p>
              <p className="text-muted-foreground/70 mt-1">Qualquer senha funciona</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
