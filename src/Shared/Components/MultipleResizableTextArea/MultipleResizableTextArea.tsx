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

import { useEffect, useState } from 'react'

import { useThrottledEffect } from '@Common/Helper'

import { MultipleResizableTextAreaProps } from './types'

export const MultipleResizableTextArea = ({
    value,
    minHeight,
    maxHeight,
    dataTestId,
    onChange,
    onBlur,
    onFocus,
    refVar,
    dependentRefs,
    className = '',
    disableOnBlurResizeToMinHeight,
    ...resProps
}: MultipleResizableTextAreaProps) => {
    const [text, setText] = useState(value ?? '')

    useEffect(() => {
        setText(value)
    }, [value])

    const handleChange = (event) => {
        setText(event.target.value)
        onChange?.(event)
    }

    const updateRefHeight = (height: number) => {
        const refElement = refVar?.current
        if (refElement) {
            refElement.style.height = `${height}px`
        }
    }

    const updateDependentRefsHeight = (height: number) => {
        if (dependentRefs) {
            Object.values(dependentRefs).forEach((ref) => {
                const refElement = ref.current
                if (refElement) {
                    refElement.style.height = `${height}px`
                }
            })
        }
    }

    const reInitHeight = () => {
        updateRefHeight(minHeight || 0)
        updateDependentRefsHeight(minHeight || 0)

        let nextHeight = refVar?.current?.scrollHeight || 0
        if (dependentRefs) {
            Object.values(dependentRefs).forEach((ref) => {
                const refElement = ref.current
                if (refElement && refElement.scrollHeight > nextHeight) {
                    nextHeight = refElement.scrollHeight
                }
            })
        }
        if (minHeight && nextHeight < minHeight) {
            nextHeight = minHeight
        }
        if (maxHeight && nextHeight > maxHeight) {
            nextHeight = maxHeight
        }
        updateRefHeight(nextHeight)
        updateDependentRefsHeight(nextHeight)
    }

    useEffect(() => {
        reInitHeight()
    }, [])

    useThrottledEffect(reInitHeight, 500, [text])

    const handleOnBlur = (event) => {
        if (!disableOnBlurResizeToMinHeight) {
            updateRefHeight(minHeight)
            updateDependentRefsHeight(minHeight)
        }
        onBlur?.(event)
    }

    const handleOnFocus = (event) => {
        reInitHeight()
        onFocus?.(event)
    }

    return (
        <textarea
            {...resProps}
            rows={1}
            ref={refVar}
            value={text}
            className={`${className || ''} lh-20`}
            style={{ resize: 'none' }}
            onChange={handleChange}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            data-testid={dataTestId}
        />
    )
}
