import { MaterialSecurityInfoType } from '../../types'

export interface VulnerabilitiesProps extends MaterialSecurityInfoType {
    artifactId: number
    applicationId: number
    environmentId: number
    setVulnerabilityCount: React.Dispatch<React.SetStateAction<number>>
}
