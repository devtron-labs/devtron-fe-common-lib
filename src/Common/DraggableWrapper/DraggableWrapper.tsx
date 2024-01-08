import React, { useEffect, useRef, useState } from 'react'
import Draggable, { ControlPosition, DraggableData } from 'react-draggable'
import { DraggableWrapperProps, DraggablePositionVariant } from './types'
import { useWindowSize } from '../Hooks'
import { MAX_Z_INDEX } from '../Constants'

/**
 * TODO: import it as lazy, after it is supported in common
 * 1. If using react select please use menuPlacement='auto'
 * 2. dragClassName will be used to identify the grabbable button that will grab the div to drag
 * 3. parentRef is the reference point from which we will derive the base top:0 ,left: 0 position
 */
export default function DraggableWrapper({
    children,
    zIndex = MAX_Z_INDEX,
    positionVariant,
    dragClassName,
    parentRef,
    boundaryGap = 16,
    childDivProps = {},
}: DraggableWrapperProps) {
    const windowSize = useWindowSize()
    const nodeRef = useRef<HTMLDivElement>(null)

    const getDefaultPosition = (positionVariant: DraggablePositionVariant): ControlPosition => {
        // if i return x: 0, y: 0 then it will be top left corner of parentDiv
        const parentRect = parentRef?.current?.getBoundingClientRect() ?? {
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            bottom: 0,
        }

        switch (positionVariant) {
            case DraggablePositionVariant.PARENT_BOTTOM_CENTER: {
                const x = parentRect.width / 2 - nodeRef.current?.getBoundingClientRect().width / 2
                const y =
                    Math.min(parentRect.height, windowSize.height) -
                    parentRect.top -
                    nodeRef.current?.getBoundingClientRect().height -
                    boundaryGap
                return { x, y }
            }
            case DraggablePositionVariant.SCREEN_BOTTOM_CENTER: {
                const x = windowSize.width / 2 - parentRect.left - nodeRef.current?.getBoundingClientRect().width / 2
                const y =
                    windowSize.height - parentRect.top - nodeRef.current?.getBoundingClientRect().height - boundaryGap

                return { x, y }
            }
            // Add more cases for other variants if needed
            default:
                throw new Error('Please use DraggablePositionVariant enum')
        }
    }

    const [position, setPosition] = useState<ControlPosition>({
        x: 0,
        y: 0,
    })

    // On change of windowSize we will reset the position to default
    useEffect(() => {
        const defaultPosition = getDefaultPosition(positionVariant)
        setPosition(defaultPosition)
    }, [nodeRef, positionVariant, windowSize])

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
        // Check there might be a case if we need it to be absolute?
        <div
            className="dc__position-fixed"
            style={{
                zIndex,
            }}
        >
            <Draggable handle={`.${dragClassName}`} nodeRef={nodeRef} position={position} onDrag={handlePositionChange}>
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
