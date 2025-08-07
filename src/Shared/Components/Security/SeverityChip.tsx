/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
