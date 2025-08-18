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

import { useLayoutEffect, useRef, useState } from 'react'

import { stopPropagation } from '@Common/Helper'

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
    variant = 'menu',
    onOpen,
    onPopoverKeyDown,
    onTriggerKeyDown,
    disableClose = false,
}: UsePopoverProps): UsePopoverReturnType => {
    // STATES
    const [open, setOpen] = useState(false)
    const [actualPosition, setActualPosition] = useState<UsePopoverProps['position']>(position)
    const [actualAlignment, setActualAlignment] = useState<UsePopoverProps['alignment']>(alignment)
    const [triggerBounds, setTriggerBounds] = useState<UsePopoverReturnType['triggerProps']['bounds'] | null>(null)
    const [isBackdropMounted, setIsBackdropMounted] = useState(false)

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

    const togglePopover = () => {
        if (disableClose && open) {
            return
        }
        updateOpenState(!open)
    }

    const closePopover = () => {
        if (disableClose) {
            return
        }
        updateOpenState(false)
        const triggerButton = triggerRef.current?.querySelector('button')
        triggerButton?.blur()
        triggerRef.current?.blur()
    }

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
        if (!open && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            updateOpenState(true)
        }

        onTriggerKeyDown?.(e, open, closePopover)
    }

    const handlePopoverKeyDown = (e: React.KeyboardEvent) => onPopoverKeyDown?.(e, open, closePopover)

    const handleOverlayClick = () => {
        closePopover()
    }

    useLayoutEffect(() => {
        if (!open || !isBackdropMounted || !triggerRef.current || !popover.current || !scrollableRef.current) {
            return
        }

        const updatePopoverPosition = () => {
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
            setTriggerBounds({
                left: triggerRect.left,
                top: triggerRect.top,
                height: triggerRect.height,
                width: triggerRect.width,
            })
        }

        // update position on open
        updatePopoverPosition()

        // focus on popover when it is opened, so that keyboard navigation works as expected
        popover.current.focus()

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
        window.addEventListener('resize', updatePopoverPosition)

        // eslint-disable-next-line consistent-return
        return () => {
            scrollableRef.current.removeEventListener('wheel', handleWheel)
            window.removeEventListener('resize', updatePopoverPosition)
        }
    }, [open, position, alignment, isBackdropMounted])

    return {
        open,
        triggerProps: {
            ref: triggerRef,
            onClick: togglePopover,
            onKeyDown: handleTriggerKeyDown,
            'aria-haspopup': 'listbox',
            'aria-expanded': open,
            className: 'flex',
            tabIndex: 0,
            bounds: triggerBounds ?? { left: 0, top: 0, height: 0, width: 0 },
        },
        overlayProps: {
            hasClearBackground: true,
            onClick: handleOverlayClick,
            onEscape: closePopover,
            onBackdropMount: setIsBackdropMounted,
        },
        popoverProps: {
            id,
            ref: popover,
            role: 'listbox',
            className: `dc__position-abs dc__outline-none-imp ${variant === 'menu' ? 'bg__menu--primary shadow__menu' : 'bg__overlay--primary shadow__overlay'} border__primary br-6 dc__overflow-hidden ${isAutoWidth ? 'dc_width-max-content dc__mxw-250' : ''}`,
            onClick: stopPropagation,
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
