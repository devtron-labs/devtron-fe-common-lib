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

import { ReactElement, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Tooltip } from '@Common/Tooltip'
import { Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import { getUniqueId } from '@Shared/Helpers'

import { ConditionalWrap } from '../Helper'
import { COMPONENT_SIZE_TO_ICON_CLASS_MAP, COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP } from './constants'
import { SegmentProps, SegmentType } from './types'

const wrapWithTooltip = (tooltipProps: SegmentType['tooltipProps']) => (children: ReactElement) => (
    <Tooltip content={tooltipProps.content} placement="bottom" {...tooltipProps} alwaysShowTippyOnHover>
        {children}
    </Tooltip>
)

const Segment = <T extends string | number>({
    segment,
    isSelected,
    name,
    onChange,
    fullWidth,
    size,
    disabled,
}: SegmentProps<T>) => {
    const inputId = useMemo(getUniqueId, [])

    const { value, icon, isError, label, tooltipProps, ariaLabel } = segment
    const handleChange = () => {
        onChange(segment)
    }

    return (
        <ConditionalWrap key={value} condition={!!tooltipProps?.content} wrap={wrapWithTooltip(tooltipProps)}>
            <div className={`dc__position-rel dc__text-center dc__no-shrink ${fullWidth ? 'flex-grow-1' : ''}`}>
                <input
                    type="radio"
                    value={value}
                    id={inputId}
                    name={name}
                    onChange={handleChange}
                    checked={isSelected}
                    className="sr-only"
                    disabled={disabled}
                />

                <label
                    htmlFor={inputId}
                    className={`pointer m-0 dc__position-rel flex ${!fullWidth ? 'left' : ''} dc__gap-4 br-4 segmented-control__segment segmented-control__segment--${size} ${isSelected ? 'fw-6 segmented-control__segment--selected' : 'fw-4'} ${segment.isError ? 'cr-5' : 'cn-9'} ${disabled ? 'cursor-not-allowed' : ''} ${COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP[size]}`}
                    key={inputId}
                    aria-label={ariaLabel}
                >
                    <AnimatePresence>
                        {isSelected && (
                            <motion.div
                                layoutId={`active-segment-control-${name}`}
                                className="dc__position-abs active-mask dc__top-0 dc__left-0 dc__right-0 dc__bottom-0 bg__primary br-4"
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                            />
                        )}
                    </AnimatePresence>

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
