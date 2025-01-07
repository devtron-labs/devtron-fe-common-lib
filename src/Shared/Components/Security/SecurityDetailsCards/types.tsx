import {
    CATEGORIES,
    ScanResultDTO,
    SecurityModalPropsType,
    SeveritiesDTO,
    SUB_CATEGORIES,
} from '../SecurityModal/types'

type Categories = keyof typeof CATEGORIES
type SubCategories = keyof typeof SUB_CATEGORIES

export interface SecurityCardProps {
    category: (typeof CATEGORIES)[Categories]
    subCategory: (typeof SUB_CATEGORIES)[SubCategories]
    severityCount: Partial<Record<SeveritiesDTO, number>>
    handleCardClick: () => void
    rootClassName?: string
}

export interface SecurityDetailsCardsProps extends Pick<SecurityModalPropsType, 'Sidebar'> {
    scanResult: ScanResultDTO
}
