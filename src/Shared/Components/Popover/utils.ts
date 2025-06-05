import { HTMLMotionProps } from 'framer-motion'

import { UsePopoverProps } from './types'

export const getPopoverAlignmentStyle = ({ position, alignment }: Pick<UsePopoverProps, 'position' | 'alignment'>) => {
    if (position === 'top' || position === 'bottom') {
        switch (alignment) {
            case 'end':
                return { right: 0 }
            case 'middle':
                return { left: '50%' }
            case 'start':
            default:
                return { left: 0 }
        }
    }

    switch (alignment) {
        case 'end':
            return { bottom: 0 }
        case 'middle':
            return { top: '50%' }
        case 'start':
        default:
            return { top: 0 }
    }
}

export const getPopoverPositionStyle = ({ position }: Pick<UsePopoverProps, 'position'>) => {
    switch (position) {
        case 'top':
            return { bottom: '100%', marginBottom: 6 }
        case 'left':
            return { right: '100%', marginRight: 6 }
        case 'right':
            return { left: '100%', marginLeft: 6 }
        case 'bottom':
        default:
            return { top: '100%', marginTop: 6 }
    }
}

const getPopoverAnimationProps = (axisKey: 'x' | 'y', axisInitialValue: number, isMiddleAlignment: boolean) =>
    ({
        initial: { opacity: 0, [axisKey]: axisInitialValue },
        animate: { opacity: 1, [axisKey]: 0 },
        exit: { opacity: 0, [axisKey]: axisInitialValue },
        transformTemplate: (isMiddleAlignment
            ? (params) =>
                  axisKey === 'y' ? `translate(-50%, ${params[axisKey]})` : `translate(${params[axisKey]}, -50%)`
            : undefined) as HTMLMotionProps<'div'>['transformTemplate'],
    }) satisfies HTMLMotionProps<'div'>

export const getPopoverFramerProps = ({ position, alignment }: Pick<UsePopoverProps, 'position' | 'alignment'>) => {
    const isMiddleAlignment = alignment === 'middle'

    if (position === 'top' || position === 'bottom') {
        const initialY = position === 'bottom' ? -12 : 12
        return getPopoverAnimationProps('y', initialY, isMiddleAlignment)
    }

    const initialX = position === 'right' ? -12 : 12
    return getPopoverAnimationProps('x', initialX, isMiddleAlignment)
}

export const getPopoverActualPositionAlignment = ({
    position,
    alignment,
    triggerRect,
    popoverRect,
}: Pick<UsePopoverProps, 'position' | 'alignment'> & { triggerRect: DOMRect; popoverRect: DOMRect }) => {
    const space = {
        top: triggerRect.top,
        bottom: window.innerHeight - triggerRect.bottom,
        left: triggerRect.left,
        right: window.innerWidth - triggerRect.right,
    }

    const fits = {
        top: popoverRect.height <= space.top,
        bottom: popoverRect.height <= space.bottom,
        left: popoverRect.width <= space.left,
        right: popoverRect.width <= space.right,
    }

    const fallbackPosition =
        (fits[position] && position) ||
        (fits.bottom && 'bottom') ||
        (fits.top && 'top') ||
        (fits.right && 'right') ||
        (fits.left && 'left') ||
        position

    const fitsAlign =
        fallbackPosition === 'top' || fallbackPosition === 'bottom'
            ? {
                  start: triggerRect.left + popoverRect.width <= window.innerWidth,
                  middle:
                      triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2 >= 0 &&
                      triggerRect.left + triggerRect.width / 2 + popoverRect.width / 2 <= window.innerWidth,
                  end: triggerRect.right - popoverRect.width >= 0,
              }
            : {
                  start: triggerRect.top + popoverRect.height <= window.innerHeight,
                  middle:
                      triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2 >= 0 &&
                      triggerRect.top + triggerRect.height / 2 + popoverRect.height / 2 <= window.innerHeight,
                  end: triggerRect.bottom - popoverRect.height >= 0,
              }

    const fallbackAlignment =
        (fitsAlign[alignment] && alignment) ||
        (fitsAlign.start && 'start') ||
        (fitsAlign.middle && 'middle') ||
        (fitsAlign.end && 'end') ||
        alignment

    return { fallbackPosition, fallbackAlignment }
}
