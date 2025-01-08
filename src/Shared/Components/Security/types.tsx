import { CATEGORIES, SUB_CATEGORIES } from './SecurityModal/types'

export type ScanCategories = (typeof CATEGORIES)[keyof typeof CATEGORIES]
export type ScanSubCategories = (typeof SUB_CATEGORIES)[keyof typeof SUB_CATEGORIES]

export type CategoriesConfig = {
    imageScan: boolean
    codeScan: boolean
    kubernetesManifest: boolean
}

interface SecurityConfigCategoryType {
    label: string
    subCategories: ScanSubCategories[]
}

export interface GetSecurityConfigReturnType {
    imageScan?: SecurityConfigCategoryType
    codeScan?: SecurityConfigCategoryType
    kubernetesManifest?: SecurityConfigCategoryType
}
