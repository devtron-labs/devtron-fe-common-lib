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

import { useState } from 'react'

import { ComponentSizeType } from '@Shared/constants'

import Segment from './Segment'
import { SegmentedControlProps, SegmentType } from './types'

import './segmentedControl.scss'

const SegmentedControl = <T extends string | number>({
    segments,
    onChange,
    name,
    size = ComponentSizeType.medium,
    value: controlledValue,
    fullWidth = false,
    disabled,
}: SegmentedControlProps<T>) => {
    const isUnControlledComponent = controlledValue === undefined
    const [selectedSegmentValue, setSelectedSegmentValue] = useState<SegmentType<T>['value'] | null>(segments[0].value)
    const segmentValue = isUnControlledComponent ? selectedSegmentValue : controlledValue

    const handleSegmentChange = (updatedSegment: SegmentType<T>) => {
        if (isUnControlledComponent) {
            setSelectedSegmentValue(updatedSegment.value)
        }
        onChange?.(updatedSegment)
    }

    return (
        <div
            className={`segmented-control ${!fullWidth ? 'dc__inline-flex' : ''} ${disabled ? 'dc__disabled' : ''} br-6 ${size === ComponentSizeType.xs ? 'p-1' : 'p-2'}`}
        >
            <div className="segmented-control__container flex left dc__position-rel dc__align-items-center dc__gap-2">
                {segments.map((segment) => {
                    const isSelected = segment.value === segmentValue

                    return (
                        <Segment
                            segment={segment}
                            key={segment.value}
                            name={name}
                            onChange={handleSegmentChange}
                            isSelected={isSelected}
                            fullWidth={fullWidth}
                            size={size}
                            disabled={disabled || segment.isDisabled}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default SegmentedControl
