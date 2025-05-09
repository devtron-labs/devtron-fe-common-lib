import { ChangeEvent, createRef, RefObject, useEffect, useMemo, useRef, useState } from 'react'

import { usePopover, UsePopoverProps } from '../Popover'
import { UseActionMenuProps } from './types'
import { filterActionMenuOptions, getActionMenuFlatOptions } from './utils'

export const useActionMenu = ({
    id,
    position = 'bottom',
    alignment = 'start',
    width = 'auto',
    options,
    isSearchable,
    onOpen,
}: UseActionMenuProps) => {
    // STATES
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const [searchTerm, setSearchTerm] = useState('')

    // MEMOIZED CONSTANTS
    const filteredOptions = useMemo(
        () => (isSearchable ? filterActionMenuOptions(options, searchTerm) : options),
        [isSearchable, JSON.stringify(options), searchTerm],
    )

    const flatOptions = useMemo(() => getActionMenuFlatOptions(filteredOptions), [filteredOptions])

    // REFS
    const itemsRef = useRef<RefObject<HTMLAnchorElement | HTMLButtonElement>[]>(
        flatOptions.map(() => createRef<HTMLAnchorElement | HTMLButtonElement>()),
    )

    useEffect(() => {
        itemsRef.current = flatOptions.map(() => createRef<HTMLAnchorElement | HTMLButtonElement>())
    }, [flatOptions.length])

    // HANDLERS
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
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

    const handlePopoverKeyDown: UsePopoverProps['onPopoverKeyDown'] = (e, openState, closePopover) => {
        e.stopPropagation()

        if (openState) {
            switch (e.key) {
                case 'Escape':
                    e.preventDefault()
                    closePopover()
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
                    const selectedItemRef = itemsRef.current[focusedIndex].current
                    if (!selectedItem.isDisabled && selectedItemRef) {
                        selectedItemRef.click()
                    }
                    break
                }
                default:
            }
        }
    }

    const handleTriggerKeyDown: UsePopoverProps['onTriggerKeyDown'] = (e, openState, closePopover) => {
        if (!openState && (e.key === 'Enter' || e.key === ' ')) {
            setFocusedIndex(0)
        }

        handlePopoverKeyDown(e, openState, closePopover)
    }

    // POPOVER HOOK
    const { open, closePopover, overlayProps, popoverProps, triggerProps } = usePopover({
        id,
        position,
        alignment,
        width,
        onOpen,
        onPopoverKeyDown: handlePopoverKeyDown,
        onTriggerKeyDown: handleTriggerKeyDown,
    })

    useEffect(() => {
        if (!open) {
            setFocusedIndex(-1)
        }
    }, [open])

    return {
        open,
        flatOptions,
        filteredOptions,
        focusedIndex,
        itemsRef,
        triggerProps,
        overlayProps,
        popoverProps,
        setFocusedIndex,
        closePopover,
        searchTerm,
        handleSearch,
    }
}
