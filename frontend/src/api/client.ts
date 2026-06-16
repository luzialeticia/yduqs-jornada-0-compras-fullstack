const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: string[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    let details: string[] | undefined;
    try {
      const body = await res.json();
      if (Array.isArray(body.message)) {
        details = body.message;
        message = 'Alguns dados são inválidos.';
      } else if (typeof body.message === 'string') {
        message = body.message;
      }
    } catch {
      // resposta sem corpo JSON
    }
    throw new ApiError(res.status, message, details);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
