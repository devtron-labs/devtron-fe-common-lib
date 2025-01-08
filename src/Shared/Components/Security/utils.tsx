import { CATEGORY_LABELS, ScanResultDTO, SeveritiesDTO } from './SecurityModal'
import { CATEGORIES, SUB_CATEGORIES } from './SecurityModal/types'
import { CategoriesConfig, GetSecurityConfigReturnType, ScanCategories, ScanSubCategories } from './types'

export const getCVEUrlFromCVEName = (cveName: string): string =>
    `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveName}`

export const getTotalSeverities = (severityCount: Partial<Record<SeveritiesDTO, number>>) =>
    Object.entries(severityCount)
        .filter(([key]) => key !== SeveritiesDTO.SUCCESSES)
        .reduce((acc, [, value]) => acc + value, 0)

export const getSecurityConfig = (categoriesConfig: CategoriesConfig): GetSecurityConfigReturnType => {
    const { imageScan, codeScan, kubernetesManifest } = categoriesConfig

    return {
        ...(imageScan && {
            [CATEGORIES.IMAGE_SCAN]: {
                label: CATEGORY_LABELS.IMAGE_SCAN,
                subCategories: [SUB_CATEGORIES.VULNERABILITIES, SUB_CATEGORIES.LICENSE],
            },
        }),
        ...(codeScan && {
            [CATEGORIES.CODE_SCAN]: {
                label: CATEGORY_LABELS.CODE_SCAN,
                subCategories: [
                    SUB_CATEGORIES.VULNERABILITIES,
                    SUB_CATEGORIES.LICENSE,
                    SUB_CATEGORIES.MISCONFIGURATIONS,
                    SUB_CATEGORIES.EXPOSED_SECRETS,
                ],
            },
        }),
        ...(kubernetesManifest && {
            [CATEGORIES.KUBERNETES_MANIFEST]: {
                label: CATEGORY_LABELS.KUBERNETES_MANIFEST,
                subCategories: [SUB_CATEGORIES.MISCONFIGURATIONS, SUB_CATEGORIES.EXPOSED_SECRETS],
            },
        }),
    }
}

export const getSecurityThreatsArray = (scanResult: ScanResultDTO): Partial<Record<SeveritiesDTO, number>>[] => {
    const { imageScan, codeScan, kubernetesManifest } = scanResult
    const SECURITY_CONFIG = getSecurityConfig({
        imageScan: !!imageScan,
        codeScan: !!codeScan,
        kubernetesManifest: !!kubernetesManifest,
    })

    const threatsArray: Partial<Record<SeveritiesDTO, number>>[] = []

    Object.keys(SECURITY_CONFIG).forEach((category: ScanCategories) => {
        SECURITY_CONFIG[category].subCategories.forEach((subCategory: ScanSubCategories) => {
            const severity =
                subCategory === SUB_CATEGORIES.MISCONFIGURATIONS
                    ? scanResult[category][subCategory]?.misConfSummary?.status
                    : scanResult[category][subCategory]?.summary?.severities
            threatsArray.push(severity)
        })
    })

    return threatsArray
}
