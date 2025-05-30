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

import React, { SyntheticEvent, useCallback } from 'react'
import { Icon as IconComponent } from '@Shared/Components'
import { throttle, useEffectAfterMount } from '../Helper'
import { CHECKBOX_VALUE } from '@Common/Types'
import './Toggle.scss'

/**
 * @deprecated
 */
const Toggle = ({
    selected = false,
    onSelect = null,
    color = 'var(--G500)',
    rootClassName = '',
    disabled = false,
    dataTestId = 'handle-toggle-button',
    Icon = null,
    iconClass = '',
    throttleOnChange = false,
    shouldToggleValueOnLabelClick = false,
    isLoading = false,
    value = CHECKBOX_VALUE.CHECKED,
    isControlled = false,
    ...props
}) => {
    const [active, setActive] = React.useState(selected)

    useEffectAfterMount(() => {
        if (typeof onSelect === 'function' && !isControlled) {
            if (active !== selected) {
                onSelect(active)
            }
        }
    }, [active])

    useEffectAfterMount(() => {
        setActive(selected)
    }, [selected])

    function handleClick() {
        if (!disabled) {
            if (isControlled) {
                onSelect(!active)
            } else {
                setActive((active) => !active)
            }
        }
    }

    const throttledHandleClick = useCallback(throttle(handleClick, 500), [disabled])

    const handleChange = () => {
        if (throttleOnChange) {
            throttledHandleClick()
            return
        }
        handleClick()
    }

    const handleLabelClick = (e: SyntheticEvent) => {
        if (shouldToggleValueOnLabelClick) {
            e.preventDefault()
            handleChange()
        }
    }

    const isIntermediateView = selected && value === CHECKBOX_VALUE.INTERMEDIATE

    const renderIcon = () => {
        if (isIntermediateView) {
            return (
                <div className="w-100 h-100 dc__position-abs flex">
                    <div className="w-8 h-2 br-4 dc__no-shrink bg__white" />
                </div>
            )
        }

        if (Icon) {
            return <Icon className={`icon-dim-20 br-4 p-2 ${iconClass}`} />
        }

        return null
    }

    return isLoading ? (
        <IconComponent name="ic-circle-loader" color="B500" size={20} />
    ) : (
        <label
            {...props}
            className={`${rootClassName} toggle__switch ${disabled ? 'disabled' : ''}`}
            style={{ ['--color' as any]: color }}
            {...(shouldToggleValueOnLabelClick ? { onClick: handleLabelClick } : {})}
        >
            <input type="checkbox" checked={!!active} onChange={handleChange} className="toggle__input" />
            <span
                className={`toggle__slider ${isIntermediateView ? 'intermediate' : ''} ${Icon ? 'with-icon br-4 dc__border' : 'round'}`}
                data-testid={dataTestId}
            >
                {renderIcon()}
            </span>
        </label>
    )
}

export default Toggle
