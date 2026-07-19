import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCasos } from '@/contexts/CasosContext';
import { useUsers } from '@/hooks/useUsers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const statusLabels: Record<string, string> = {
  triagem: 'Triagem', documentacao: 'Documentação', processo: 'Em Processo', finalizado: 'Finalizado',
};
const statusColors = ['#8B95A5', '#EAB308', '#3B82F6', '#22C55E'];

const Relatorios = () => {
  const { user } = useAuth();
  const { casos } = useCasos();
  const { users } = useUsers();

  const filtered = casos.filter(c => {
    if (user?.role === 'master') return true;
    if (user?.role === 'coordenador') return c.coordenadorId === user.id;
    return c.estagiarioId === user?.id;
  });

  const byStatus = ['triagem', 'documentacao', 'processo', 'finalizado'].map(s => ({
    name: statusLabels[s], value: filtered.filter(c => c.status === s).length,
  }));

  const estagiarios = users.filter(u => u.role === 'INTERN');
  const byEstagiario = estagiarios.map(e => ({
    name: e.name.split(' ')[0], value: filtered.filter(c => c.estagiarioId === String(e.id)).length,
  }));

  const coordenadores = users.filter(u => u.role === 'COORDINATOR');
  const byCoordenador = coordenadores.map(c => ({
    name: c.name.split(' ')[0], value: filtered.filter(cs => cs.coordenadorId === String(c.id)).length,
  }));

  const finalizados = filtered.filter(c => c.status === 'finalizado');
  const avgDays = finalizados.length > 0
    ? Math.round(finalizados.reduce((acc, c) => {
        const d1 = new Date(c.dataCriacao).getTime();
        const d2 = new Date(c.dataAtualizacao).getTime();
        return acc + (d2 - d1) / (1000 * 60 * 60 * 24);
      }, 0) / finalizados.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Visão analítica dos casos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total de Casos</p>
          <p className="text-3xl font-bold text-foreground">{filtered.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Finalizados</p>
          <p className="text-3xl font-bold text-success">{finalizados.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Tempo Médio de Resolução</p>
          <p className="text-3xl font-bold text-foreground">{avgDays} <span className="text-base font-normal text-muted-foreground">dias</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Casos por Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {byStatus.map((_, i) => <Cell key={i} fill={statusColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Casos por Estagiário</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byEstagiario}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Casos por Coordenador</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byCoordenador}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
