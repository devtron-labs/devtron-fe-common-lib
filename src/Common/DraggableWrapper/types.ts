import { HTMLAttributes } from 'react'

export enum DraggablePositionVariant {
    PARENT_BOTTOM_CENTER = 'PARENT_BOTTOM_CENTER',
    SCREEN_BOTTOM_CENTER = 'SCREEN_BOTTOM_CENTER',
    // Can add more based on requirement
}

export interface DraggableWrapperProps {
    children: React.ReactNode
    zIndex?: number
    positionVariant?: DraggablePositionVariant
    dragSelector: string
    parentRef?: React.RefObject<HTMLDivElement>
    boundaryGap?: number
    childDivProps?: HTMLAttributes<HTMLDivElement>
}

/**
 * dragClassName is the class that we feed to Draggable to identify dragging buttons
 */
export interface DraggableButtonProps {
    dragClassName: string
}
