import { getApiUrl, getToken } from '@/lib/api';
import { GenerateDocumentRequest } from '@/types/api';

export interface GeneratedDocument {
  blob: Blob;
  filename: string;
}

export const documentService = {
  generate: async (data: GenerateDocumentRequest): Promise<GeneratedDocument> => {
    const token = getToken();
    const response = await fetch(getApiUrl('/documents/generate'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let message = `Erro ${response.status} ao gerar documento`;
      try {
        const parsed = await response.json();
        if (parsed?.message) message = parsed.message;
      } catch {
        // corpo não era JSON, mantém mensagem genérica
      }
      throw new Error(message);
    }

    const blob = await response.blob();
    const disposition = response.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match ? match[1] : `documento.${data.format.toLowerCase()}`;

    return { blob, filename };
  },

  /** Dispara o download do arquivo gerado no navegador. */
  triggerDownload: ({ blob, filename }: GeneratedDocument) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};
