import { ApiError } from '../../infrastructure/http/ApiClient';

/** Mensaje legible para mostrar al usuario a partir de cualquier valor capturado en un `catch`. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return error instanceof Error && error.message ? error.message : 'Ocurrió un error inesperado.';
}
