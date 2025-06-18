import { capitalizeFirstLetter } from '@Common/Helper'
import { ComponentSizeType } from '@Shared/constants'

import { Badge, BadgeProps } from '../Badge'
import { SeveritiesDTO } from './SecurityModal'

const SeverityChip = ({ severity, count }: { severity: SeveritiesDTO; count?: number }) => {
    const label = count ? `${count} ${capitalizeFirstLetter(severity)}` : capitalizeFirstLetter(severity)
    const commonProps: Pick<BadgeProps, 'size' | 'label'> = {
        size: ComponentSizeType.xxs,
        label,
    }
    switch (severity) {
        case SeveritiesDTO.CRITICAL:
            return <Badge {...commonProps} variant="negative" />
        case SeveritiesDTO.HIGH:
            return <Badge {...commonProps} variant="custom" fontColor="R500" bgColor="R100" />
        case SeveritiesDTO.MEDIUM:
            return <Badge {...commonProps} variant="custom" fontColor="O600" bgColor="O100" />
        case SeveritiesDTO.LOW:
            return <Badge {...commonProps} variant="warning" />
        case SeveritiesDTO.UNKNOWN:
            return <Badge {...commonProps} variant="neutral" />
        default:
            return <Badge {...commonProps} />
    }
}

export default SeverityChip
