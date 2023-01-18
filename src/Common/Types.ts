export interface ResponseType {
    code: number
    status: string
    result?: any
    errors?: any
}

export interface APIOptions {
    timeout?: number
    signal?: AbortSignal
    preventAutoLogout?: boolean
}

export interface TagType {
  key:string
  value?: string
  description?: string
  propagate: boolean
  isInvalidKey?: boolean
  isInvalidValue?: boolean
}

export interface OptionType {
    label: string;
    value: string;
}