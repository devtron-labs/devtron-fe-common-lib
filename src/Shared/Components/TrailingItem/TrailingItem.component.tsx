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

import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonProps, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { NumbersCount } from '../NumbersCount'
import { DTSwitch, DTSwitchProps } from '../Switch'
import { TrailingItemProps } from './types'

const TrailingItem = ({ type, config, variant = 'neutral' }: TrailingItemProps) => {
    const isNegativeType = variant === 'negative'

    const handleTrailingSwitchChange: DTSwitchProps['onChange'] = (e) => {
        if (type === 'switch') {
            const { onChange } = config
            e.stopPropagation()
            onChange(e)
        }
    }

    const handleTrailingButtonClick: ButtonProps['onClick'] = (e) => {
        e.stopPropagation()
        if (type === 'button' && config.onClick) {
            config.onClick(e)
        }
    }

    switch (type) {
        case 'icon':
            return (
                <span className="mt-2 flex dc__no-shrink">
                    <Icon {...config} color={config.color || (isNegativeType ? 'R500' : 'N800')} />
                </span>
            )
        case 'text': {
            const { value, icon } = config
            return (
                <span className="flex dc__gap-2 mt-2">
                    <span className="fs-12 lh-1-5 fw-4 cn-7">{value}</span>
                    {icon && <Icon name={icon.name} color={icon.color || (isNegativeType ? 'R500' : 'N700')} />}
                </span>
            )
        }
        case 'counter':
            return <NumbersCount count={config.value} isSelected={config.isSelected} />
        case 'switch':
            return <DTSwitch {...config} onChange={handleTrailingSwitchChange} size={ComponentSizeType.small} />
        case 'button':
            return (
                <Button
                    {...(config as ButtonProps)}
                    onClick={handleTrailingButtonClick}
                    variant={ButtonVariantType.borderLess}
                    size={ComponentSizeType.xxs}
                />
            )
        default:
            return null
    }
}

export default TrailingItem
