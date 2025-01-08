import { CATEGORIES, SUB_CATEGORIES } from './SecurityModal/types'

export type ScanCategories = (typeof CATEGORIES)[keyof typeof CATEGORIES]
export type ScanSubCategories = (typeof SUB_CATEGORIES)[keyof typeof SUB_CATEGORIES]
