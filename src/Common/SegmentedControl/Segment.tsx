import { ReactElement } from 'react'

import { Tooltip } from '@Common/Tooltip'
import { Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { ConditionalWrap } from '../Helper'
import { COMPONENT_SIZE_TO_ICON_CLASS_MAP, COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP } from './constants'
import { SegmentProps, SegmentType } from './types'

const wrapWithTooltip = (tooltipProps: SegmentType['tooltipProps']) => (children: ReactElement) => (
    <Tooltip content={tooltipProps.content} placement="bottom" {...tooltipProps} alwaysShowTippyOnHover>
        {children}
    </Tooltip>
)

const Segment = ({
    segment,
    isSelected,
    name,
    selectedSegmentRef,
    onChange,
    fullWidth,
    size,
    disabled,
}: SegmentProps) => {
    const { value, icon, isError, label, tooltipProps, ariaLabel } = segment
    const handleChange = () => {
        onChange(segment)
    }

    return (
        <ConditionalWrap key={value} condition={!!tooltipProps?.content} wrap={wrapWithTooltip(tooltipProps)}>
            <div
                className={`dc__position-rel dc__text-center ${fullWidth ? 'flex-grow-1' : ''}`}
                ref={selectedSegmentRef}
            >
                <input
                    type="radio"
                    value={value}
                    id={`${name}-${value}`}
                    name={name}
                    onChange={handleChange}
                    checked={isSelected}
                    className="dc__opacity-0 m-0-imp dc__top-0 dc__left-0 dc__position-abs dc__bottom-0 dc__right-0 w-100 pointer h-100 dc__visibility-hidden"
                    disabled={disabled}
                />

                <label
                    htmlFor={`${name}-${value}`}
                    className={`pointer m-0 flex ${!fullWidth ? 'left' : ''} dc__gap-4 br-4 segmented-control__segment segmented-control__segment--${size} ${isSelected ? 'fw-6 segmented-control__segment--selected' : 'fw-4'} ${segment.isError ? 'cr-5' : 'cn-9'} ${disabled ? 'cursor-not-allowed' : ''} ${COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP[size]}`}
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
}

export default Segment
