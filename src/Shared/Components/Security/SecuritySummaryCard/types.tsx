import { SeverityCount } from '@Shared/types'
import { ImageCardAccordionProps } from '@Shared/Components/ImageCardAccordion/types'
import { ScanResultDTO } from '../SecurityModal'

export type SecuritySummaryCardProps = {
    severityCount: SeverityCount
    scanToolId: number
    rootClassName?: string
    responseData: ScanResultDTO
    hidePolicy?: boolean
} & Pick<ImageCardAccordionProps, 'SecurityModalSidebar'>
