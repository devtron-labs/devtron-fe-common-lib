import { ReactNode } from 'react'
import { Placement } from 'tippy.js'

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
    heading: string
    infoText: string
    iconClass?: string
    documentationLink?: string
    documentationLinkText?: string
    additionalContent?: ReactNode
    placement?: Placement
    className?: string
    dataTestid?: string
}
