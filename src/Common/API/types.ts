import { APIOptions } from '..'

export interface CoreAPIConstructorParamsType {
    handleLogout: () => void
    handleRedirectToLicenseActivation?: () => void
    /**
     * @default Host
     */
    host?: string
    /**
     * @default FALLBACK_REQUEST_TIMEOUT
     */
    timeout?: number
}

export interface FetchInTimeParamsType<Data = object> {
    url: string
    type: 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE'
    data: Data
    options?: APIOptions
    isMultipartRequest?: boolean
}

export interface FetchAPIParamsType<Data = object> extends Omit<FetchInTimeParamsType<Data>, 'options'> {
    signal: AbortSignal
    /**
     * @default false
     */
    preventAutoLogout?: boolean
    /**
     * @default false
     */
    preventLicenseRedirect?: boolean
}
