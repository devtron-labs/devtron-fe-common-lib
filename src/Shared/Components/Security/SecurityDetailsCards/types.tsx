import { ScanResultDTO, SecurityModalPropsType, SeveritiesDTO } from '../SecurityModal/types'
import { ScanCategories, ScanSubCategories } from '../types'

export interface SecurityCardProps {
    category: ScanCategories
    subCategory: ScanSubCategories
    severityCount: Partial<Record<SeveritiesDTO, number>>
    handleCardClick: () => void
    rootClassName?: string
}

export interface SecurityDetailsCardsProps extends Pick<SecurityModalPropsType, 'Sidebar'> {
    scanResult: ScanResultDTO
}
