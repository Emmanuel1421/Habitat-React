import { useCallback, useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import { UserResponse } from '@/types/api';

export function useUsers() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.list();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getUserName = useCallback(
    (id: string | number | undefined | null) => {
      if (!id) return '';
      return users.find((u) => String(u.id) === String(id))?.name || '';
    },
    [users],
  );

  return { users, loading, error, refresh, getUserName };
}
