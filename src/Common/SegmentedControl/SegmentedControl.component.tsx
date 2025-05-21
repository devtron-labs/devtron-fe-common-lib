import { useRef, useState } from 'react'

import { ComponentSizeType } from '@Shared/constants'

import Segment from './Segment'
import { SegmentedControlProps, SegmentType } from './types'

import './segmentedControl.scss'

const SegmentedControl = ({
    segments,
    onChange,
    name,
    size = ComponentSizeType.medium,
    value: controlledValue,
    fullWidth = false,
    disabled,
}: SegmentedControlProps) => {
    const isUnControlledComponent = controlledValue === undefined

    const segmentedControlRefContainer = useRef<HTMLDivElement>(null)
    /**
     * Using this ref to show the selected segment highlight with transition
     */
    const selectedSegmentRef = useRef<HTMLDivElement>(null)
    const [selectedSegmentValue, setSelectedSegmentValue] = useState<SegmentType['value'] | null>(segments[0].value)
    const segmentValue = isUnControlledComponent ? selectedSegmentValue : controlledValue

    const handleSegmentChange = (updatedSegment: SegmentType) => {
        if (isUnControlledComponent) {
            setSelectedSegmentValue(updatedSegment.value)
        }
        onChange?.(updatedSegment)
    }

    return (
        <div
            className={`segmented-control ${!fullWidth ? 'dc__inline-flex' : ''} ${disabled ? 'dc__disabled' : ''} br-6 ${size === ComponentSizeType.xs ? 'p-1' : 'p-2'}`}
        >
            <div
                className="segmented-control__container flex left dc__position-rel dc__align-items-center dc__gap-2"
                ref={segmentedControlRefContainer}
            >
                {segments.map((segment) => {
                    const isSelected = segment.value === segmentValue

                    return (
                        <Segment
                            selectedSegmentRef={isSelected ? selectedSegmentRef : undefined}
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
