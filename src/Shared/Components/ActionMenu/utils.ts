import { HTMLMotionProps } from 'framer-motion'

import { UseActionMenuProps } from './types'

export const getActionMenuAlignmentStyle = ({
    position,
    alignment,
}: Pick<UseActionMenuProps, 'position' | 'alignment'>) => {
    const isYDirection = position === 'top' || position === 'bottom'

    if (isYDirection) {
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

export const getActionMenuPositionStyle = ({ position }: Pick<UseActionMenuProps, 'position'>) => {
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

export const getActionMenuFramerProps = ({
    position,
    alignment,
}: Pick<UseActionMenuProps, 'position' | 'alignment'>) => {
    const isYDirection = position === 'top' || position === 'bottom'
    const isMiddleAlignment = alignment === 'middle'

    if (isYDirection) {
        const initialY = position === 'bottom' ? -12 : 12

        return {
            initial: { opacity: 0, y: initialY },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: initialY },
            transformTemplate: (isMiddleAlignment
                ? ({ y }) => `translate(-50%, ${y})`
                : undefined) as HTMLMotionProps<'ul'>['transformTemplate'],
        } satisfies HTMLMotionProps<'ul'>
    }

    const initialX = position === 'right' ? -12 : 12

    return {
        initial: { opacity: 0, x: initialX },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: initialX },
        transformTemplate: (isMiddleAlignment
            ? ({ x }) => `translate(${x}, -50%)`
            : undefined) as HTMLMotionProps<'ul'>['transformTemplate'],
    } satisfies HTMLMotionProps<'ul'>
}

export const getActionMenuActualPositionAlignment = ({
    position,
    alignment,
    triggerRect,
    menuRect,
}: Pick<UseActionMenuProps, 'position' | 'alignment'> & { triggerRect: DOMRect; menuRect: DOMRect }) => {
    const space = {
        top: triggerRect.top,
        bottom: window.innerHeight - triggerRect.bottom,
        left: triggerRect.left,
        right: window.innerWidth - triggerRect.right,
    }

    const fits = {
        top: menuRect.height <= space.top,
        bottom: menuRect.height <= space.bottom,
        left: menuRect.width <= space.left,
        right: menuRect.width <= space.right,
    }

    const fallbackPosition =
        (fits[position] && position) ||
        (fits.bottom && 'bottom') ||
        (fits.top && 'top') ||
        (fits.right && 'right') ||
        (fits.left && 'left') ||
        position

    const isYDirection = fallbackPosition === 'top' || fallbackPosition === 'bottom'

    const fitsAlign = isYDirection
        ? {
              start: triggerRect.left + menuRect.width <= window.innerWidth,
              middle:
                  triggerRect.left + triggerRect.width / 2 - menuRect.width / 2 >= 0 &&
                  triggerRect.left + triggerRect.width / 2 + menuRect.width / 2 <= window.innerWidth,
              end: triggerRect.right - menuRect.width >= 0,
          }
        : {
              start: triggerRect.top + menuRect.height <= window.innerHeight,
              middle:
                  triggerRect.top + triggerRect.height / 2 - menuRect.height / 2 >= 0 &&
                  triggerRect.top + triggerRect.height / 2 + menuRect.height / 2 <= window.innerHeight,
              end: triggerRect.bottom - menuRect.height >= 0,
          }

    const fallbackAlignment =
        (fitsAlign[alignment] && alignment) ||
        (fitsAlign.start && 'start') ||
        (fitsAlign.middle && 'middle') ||
        (fitsAlign.end && 'end') ||
        alignment

    return { fallbackPosition, fallbackAlignment }
}

export const getActionMenuFlatOptions = (options: UseActionMenuProps['options']) =>
    options.flatMap(
        (option, sectionIndex) =>
            option.items.map((groupOption, itemIndex) => ({
                option: groupOption,
                itemIndex,
                sectionIndex,
            })),
        [],
    )

const normalize = (str: string) => str.toLowerCase()

const fuzzyMatch = (text: string, term: string) => normalize(text).includes(term)

export const filterActionMenuOptions = (options: UseActionMenuProps['options'], searchTerm: string) => {
    if (!searchTerm) {
        return options
    }

    const target = normalize(searchTerm)

    return options
        .map((option) => {
            const filteredItems = option.items.filter((item) => fuzzyMatch(item.label, target))
            return filteredItems.length > 0 ? { ...option, items: filteredItems } : null
        })
        .filter(Boolean)
}
