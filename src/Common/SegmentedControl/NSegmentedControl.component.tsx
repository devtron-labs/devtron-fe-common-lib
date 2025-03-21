import { ReactElement, useState } from 'react'
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
    // initialSelectedTab: TabType['value']
    onChange?: (selectedTab: SegmentType) => void
    name: string
    size?: Extract<ComponentSizeType, ComponentSizeType.xs | ComponentSizeType.small | ComponentSizeType.medium>
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

const NSegmentedControl = ({ segments, onChange, name, size = ComponentSizeType.medium }: NSegmentedControlProps) => {
    const [selectedSegmentValue, setSelectedSegmentValue] = useState<SegmentType['value'] | null>(segments[0].value)

    const handleSegmentChange = (updatedSegment: SegmentType) => {
        setSelectedSegmentValue(updatedSegment.value)
        onChange?.(updatedSegment)
    }

    return (
        <div
            className={`segmented-control dc__inline-flex dc__content-center dc__align-items-center dc__gap-2 br-6 ${size === ComponentSizeType.xs ? 'p-1' : 'p-2'}`}
        >
            {segments.map((segment) => {
                const { value, icon, isError, label, tooltipProps, ariaLabel } = segment
                const isSelected = value === selectedSegmentValue

                return (
                    <ConditionalWrap
                        key={value}
                        condition={!!tooltipProps?.content}
                        wrap={wrapWithTooltip(tooltipProps)}
                    >
                        <div
                            // ref={item.ref}
                            className="dc__position-rel dc__text-center"
                        >
                            <input
                                type="radio"
                                value={value}
                                id={`${name}-${value}`}
                                name={name}
                                onChange={() => handleSegmentChange(segment)}
                                checked={isSelected}
                                className="dc__opacity-0 m-0-imp dc__top-0 dc__left-0 dc__position-abs dc__bottom-0 dc__right-0 w-100 pointer h-100"
                            />

                            <label
                                htmlFor={`${name}-${value}`}
                                className={`pointer m-0 flex left dc__gap-4 br-4 segmented-control__segment segmented-control__segment--${size} ${isSelected ? 'bg__primary fw-6 segmented-control__segment--selected' : 'fw-4'} ${segment.isError ? 'cr-5' : 'cn-9'} ${COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP[size]}`}
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
    )
}

export default NSegmentedControl
