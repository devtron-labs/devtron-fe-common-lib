import { useState } from 'react'
import { SelectPickerOptionType } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

type SegmentType = Pick<SelectPickerOptionType, 'label' | 'value' | 'startIcon' | 'tooltipProps'>

export interface NSegmentedControlProps {
    segments: SegmentType[]
    // initialSelectedTab: TabType['value']
    onChange?: (selectedTab: SegmentType) => void
    // disabled?: boolean
    name: string
    size?: Extract<ComponentSizeType, ComponentSizeType.xs | ComponentSizeType.small | ComponentSizeType.medium>
}

export const COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP: Record<NSegmentedControlProps['size'], string> = {
    [ComponentSizeType.xs]: 'py-1 px-5',
    [ComponentSizeType.small]: 'py-1 px-5',
    [ComponentSizeType.medium]: 'py-3 px-7',
} as const

const NSegmentedControl = ({ segments, onChange, name, size = ComponentSizeType.medium }: NSegmentedControlProps) => {
    const [selectedSegmentValue, setSelectedSegmentValue] = useState<SegmentType['value'] | null>(segments[0].value)

    const handleSegmentChange = (updatedSegment: SegmentType) => {
        setSelectedSegmentValue(updatedSegment.value)
        onChange?.(updatedSegment)
    }

    return (
        <div>
            <div
                className={`dc__inline-flex dc__content-center dc__align-items-center dc__gap-2 br-6 bg__tertiary ${size === ComponentSizeType.xs ? 'p-1' : 'p-2'}`}
            >
                {segments.map((segment) => {
                    const isSelected = segment.value === selectedSegmentValue

                    return (
                        <div
                            key={segment.value}
                            // className={`segment ${i === activeIndex ? 'active' : 'inactive'}`}
                            // ref={item.ref}
                            className="dc__position-rel dc__text-center"
                        >
                            <input
                                type="radio"
                                value={segment.value}
                                id={`${name}-${segment.value}`}
                                name={name}
                                onChange={() => handleSegmentChange(segment)}
                                checked={isSelected}
                                className="dc__opacity-0 m-0-imp dc__top-0 dc__left-0 dc__position-abs dc__bottom-0 dc__right-0 w-100 pointer h-100"
                            />
                            <label
                                htmlFor={`${name}-${segment.value}`}
                                className={`pointer m-0 dc__block br-4 flex py-1 px-5 flex dc__gap-4 ${isSelected ? 'bg__primary' : ''} ${COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP[size]}`}
                                style={
                                    isSelected
                                        ? {
                                              border: '1px solid var(--border-secondary)',
                                              boxShadow: '0px 1px 2px 0px var(--black-20)',
                                          }
                                        : {}
                                }
                            >
                                {segment.label}
                            </label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default NSegmentedControl
