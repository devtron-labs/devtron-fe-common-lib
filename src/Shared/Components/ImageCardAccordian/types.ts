import { ReactNode } from 'react'
import { VulnerabilityType } from '../../../Common'

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
