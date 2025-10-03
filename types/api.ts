export type ApiResult<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
};
