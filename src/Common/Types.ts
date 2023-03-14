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

export interface OptionType {
    label: string
    value: string
}

export enum TippyTheme {
    black = 'black',
    white = 'white',
}
export interface TeamList extends ResponseType {
    result: Teams[]
}

export interface Teams {
    id: number
    name: string
    active: boolean
}
