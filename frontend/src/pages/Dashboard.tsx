import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCasos } from '@/contexts/CasosContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusLabels: Record<string, string> = {
  triagem: 'Triagem',
  documentacao: 'Documentação',
  processo: 'Em Processo',
  finalizado: 'Finalizado',
};

const statusColors = ['#8B95A5', '#EAB308', '#3B82F6', '#22C55E'];

const Dashboard = () => {
  const { user } = useAuth();
  const { casos, loading } = useCasos();
  const navigate = useNavigate();

  const filteredCasos = casos.filter(c => {
    if (user?.role === 'master') return true;
    if (user?.role === 'coordenador') return c.coordenadorId === user.id;
    return c.estagiarioId === user?.id;
  });

  const byStatus = ['triagem', 'documentacao', 'processo', 'finalizado'].map(s => ({
    name: statusLabels[s],
    value: filteredCasos.filter(c => c.status === s).length,
  }));

  const andamento = filteredCasos.filter(c => c.status !== 'finalizado').length;
  const finalizados = filteredCasos.filter(c => c.status === 'finalizado').length;

  const stats = [
    { label: 'Total de Casos', value: filteredCasos.length, icon: Briefcase, color: 'bg-primary' },
    { label: 'Em Andamento', value: andamento, icon: Clock, color: 'bg-info' },
    { label: 'Finalizados', value: finalizados, icon: CheckCircle2, color: 'bg-success' },
    { label: 'Em Triagem', value: filteredCasos.filter(c => c.status === 'triagem').length, icon: AlertTriangle, color: 'bg-warning' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Bem-vindo(a), {user?.nome}</p>
      </div>

      {loading && casos.length === 0 && (
        <p className="text-sm text-muted-foreground">Carregando dados...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Casos por Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {byStatus.map((_, i) => <Cell key={i} fill={statusColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Distribuição</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={byStatus.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {byStatus.map((_, i) => <Cell key={i} fill={statusColors[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent cases */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Casos Recentes</h3>
          <button onClick={() => navigate('/kanban')} className="text-sm text-accent hover:underline">Ver todos</button>
        </div>
        <div className="divide-y divide-border">
          {filteredCasos.slice(0, 5).map(c => (
            <div key={c.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate(`/caso/${c.id}`)}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{c.morador.nome}</p>
                <p className="text-sm text-muted-foreground truncate">{c.descricao}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium status-${c.status}`}>
                {statusLabels[c.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
