import { ReactNode } from 'react'

export interface RuntimeParamsAPIResponseType {
    envVariables: Record<string, string>
}

export interface RuntimeParamsTriggerPayloadType {
    runtimeParams: RuntimeParamsAPIResponseType
}

export enum CIMaterialSidebarType {
    CODE_SOURCE = 'Code Source',
    PARAMETERS = 'Parameters',
}

export interface InfoIconTippyType {
    titleText: string
    infoText: string
    documentationLink?: string
    additionalContent?: ReactNode
    variant?: string
}
