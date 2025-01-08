import { SECURITY_CONFIG } from './constants'
import { ScanResultDTO, SeveritiesDTO } from './SecurityModal'
import { CATEGORIES, SUB_CATEGORIES } from './SecurityModal/types'
import { CategoriesConfig, SecurityConfigType, ScanCategories, ScanSubCategories } from './types'

export const getCVEUrlFromCVEName = (cveName: string): string =>
    `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveName}`

export const getTotalSeverities = (severityCount: Partial<Record<SeveritiesDTO, number>>) =>
    Object.entries(severityCount)
        .filter(([key]) => key !== SeveritiesDTO.SUCCESSES)
        .reduce((acc, [, value]) => acc + value, 0)

export const getSecurityConfig = ({
    imageScan,
    codeScan,
    kubernetesManifest,
}: CategoriesConfig): SecurityConfigType => ({
    ...(imageScan && {
        [CATEGORIES.IMAGE_SCAN]: SECURITY_CONFIG.imageScan,
    }),
    ...(codeScan && {
        [CATEGORIES.CODE_SCAN]: SECURITY_CONFIG.codeScan,
    }),
    ...(kubernetesManifest && {
        [CATEGORIES.KUBERNETES_MANIFEST]: SECURITY_CONFIG.kubernetesManifest,
    }),
})

export const getSecurityThreatsArray = (scanResult: ScanResultDTO): Partial<Record<SeveritiesDTO, number>>[] => {
    const { imageScan, codeScan, kubernetesManifest } = scanResult
    const DYNAMIC_SECURITY_CONFIG = getSecurityConfig({
        imageScan: !!imageScan,
        codeScan: !!codeScan,
        kubernetesManifest: !!kubernetesManifest,
    })

    const threatsArray: Partial<Record<SeveritiesDTO, number>>[] = []

    Object.keys(DYNAMIC_SECURITY_CONFIG).forEach((category: ScanCategories) => {
        DYNAMIC_SECURITY_CONFIG[category].subCategories.forEach((subCategory: ScanSubCategories) => {
            const severity =
                subCategory === SUB_CATEGORIES.MISCONFIGURATIONS
                    ? scanResult[category][subCategory]?.misConfSummary?.status
                    : scanResult[category][subCategory]?.summary?.severities
            threatsArray.push(severity)
        })
    })

    return threatsArray
}
