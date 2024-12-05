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

import { useEffect } from 'react'

import { useThrottledEffect } from '@Common/Helper'

import { ResizableTagTextAreaProps } from './Types'

export const ResizableTagTextArea = ({
    value,
    minHeight,
    maxHeight,
    dataTestId,
    onBlur,
    onFocus,
    refVar,
    dependentRef,
    className = '',
    disableOnBlurResizeToMinHeight,
    ...resProps
}: ResizableTagTextAreaProps) => {
    const updateRefHeight = (height: number) => {
        const refElement = refVar?.current
        if (refElement) {
            refElement.style.height = `${height}px`
        }
    }

    const updateDependentRefsHeight = (height: number) => {
        if (dependentRef) {
            Object.values(Array.isArray(dependentRef) ? dependentRef : [dependentRef]).forEach((ref) => {
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
        if (dependentRef) {
            Object.values(Array.isArray(dependentRef) ? dependentRef : [dependentRef]).forEach((ref) => {
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

    useThrottledEffect(reInitHeight, 500, [value])

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
            value={value}
            className={`${className || ''} lh-20`}
            style={{ resize: 'none' }}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            data-testid={dataTestId}
        />
    )
}
