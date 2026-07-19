import { getApiUrl, getToken } from '@/lib/api';
import { FileAttachmentResponse } from '@/types/api';

function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fileService = {
  upload: async (file: File, referenceId: string): Promise<FileAttachmentResponse> => {
    const form = new FormData();
    form.append('file', file);
    form.append('referenceId', referenceId);

    const response = await fetch(getApiUrl('/files/upload'), {
      method: 'POST',
      headers: authHeader(),
      body: form,
    });

    if (!response.ok) {
      let message = 'Erro ao enviar arquivo';
      try {
        const parsed = await response.json();
        message = parsed?.message || (typeof parsed === 'string' ? parsed : message);
      } catch {
        // ignora
      }
      throw new Error(message);
    }

    return response.json();
  },

  listByReference: async (referenceId: string): Promise<FileAttachmentResponse[]> => {
    const response = await fetch(getApiUrl(`/files/reference/${referenceId}`), {
      headers: authHeader(),
    });
    if (!response.ok) throw new Error('Erro ao buscar arquivos do caso');
    return response.json();
  },

  /** Baixa o arquivo (precisa de auth, por isso não dá pra usar <a href> direto). */
  download: async (id: number, fallbackName = 'arquivo'): Promise<void> => {
    const response = await fetch(getApiUrl(`/files/${id}`), { headers: authHeader() });
    if (!response.ok) throw new Error('Erro ao baixar arquivo');

    const disposition = response.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match ? match[1] : fallbackName;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};
