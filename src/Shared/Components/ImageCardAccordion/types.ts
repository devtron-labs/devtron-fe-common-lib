import React, { ReactNode } from 'react'
import { CDModalTabType, VulnerabilityType } from '../../../Common'
import { MaterialSecurityInfoType } from '../../types'

export interface ImageCardAccordionProps extends MaterialSecurityInfoType {
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
