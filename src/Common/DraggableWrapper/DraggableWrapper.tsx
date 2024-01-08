import React, { useEffect, useRef, useState } from 'react'
import Draggable, { ControlPosition, DraggableData } from 'react-draggable'
import { DraggableWrapperProps, DraggablePositionVariant } from './types'
import { useWindowSize } from '../Hooks'
import { MAX_Z_INDEX } from '../Constants'

/**
 * TODO: import it as lazy, after it is supported in common
 * 1. If using react select please use menuPlacement='auto'
 * 2. dragSelector will be used to identify the grabbable button that will grab the div to drag
 * 3. parentRef is the reference point from which we will derive the base top:0 ,left: 0 position
 */
export default function DraggableWrapper({
    children,
    zIndex = MAX_Z_INDEX,
    positionVariant,
    dragSelector,
    parentRef,
    boundaryGap = 16,
    childDivProps = {},
}: DraggableWrapperProps) {
    const windowSize = useWindowSize()
    const nodeRef = useRef<HTMLDivElement>(null)

    const [position, setPosition] = useState<ControlPosition>({
        x: 0,
        y: 0,
    })

    const getDefaultPosition = (positionVariant: DraggablePositionVariant): ControlPosition => {
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

        switch (positionVariant) {
            case DraggablePositionVariant.PARENT_BOTTOM_CENTER: {
                // currently at parentRect.x and need to start to the center of its width and half of node should lie on left of center and other half on right
                const x = (parentRect.width - nodeRef.current?.getBoundingClientRect().width) / 2
                // currently at parentRect.y now parent height can be greater than windowSize.height so taking min
                // subtracting parentRect.top since window height already contains that
                const baseY =
                    parentRect.height > windowSize.height ? windowSize.height - parentRect.top : parentRect.height
                const y = baseY - nodeRef.current?.getBoundingClientRect().height - boundaryGap
                return { x, y }
            }
            case DraggablePositionVariant.SCREEN_BOTTOM_CENTER: {
                // Since need node to be in center of screen so subtracting width/2 by left of parentRect it will start the node from center but want node's midpoint at center so subtracting node's width from it.
                const x = windowSize.width / 2 - parentRect.left - nodeRef.current?.getBoundingClientRect().width / 2
                // subtracting top since windowSize already contains that
                const y =
                    windowSize.height - parentRect.top - nodeRef.current?.getBoundingClientRect().height - boundaryGap

                return { x, y }
            }
            // Add more cases for other variants if needed
            default:
                throw new Error('Please use DraggablePositionVariant enum')
        }
    }

    // On change of windowSize we will reset the position to default
    useEffect(() => {
        const defaultPosition = getDefaultPosition(positionVariant)
        setPosition(defaultPosition)
    }, [nodeRef, positionVariant, windowSize])

    // Would be called on drag and will not update the state if the new position is out of window screen
    function handlePositionChange(e, data: DraggableData) {
        const offsetX = parentRef?.current?.getBoundingClientRect().left ?? 0
        const offsetY = parentRef?.current?.getBoundingClientRect().top ?? 0

        if (
            offsetX + data.x + nodeRef.current?.getBoundingClientRect().width + boundaryGap > windowSize.width ||
            offsetY + data.y + nodeRef.current?.getBoundingClientRect().height + boundaryGap > windowSize.height ||
            offsetX + data.x < 0 ||
            offsetY + data.y < 0
        ) {
            return
        }

        setPosition({
            x: data.x,
            y: data.y,
        })
    }

    return (
        <div
            className="dc__position-fixed"
            style={{
                zIndex,
            }}
        >
            <Draggable handle={dragSelector} nodeRef={nodeRef} position={position} onDrag={handlePositionChange}>
                <div
                    ref={nodeRef}
                    {...childDivProps}
                    style={{
                        zIndex,
                    }}
                >
                    {children}
                </div>
            </Draggable>
        </div>
    )
}
