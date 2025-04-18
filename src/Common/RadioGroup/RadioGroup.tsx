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

/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useMemo, useState } from 'react'

import { Tooltip } from '@Common/Tooltip'

import { ConditionalWrap } from '../Helper'
import { RadioGroupComposition, RadioGroupInterface, RadioInterface } from '../Types'

import './radioGroup.scss'

const RadioContext = React.createContext(null)

function useRadioContext() {
    const context = React.useContext(RadioContext)
    if (!context) {
        throw new Error(`Radio compound components cannot be rendered outside the Toggle component`)
    }
    return context
}

const RadioGroup: React.FC<RadioGroupInterface> & RadioGroupComposition = React.memo(
    ({ name, onChange, children, className = '', initialTab, disabled = false }: RadioGroupInterface) => {
        const [selected, select] = useState(null)

        useEffect(() => {
            if (initialTab === selected) return
            select(initialTab)
        }, [initialTab])
        const contextValue = useMemo(
            () => ({ name, selected, select, disabled, onChange }),
            [name, selected, select, disabled, onChange],
        )
        return (
            <RadioContext.Provider value={contextValue}>
                <div className={`${className} radio-group`}>{children}</div>
            </RadioContext.Provider>
        )
    },
)

const TippyComponent = (children, tippyContent, tippyPlacement, tippyClass) => (
    <Tooltip
        className={`default-tt ${tippyClass}`}
        arrow={false}
        placement={tippyPlacement}
        content={tippyContent}
        alwaysShowTippyOnHover
    >
        {children}
    </Tooltip>
)

const Radio = ({
    value,
    children,
    className = '',
    showTippy = false,
    tippyContent = '',
    tippyPlacement = 'bottom',
    canSelect = true,
    isDisabled = false,
    tippyClass = '',
    dataTestId,
}: RadioInterface) => {
    const { name, selected, select, disabled, onChange } = useRadioContext()

    return (
        <ConditionalWrap
            condition={showTippy}
            wrap={(child) => TippyComponent(child, tippyContent, tippyPlacement, tippyClass)}
        >
            <label className={`${className} radio ${isDisabled || disabled ? 'disabled' : ''}`}>
                <input
                    type="checkbox"
                    value={value}
                    name={name}
                    checked={value === selected}
                    onChange={(e) => {
                        e.persist()
                        if (canSelect) {
                            select(e.target.value)
                        }
                        onChange(e)
                    }}
                    disabled={isDisabled || disabled}
                />
                <span className="radio__item-label" data-testid={dataTestId}>
                    {children}
                </span>
            </label>
        </ConditionalWrap>
    )
}

RadioGroup.Radio = Radio
export default RadioGroup
