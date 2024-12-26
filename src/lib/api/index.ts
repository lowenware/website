export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiErrorCode = 'validation-error' | 'internal-error' | 'rate-limited';

export type ApiResponse<T> =
  | { data: T }
  | {
      code: ApiErrorCode;
      data: { message?: string; fields?: ApiFieldError[] };
    };

export function ok<T>(data: T): ApiResponse<T> {
  return { data };
}

export function fail(
  code: ApiErrorCode,
  data: { message?: string; fields?: ApiFieldError[] } = {}
): ApiResponse<never> {
  return { code, data };
}
