import { ReactElement, useEffect, useRef, useState } from 'react'
import { Icon, IconsProps, SelectPickerOptionType } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import './segmentedControl.scss'
import { ConditionalWrap, Tooltip, TooltipProps } from '..'

type SegmentTooltipProps = Omit<
    TooltipProps,
    'alwaysShowTippyOnHover' | 'showOnTruncate' | 'shortcutKeyCombo' | 'placement'
>

type SegmentType = Pick<SelectPickerOptionType, 'value'> & {
    isError?: boolean
    icon?: IconsProps['name']
} & (
        | ({
              label: SelectPickerOptionType['label']
              icon?: IconsProps['name']
              tooltipProps?: SegmentTooltipProps
              ariaLabel?: never
          } & Pick<SelectPickerOptionType, 'label'>)
        | {
              label?: never
              tooltipProps: SegmentTooltipProps
              icon: IconsProps['name']
              ariaLabel: string
          }
    )

export interface NSegmentedControlProps {
    segments: SegmentType[]
    /**
     * If defined, the component is controlled
     */
    value?: SegmentType['value']
    onChange?: (selectedTab: SegmentType) => void
    name: string
    size?: Extract<ComponentSizeType, ComponentSizeType.xs | ComponentSizeType.small | ComponentSizeType.medium>
    fullWidth?: boolean
}

export const COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP: Record<NSegmentedControlProps['size'], string> = {
    [ComponentSizeType.xs]: 'py-2 px-6 fs-12 lh-18',
    [ComponentSizeType.small]: 'py-2 px-6 fs-12 lh-20',
    [ComponentSizeType.medium]: 'py-4 px-8 fs-13 lh-20',
} as const

export const COMPONENT_SIZE_TO_ICON_CLASS_MAP: Record<NSegmentedControlProps['size'], string> = {
    [ComponentSizeType.xs]: 'py-1',
    [ComponentSizeType.small]: 'py-2',
    [ComponentSizeType.medium]: 'py-2',
} as const

const wrapWithTooltip = (tooltipProps: SegmentType['tooltipProps']) => (children: ReactElement) => (
    <Tooltip content={tooltipProps.content} placement="bottom" {...tooltipProps} alwaysShowTippyOnHover>
        {children}
    </Tooltip>
)

const NSegmentedControl = ({
    segments,
    onChange,
    name,
    size = ComponentSizeType.medium,
    value: controlledValue,
    fullWidth = false,
}: NSegmentedControlProps) => {
    const isUnControlledComponent = controlledValue === undefined

    const segmentedControlRefContainer = useRef<HTMLDivElement>(null)
    const selectedSegmentRef = useRef<HTMLDivElement>(null)
    const [selectedSegmentValue, setSelectedSegmentValue] = useState<SegmentType['value'] | null>(segments[0].value)
    const segmentValue = isUnControlledComponent ? selectedSegmentValue : controlledValue

    useEffect(() => {
        if (segmentValue) {
            const { offsetWidth, offsetLeft } = selectedSegmentRef.current
            const { style } = segmentedControlRefContainer.current

            style.setProperty('--segmented-control-highlight-width', `${offsetWidth}px`)
            style.setProperty('--segmented-control-highlight-x-position', `${offsetLeft}px`)
        }
    }, [segmentValue, size, fullWidth])

    const handleSegmentChange = (updatedSegment: SegmentType) => {
        if (isUnControlledComponent) {
            setSelectedSegmentValue(updatedSegment.value)
        }
        onChange?.(updatedSegment)
    }

    return (
        <div
            className={`segmented-control ${!fullWidth ? 'dc__inline-flex' : ''} br-6 ${size === ComponentSizeType.xs ? 'p-1' : 'p-2'}`}
        >
            <div
                className="segmented-control__container flex left dc__position-rel dc__align-items-center dc__gap-2"
                ref={segmentedControlRefContainer}
            >
                {segments.map((segment) => {
                    const { value, icon, isError, label, tooltipProps, ariaLabel } = segment
                    const isSelected = value === segmentValue

                    return (
                        <ConditionalWrap
                            key={value}
                            condition={!!tooltipProps?.content}
                            wrap={wrapWithTooltip(tooltipProps)}
                        >
                            <div
                                className={`dc__position-rel dc__text-center ${fullWidth ? 'flex-grow-1' : ''}`}
                                ref={isSelected ? selectedSegmentRef : undefined}
                            >
                                <input
                                    type="radio"
                                    value={value}
                                    id={`${name}-${value}`}
                                    name={name}
                                    onChange={() => handleSegmentChange(segment)}
                                    checked={isSelected}
                                    className="dc__opacity-0 m-0-imp dc__top-0 dc__left-0 dc__position-abs dc__bottom-0 dc__right-0 w-100 pointer h-100 dc__visibility-hidden"
                                />

                                <label
                                    htmlFor={`${name}-${value}`}
                                    className={`pointer m-0 flex ${!fullWidth ? 'left' : ''} dc__gap-4 br-4 segmented-control__segment segmented-control__segment--${size} ${isSelected ? 'fw-6 segmented-control__segment--selected' : 'fw-4'} ${segment.isError ? 'cr-5' : 'cn-9'} ${COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP[size]}`}
                                    aria-label={ariaLabel}
                                >
                                    {(isError || icon) && (
                                        <span className={`flex ${COMPONENT_SIZE_TO_ICON_CLASS_MAP[size]}`}>
                                            <Icon
                                                {...(isError
                                                    ? {
                                                          name: 'ic-error',
                                                          color: null,
                                                      }
                                                    : {
                                                          name: icon,
                                                          color: isSelected ? 'N900' : 'N700',
                                                      })}
                                                size={size === ComponentSizeType.xs ? 14 : 16}
                                            />
                                        </span>
                                    )}
                                    {label && <span>{label}</span>}
                                </label>
                            </div>
                        </ConditionalWrap>
                    )
                })}
            </div>
        </div>
    )
}

export default NSegmentedControl
