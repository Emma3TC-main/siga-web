import { DomainError, NotFoundError, ValidationError } from '../../domain/errors';

export class ApiError extends DomainError {
  constructor(message: string, public readonly status: number, public readonly data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  static tokenProvider: (() => string | null) | null = null;
  static refreshHandler: (() => Promise<boolean>) | null = null;
  static onAuthLost: (() => void) | null = null;

  constructor(private readonly baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:8080') {}

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(path: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
  }

  async put<T>(path: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
  }

  async patch<T>(path: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
  }

  async postForm<T>(path: string, form: FormData, headers?: HeadersInit): Promise<T> {
    return this.request<T>(path, { method: 'POST', body: form, headers });
  }

  async download(path: string): Promise<{ blob: Blob; filename: string }> {
    const headers = new Headers();
    const token = ApiClient.tokenProvider ? ApiClient.tokenProvider() : null;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('X-Correlation-ID', crypto.randomUUID());
    const response = await fetch(`${this.baseUrl}${path}`, { headers });
    if (!response.ok) await this.handleError(response);
    const disposition = response.headers.get('Content-Disposition') ?? '';
    const filename = /filename\*?=(?:UTF-8''|\")?([^;\"]+)/i.exec(disposition)?.[1]
      ? decodeURIComponent(/filename\*?=(?:UTF-8''|\")?([^;\"]+)/i.exec(disposition)![1])
      : 'evidencia';
    return { blob: await response.blob(), filename };
  }

  private async request<T>(path: string, options: RequestInit, isRetry = false): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = new Headers(options.headers);

    // Auth token from explicit provider
    const token = ApiClient.tokenProvider ? ApiClient.tokenProvider() : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Default correlation ID if not provided
    if (!headers.has('X-Correlation-ID')) {
      headers.set('X-Correlation-ID', crypto.randomUUID());
    }

    try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 401 && !isRetry && ApiClient.refreshHandler) {
        const refreshed = await ApiClient.refreshHandler();
        if (refreshed) {
          // Si el refresh fue exitoso, reintenta request una vez sin pasar los headers antiguos de auth
          const newOptions = { ...options };
          const retryHeaders = new Headers(options.headers);
          retryHeaders.delete('Authorization');
          newOptions.headers = retryHeaders;
          return this.request<T>(path, newOptions, true);
        } else {
          // Refresh falló
          if (ApiClient.onAuthLost) ApiClient.onAuthLost();
        }
      } else if (response.status === 401) {
        if (ApiClient.onAuthLost) ApiClient.onAuthLost();
      }

      if (!response.ok) {
        await this.handleError(response);
      }

      if (response.status === 204 || response.status === 205) {
        return undefined as any;
      }

      const responseBody = await response.text();
      if (!responseBody.trim()) {
        return undefined as any;
      }

      try {
        return JSON.parse(responseBody) as T;
      } catch {
        throw new ApiError('Invalid JSON response', response.status);
      }
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new ApiError(error instanceof Error ? error.message : 'Network error', 0);
    }
  }

  private async handleError(response: Response): Promise<never> {
    let data;
    try {
      data = await response.json();
    } catch {
      // Not JSON
    }

    if (response.status === 404) {
      throw new NotFoundError('Recurso', 'solicitado');
    }

    if (response.status === 400 && data && data.title === 'Constraint Violation') {
      const fields: Record<string, string> = {};
      if (Array.isArray(data.violations)) {
        data.violations.forEach((v: any) => {
          fields[v.field] = v.message;
        });
      }
      throw new ValidationError('Validation failed', fields);
    }

    throw new ApiError(data?.detail || response.statusText, response.status, data);
  }
}
