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
    onBlur,
    onFocus,
    refVar,
    dependentRef,
    dependentRefs,
    className = '',
    disableOnBlurResizeToMinHeight,
    id,
    ...restProps
}: ResizableTagTextAreaProps) => {
    const updateDependentRefsHeight = (height: number) => {
        const refElement = dependentRef?.current
        if (refElement) {
            refElement.style.height = `${height}px`
        }

        Object.values(dependentRefs || {}).forEach((ref) => {
            const dependentRefElement = ref?.current
            if (dependentRefElement) {
                dependentRefElement.style.height = `${height}px`
            }
        })
    }

    const updateRefsHeight = (height: number) => {
        const refElement = refVar?.current
        if (refElement) {
            refElement.style.height = `${height}px`
        }
        updateDependentRefsHeight(height)
    }

    const reInitHeight = () => {
        updateRefsHeight(minHeight || 0)

        let nextHeight = refVar?.current?.scrollHeight || 0

        if (dependentRef) {
            const refElement = dependentRef.current
            if (refElement && refElement.scrollHeight > nextHeight) {
                nextHeight = refElement.scrollHeight
            }
        }

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

        updateRefsHeight(nextHeight)
    }

    useEffect(() => {
        reInitHeight()
    }, [])

    useThrottledEffect(reInitHeight, 500, [value])

    const handleOnBlur = (event) => {
        if (!disableOnBlurResizeToMinHeight) {
            updateRefsHeight(minHeight)
        }
        onBlur?.(event)
    }

    const handleOnFocus = (event) => {
        reInitHeight()
        onFocus?.(event)
    }

    // Textarea component can't be used here
    return (
        <textarea
            {...restProps}
            id={id}
            data-testid={id}
            rows={1}
            ref={refVar}
            value={value}
            className={`${className || ''} lh-20`}
            style={{ resize: 'none' }}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
        />
    )
}
