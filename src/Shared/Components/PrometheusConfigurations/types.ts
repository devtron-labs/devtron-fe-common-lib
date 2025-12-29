import { SyntheticEvent } from 'react'

import { AuthenticationType } from '@Shared/types'

interface ValueErrorType<T = string> {
    value: T
    error: string
}

export interface PromoetheusConfig {
    endpoint: ValueErrorType
    authType: ValueErrorType<AuthenticationType>
    userName: ValueErrorType
    password: ValueErrorType
    prometheusTlsClientKey: ValueErrorType
    prometheusTlsClientCert: ValueErrorType
}

export interface PromoetheusConfigProps {
    prometheusConfig: PromoetheusConfig
    handleOnChange: (event: SyntheticEvent) => void
    onPrometheusAuthTypeChange: (event: SyntheticEvent) => void
}
