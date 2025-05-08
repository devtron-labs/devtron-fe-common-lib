import { ChangeEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { UseActionMenuProps } from './types'
import {
    filterActionMenuOptions,
    getActionMenuActualPositionAlignment,
    getActionMenuAlignmentStyle,
    getActionMenuFlatOptions,
    getActionMenuFramerProps,
    getActionMenuPositionStyle,
} from './utils'

export const useActionMenu = ({
    position = 'bottom',
    alignment = 'start',
    width = 'auto',
    options,
    isSearchable,
    onClick,
}: UseActionMenuProps) => {
    // STATES
    const [open, setOpen] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const [actualPosition, setActualPosition] = useState<UseActionMenuProps['position']>(position)
    const [actualAlignment, setActualAlignment] = useState<UseActionMenuProps['alignment']>(alignment)
    const [searchTerm, setSearchTerm] = useState<string>('')

    // CONSTANTS
    const isAutoWidth = width === 'auto'

    // MEMOIZED CONSTANTS
    const filteredOptions = useMemo(
        () => (isSearchable ? filterActionMenuOptions(options, searchTerm) : options),
        [isSearchable, JSON.stringify(options), searchTerm],
    )

    const flatOptions = useMemo(() => getActionMenuFlatOptions(filteredOptions), [filteredOptions])

    // REFS
    const triggerRef = useRef<HTMLDivElement | null>(null)
    const menuRef = useRef<HTMLUListElement | null>(null)

    // HANDLERS
    const toggleMenu = () => setOpen(!open)

    const closeMenu = () => {
        setFocusedIndex(-1)
        setOpen(false)
    }

    const getNextIndex = (start: number, arrowDirection: 1 | -1) => {
        let index = start
        const totalOptions = flatOptions.length
        for (let i = 0; i < totalOptions; i++) {
            index = (index + arrowDirection + totalOptions) % totalOptions
            if (!flatOptions[index]?.option?.isDisabled) {
                return index
            }
        }
        return start
    }

    const handleMenuKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation()

        if (open) {
            switch (e.key) {
                case 'Escape':
                    e.preventDefault()
                    closeMenu()
                    triggerRef.current?.focus()
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    setFocusedIndex((i) => getNextIndex(i, 1))
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setFocusedIndex((i) => getNextIndex(i, -1))
                    break
                case 'Enter':
                case ' ': {
                    e.preventDefault()
                    const selectedItem = flatOptions[focusedIndex].option
                    if (!selectedItem.isDisabled) {
                        onClick(selectedItem)
                        closeMenu()
                    }
                    break
                }
                default:
            }
        }
    }

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
        if (!open && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            setOpen(true)
            setFocusedIndex(0)
        }

        handleMenuKeyDown(e)
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) {
                closeMenu()
            }
        }
        document.addEventListener('mousedown', onClickOutside)
        return () => document.removeEventListener('mousedown', onClickOutside)
    }, [])

    useLayoutEffect(() => {
        if (!open || !triggerRef.current || !menuRef.current) {
            return
        }

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const menuRect = menuRef.current.getBoundingClientRect()

        const { fallbackPosition, fallbackAlignment } = getActionMenuActualPositionAlignment({
            position,
            alignment,
            triggerRect,
            menuRect,
        })

        setActualPosition(fallbackPosition)
        setActualAlignment(fallbackAlignment)
    }, [open, position, alignment])

    return {
        open,
        flatOptions,
        filteredOptions,
        focusedIndex,
        triggerProps: {
            role: 'button',
            ref: triggerRef,
            onClick: toggleMenu,
            onKeyDown: handleTriggerKeyDown,
            'aria-haspopup': 'menu' as const,
            'aria-expanded': open,
            tabIndex: 0,
        },
        menuProps: {
            role: 'menu',
            ref: menuRef,
            className: `action-menu dc__position-abs bg__menu--primary shadow__menu border__primary br-6 px-0 dc__zi-5 mxh-300 dc__overflow-auto ${isAutoWidth ? 'dc_width-max-content dc__mxw-250' : ''}`,
            onKeyDown: handleMenuKeyDown,
            style: {
                width: !isAutoWidth ? `${width}px` : undefined,
                ...getActionMenuPositionStyle({ position: actualPosition }),
                ...getActionMenuAlignmentStyle({ position: actualPosition, alignment: actualAlignment }),
            },
            ...getActionMenuFramerProps({ position: actualPosition, alignment: actualAlignment }),
            transition: { duration: 0.2 },
        },
        setFocusedIndex,
        closeMenu,
        searchTerm,
        handleSearch,
    }
}
