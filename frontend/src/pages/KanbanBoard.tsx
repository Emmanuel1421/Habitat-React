import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCasos } from '@/contexts/CasosContext';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import { CaseStatus } from '@/types';
import { useNavigate } from 'react-router-dom';
import { GripVertical, User, Briefcase } from 'lucide-react';

const columns: { status: CaseStatus; label: string; colorClass: string }[] = [
  { status: 'triagem', label: 'Triagem', colorClass: 'bg-muted-foreground' },
  { status: 'documentacao', label: 'Documentação', colorClass: 'bg-warning' },
  { status: 'processo', label: 'Em Processo Judicial', colorClass: 'bg-info' },
  { status: 'finalizado', label: 'Finalizado', colorClass: 'bg-success' },
];

const KanbanBoard = () => {
  const { user } = useAuth();
  const { casos, loading, updateCaso } = useCasos();
  const { users, getUserName } = useUsers();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dragId, setDragId] = useState<string | null>(null);
  const [filterEquipe, setFilterEquipe] = useState('');

  const coordenadores = users.filter(u => u.role === 'COORDINATOR');

  const filtered = casos.filter(c => {
    if (user?.role === 'estagiario') return c.estagiarioId === user.id;
    if (user?.role === 'coordenador') return c.coordenadorId === user.id;
    return true;
  }).filter(c => !filterEquipe || c.coordenadorId === filterEquipe);

  const handleDragStart = (id: string) => setDragId(id);

  const handleDrop = async (status: CaseStatus) => {
    if (!dragId) return;
    const id = dragId;
    setDragId(null);
    try {
      await updateCaso(id, { status });
    } catch (err) {
      toast({
        title: 'Erro ao atualizar status',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mural de Casos</h1>
          <p className="text-sm text-muted-foreground">Arraste os cards para alterar o status</p>
        </div>
        {user?.role === 'master' && (
          <select value={filterEquipe} onChange={e => setFilterEquipe(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground">
            <option value="">Todas as equipes</option>
            {coordenadores.map(c => <option key={c.id} value={String(c.id)}>Equipe {c.name}</option>)}
          </select>
        )}
      </div>

      {loading && casos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Carregando casos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-[60vh]">
          {columns.map(col => {
            const colCasos = filtered.filter(c => c.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-muted/40 rounded-xl p-3 flex flex-col"
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(col.status)}
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={`w-3 h-3 rounded-full ${col.colorClass}`} />
                  <h3 className="font-semibold text-sm text-foreground">{col.label}</h3>
                  <span className="ml-auto text-xs bg-card text-muted-foreground px-2 py-0.5 rounded-full border border-border">{colCasos.length}</span>
                </div>
                <div className="space-y-2 flex-1">
                  {colCasos.map(c => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={() => handleDragStart(c.id)}
                      onClick={() => navigate(`/caso/${c.id}`)}
                      className="bg-card rounded-lg p-3 border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground/40 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{c.morador.nome}</p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{c.descricao}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {c.tipo === 'judicial' ? 'Judicial' : 'Conciliação'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {getUserName(c.estagiarioId)}</span>
                            <span className="text-muted-foreground/60">Coord: {getUserName(c.coordenadorId)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
