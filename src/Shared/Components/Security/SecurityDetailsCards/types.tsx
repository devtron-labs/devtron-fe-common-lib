import { ScanResultDTO, SecurityModalPropsType, SeveritiesDTO } from '../SecurityModal/types'
import { ScanCategories, ScanSubCategories } from '../types'

export interface SecurityCardProps {
    category: ScanCategories
    subCategory: ScanSubCategories
    severities: Partial<Record<SeveritiesDTO, number>>
    handleCardClick: () => void
    scanFailed?: boolean
}

export interface SecurityDetailsCardsProps extends Pick<SecurityModalPropsType, 'Sidebar'> {
    scanResult: ScanResultDTO
}
