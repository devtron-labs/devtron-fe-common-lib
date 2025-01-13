import { CATEGORY_LABELS } from './SecurityModal'
import { CATEGORIES, SUB_CATEGORIES } from './SecurityModal/types'
import { SecurityConfigType } from './types'

export const SECURITY_CONFIG: SecurityConfigType = {
    [CATEGORIES.IMAGE_SCAN]: {
        label: CATEGORY_LABELS.IMAGE_SCAN,
        subCategories: [SUB_CATEGORIES.VULNERABILITIES, SUB_CATEGORIES.LICENSE],
    },
    [CATEGORIES.CODE_SCAN]: {
        label: CATEGORY_LABELS.CODE_SCAN,
        subCategories: [
            SUB_CATEGORIES.VULNERABILITIES,
            SUB_CATEGORIES.LICENSE,
            SUB_CATEGORIES.MISCONFIGURATIONS,
            SUB_CATEGORIES.EXPOSED_SECRETS,
        ],
    },
    [CATEGORIES.KUBERNETES_MANIFEST]: {
        label: CATEGORY_LABELS.KUBERNETES_MANIFEST,
        subCategories: [SUB_CATEGORIES.MISCONFIGURATIONS, SUB_CATEGORIES.EXPOSED_SECRETS],
    },
}
