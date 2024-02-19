import React, { ReactNode } from 'react'
import { CDModalTabType, VulnerabilityType } from '../../../Common'

export interface ImageCardAccordionProps {
    isSecurityModuleInstalled: boolean
    artifactId: number
    applicationId: number
    environmentId: number
    changesCard: ReactNode
    isScanned: boolean
    isScanEnabled: boolean
}

export interface SecurityDetailsType {
    vulnerabilities: VulnerabilityType[]
    scanToolId: number
    lastExecution: string
}

export interface AccordionItemProps {
    currentTab: CDModalTabType
    activeTab: CDModalTabType
    setActiveTab: React.Dispatch<React.SetStateAction<CDModalTabType>>
    buttonText: string
}
