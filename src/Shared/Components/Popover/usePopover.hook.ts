import { useLayoutEffect, useRef, useState } from 'react'

import { UsePopoverProps, UsePopoverReturnType } from './types'
import {
    getPopoverActualPositionAlignment,
    getPopoverAlignmentStyle,
    getPopoverFramerProps,
    getPopoverPositionStyle,
} from './utils'

export const usePopover = ({
    id,
    position = 'bottom',
    alignment = 'start',
    width = 'auto',
    onOpen,
    onPopoverKeyDown,
    onTriggerKeyDown,
}: UsePopoverProps): UsePopoverReturnType => {
    // STATES
    const [open, setOpen] = useState(false)
    const [actualPosition, setActualPosition] = useState<UsePopoverProps['position']>(position)
    const [actualAlignment, setActualAlignment] = useState<UsePopoverProps['alignment']>(alignment)

    // CONSTANTS
    const isAutoWidth = width === 'auto'

    // REFS
    const triggerRef = useRef<HTMLDivElement | null>(null)
    const popover = useRef<HTMLDivElement | null>(null)
    const scrollableRef = useRef<HTMLElement | null>(null)

    // HANDLERS
    const updateOpenState = (openState: typeof open) => {
        setOpen(openState)
        onOpen?.(openState)
    }

    const togglePopover = () => updateOpenState(!open)

    const closePopover = () => updateOpenState(false)

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
        if (!open && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            updateOpenState(true)
        }

        onTriggerKeyDown?.(e, open, closePopover)
    }

    const handlePopoverKeyDown = (e: React.KeyboardEvent) => onPopoverKeyDown(e, open, closePopover)

    useLayoutEffect(() => {
        if (!open || !triggerRef.current || !popover.current || !scrollableRef.current) {
            return
        }

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const popoverRect = popover.current.getBoundingClientRect()

        const { fallbackPosition, fallbackAlignment } = getPopoverActualPositionAlignment({
            position,
            alignment,
            triggerRect,
            popoverRect,
        })

        setActualPosition(fallbackPosition)
        setActualAlignment(fallbackAlignment)

        // prevent scroll propagation unless scrollable
        const handleWheel = (e: WheelEvent) => {
            e.stopPropagation()

            const atTop = scrollableRef.current.scrollTop === 0 && e.deltaY < 0
            const atBottom =
                scrollableRef.current.scrollHeight - scrollableRef.current.clientHeight ===
                    scrollableRef.current.scrollTop && e.deltaY > 0

            if (atTop || atBottom) {
                e.preventDefault()
            }
        }

        scrollableRef.current.addEventListener('wheel', handleWheel, { passive: false })
        // eslint-disable-next-line consistent-return
        return () => {
            scrollableRef.current.removeEventListener('wheel', handleWheel)
        }
    }, [open, position, alignment])

    return {
        open,
        triggerProps: {
            role: 'button',
            ref: triggerRef,
            onClick: togglePopover,
            onKeyDown: handleTriggerKeyDown,
            'aria-haspopup': 'listbox',
            'aria-expanded': open,
            tabIndex: 0,
        },
        overlayProps: {
            role: 'dialog',
            onClick: closePopover,
            className: 'popover-overlay',
        },
        popoverProps: {
            id,
            ref: popover,
            role: 'listbox',
            className: `popover-content dc__position-abs bg__menu--primary shadow__menu border__primary br-6 dc__overflow-hidden ${isAutoWidth ? 'dc_width-max-content dc__mxw-250' : ''}`,
            onKeyDown: handlePopoverKeyDown,
            style: {
                width: !isAutoWidth ? `${width}px` : undefined,
                ...getPopoverPositionStyle({ position: actualPosition }),
                ...getPopoverAlignmentStyle({ position: actualPosition, alignment: actualAlignment }),
            },
            ...getPopoverFramerProps({ position: actualPosition, alignment: actualAlignment }),
            transition: { duration: 0.2 },
        },
        scrollableRef,
        closePopover,
    }
}
