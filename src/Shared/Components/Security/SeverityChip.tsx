import { capitalizeFirstLetter } from '@Common/Helper'

import { Badge } from '../Badge'
import { SeveritiesDTO } from './SecurityModal'

const SeverityChip = ({ severity, count }: { severity: SeveritiesDTO; count?: number }) => {
    const label = count ? `${count} ${capitalizeFirstLetter(severity)}` : capitalizeFirstLetter(severity)
    switch (severity) {
        case SeveritiesDTO.CRITICAL:
            return <Badge label={label} variant="negative" />
        case SeveritiesDTO.HIGH:
            return <Badge label={label} variant="custom" fontColor="R500" bgColor="R100" />
        case SeveritiesDTO.MEDIUM:
            return <Badge label={label} variant="custom" fontColor="O600" bgColor="O100" />
        case SeveritiesDTO.LOW:
            return <Badge label={label} variant="warning" />
        case SeveritiesDTO.UNKNOWN:
            return <Badge label={label} variant="neutral" />
        default:
            return <Badge label={label} />
    }
}

export default SeverityChip
