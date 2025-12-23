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

import { useEffect, useRef, useState } from 'react'
import Draggable, { ControlPosition } from 'react-draggable'

import { DEVTRON_BASE_MAIN_ID } from '@Shared/constants'

import { MAX_Z_INDEX } from '../Constants'
import { useWindowSize } from '../Hooks'
import { DraggablePositionVariant, DraggableWrapperProps } from './types'

/**
 * TODO: import it as lazy, after it is supported in common
 * 1. If using react select please use menuPlacement='auto'
 * 2. dragSelector will be used to identify the grabbable button that will grab the div to drag
 * 3. The wrapper is positioned at the viewport's top-left (top: 0, left: 0) using fixed positioning; parentRef is an optional
 *    reference that may be used for position calculations but is not the base origin for the coordinate system.
 */
const DraggableWrapper = ({
    children,
    zIndex = MAX_Z_INDEX,
    positionVariant,
    dragSelector,
    parentRef,
    boundaryGap = { x: 16, y: 16 },
    childDivProps = {},
}: DraggableWrapperProps) => {
    const windowSize = useWindowSize()
    const nodeRef = useRef<HTMLDivElement>(null)

    // letting the dom render the element without displaying it so that we know it's dimensions
    const [initialRenderDone, setInitialRenderDone] = useState(false)

    const getDefaultPosition = (): ControlPosition => {
        // if this return x: 0, y: 0 then it will be top left corner of parentDiv
        const parentRect =
            parentRef?.current?.getBoundingClientRect() ??
            ({
                width: 0,
                height: 0,
                top: 0,
                left: 0,
                bottom: 0,
            } as DOMRect)
        const nodeRefHeight = nodeRef.current?.getBoundingClientRect().height ?? 0
        const nodeRefWidth = nodeRef.current?.getBoundingClientRect().width ?? 0

        switch (positionVariant) {
            case DraggablePositionVariant.PARENT_BOTTOM_CENTER: {
                // center div to middle of the parent rect and then add the left offset of the parent rect
                const x = (parentRect.width - nodeRefWidth) / 2 + parentRect.left
                if (parentRect.height > windowSize.height) {
                    return { x, y: windowSize.height - boundaryGap.y - nodeRefHeight }
                }
                const y = parentRect.bottom - nodeRefHeight - boundaryGap.y
                return { x, y }
            }
            case DraggablePositionVariant.SCREEN_BOTTOM_RIGHT: {
                const x = windowSize.width - nodeRefWidth - boundaryGap.x
                const y = windowSize.height - nodeRefHeight - boundaryGap.y

                return { x, y }
            }
            // Add more cases for other variants if needed
            default: {
                const x = (windowSize.width - nodeRefWidth) / 2
                const y = windowSize.height - nodeRefHeight - boundaryGap.y

                return { x, y }
            }
        }
    }

    useEffect(() => {
        // make the element visible after the initial render
        setInitialRenderDone(true)
    }, [])

    return (
        // Since we are using position fixed so we need to disable click on the div so that it does not interfere with the click of other elements
        <div
            className={`dc__position-fixed dc__disable-click dc__top-0 dc__left-0 ${initialRenderDone ? '' : 'dc__visibility-hidden'}`}
            style={{
                zIndex,
            }}
        >
            <Draggable
                key={`${windowSize.height}-${windowSize.width}-${initialRenderDone}`}
                handle={dragSelector}
                defaultPosition={getDefaultPosition()}
                bounds={`#${DEVTRON_BASE_MAIN_ID}`}
                nodeRef={nodeRef}
            >
                <div
                    ref={nodeRef}
                    {...childDivProps}
                    style={{
                        zIndex,
                        pointerEvents: 'auto',
                    }}
                >
                    {children}
                </div>
            </Draggable>
        </div>
    )
}

export default DraggableWrapper
