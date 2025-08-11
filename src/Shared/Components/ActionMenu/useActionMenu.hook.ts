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

import { ChangeEvent, createRef, RefObject, useEffect, useRef, useState } from 'react'

import { usePopover, UsePopoverProps } from '../Popover'
import { UseActionMenuProps } from './types'
import { filterActionMenuOptions, getActionMenuFlatOptions } from './utils'

export const useActionMenu = <T extends string | number>({
    id,
    position = 'bottom',
    alignment = 'start',
    width = 'auto',
    options,
    isSearchable,
    onOpen,
}: UseActionMenuProps<T>) => {
    // STATES
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const [searchTerm, setSearchTerm] = useState('')

    // CONSTANTS
    const filteredOptions = isSearchable ? filterActionMenuOptions(options, searchTerm) : options
    const flatOptions = getActionMenuFlatOptions(filteredOptions)

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
                case 'Tab':
                    e.preventDefault()

                    if (e.shiftKey && e.key === 'Tab') {
                        setFocusedIndex((i) => getNextIndex(i, -1))
                        break
                    }

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

    const handleTriggerKeyDown: UsePopoverProps['onTriggerKeyDown'] = (e, openState) => {
        if (!openState && (e.key === 'Enter' || e.key === ' ')) {
            setFocusedIndex(0)
        }
    }

    // POPOVER HOOK
    const { open, closePopover, overlayProps, popoverProps, triggerProps, scrollableRef } = usePopover({
        id,
        position,
        alignment,
        width,
        onOpen,
        onPopoverKeyDown: handlePopoverKeyDown,
        onTriggerKeyDown: handleTriggerKeyDown,
    })

    // CLEANING UP STATES AFTER ACTION MENU CLOSE
    useEffect(() => {
        if (!open) {
            setFocusedIndex(-1)
            setSearchTerm('')
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
        scrollableRef,
    }
}
