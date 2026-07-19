// Cliente HTTP central da aplicação.
// Usa fetch nativo (sem precisar adicionar axios como dependência nova).
// Anexa automaticamente o token JWT salvo no login e trata erros no formato
// do ExceptionGlobalHandler do backend: { message, error, timestamp }.

export const TOKEN_KEY = 'habitat_token';
export const USER_KEY = 'habitat_user';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getApiUrl(path: string): string {
  return `${API_URL}${path}`;
}

interface ApiFetchOptions extends RequestInit {
  /** Envia o header Authorization com o token salvo. Default: true */
  auth?: boolean;
}

/**
 * Faz uma requisição para a API e já retorna o corpo tipado.
 * Lança ApiError em caso de status >= 400.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...rest, headers: finalHeaders });
  } catch (networkError) {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique se o backend está rodando em ' + API_URL,
      0,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message = isJson && body && (body as { message?: string }).message
      ? (body as { message: string }).message
      : `Erro ${response.status}`;

    if (response.status === 401 && auth) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!path.startsWith('/auth/login') && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    throw new ApiError(message, response.status);
  }

  return body as T;
}

/** Monta uma querystring a partir de um objeto, ignorando valores undefined/null/''. */
export function buildQuery(params: Record<string, string | number | boolean | undefined | null>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.set(key, String(value));
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}
