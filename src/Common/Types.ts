
export interface ResponseType {
  code: number;
  status: string;
  result?: any;
  errors?: any;
}

export interface APIOptions {
  timeout?: number;
  signal?: AbortSignal;
  preventAutoLogout?: boolean;
}