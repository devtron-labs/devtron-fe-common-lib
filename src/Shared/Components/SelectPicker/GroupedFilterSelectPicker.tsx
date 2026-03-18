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

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'

import { useRegisterShortcut } from '@Common/Hooks'

import { ActionMenu, ActionMenuItemType, ActionMenuProps } from '../ActionMenu'
import { Icon } from '../Icon'
import { Popover, usePopover } from '../Popover'
import FilterSelectPicker from './FilterSelectPicker'
import { FilterSelectPickerMapSelectPickerVariant, GroupedFilterSelectPickerProps } from './type'

import './selectPicker.scss'

export const GroupedFilterSelectPicker = <T extends string | number>({
    id,
    filterSelectPickerPropsMap,
    isFilterApplied,
    ...restProps
}: GroupedFilterSelectPickerProps<T>) => {
    // STATES
    const [selectedActionMenuItem, setSelectedActionMenuItem] = useState<ActionMenuItemType<T>['id']>(null)

    // REFS
    const shouldFocusActionMenuRef = useRef<boolean>(false)
    const triggerButtonRef = useRef<HTMLButtonElement | null>(null)

    // HOOKS
    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    const selectedItemConfig = selectedActionMenuItem ? filterSelectPickerPropsMap[selectedActionMenuItem] : null
    const isPopOverVariant = selectedItemConfig?.variant === 'popOver'

    const {
        open: isFilterPopoverOpen,
        triggerProps: filterPopoverTriggerProps,
        overlayProps: filterPopoverOverlayProps,
        popoverProps: filterPopoverContentProps,
        openPopover: openFilterPopover,
        closePopover: closeFilterPopover,
        scrollableRef: filterPopoverScrollableRef,
    } = usePopover({
        id: `${id}-grouped-filter-popover`,
        position: isPopOverVariant ? selectedItemConfig.popoverConfig?.position : undefined,
        alignment: isPopOverVariant ? selectedItemConfig.popoverConfig?.alignment : undefined,
        width: isPopOverVariant ? selectedItemConfig.popoverConfig?.width : undefined,
        onOpen: (open) => {
            if (!open) {
                setSelectedActionMenuItem(null)
            }
        },
    })

    useEffect(() => {
        const shortcutCallback = () => {
            triggerButtonRef.current?.click()
        }

        registerShortcut({ keys: ['F'], callback: shortcutCallback })

        return () => {
            unregisterShortcut(['F'])
        }
    }, [])

    useEffect(() => {
        if (!selectedActionMenuItem && shouldFocusActionMenuRef.current) {
            triggerButtonRef.current?.click()
            shouldFocusActionMenuRef.current = false
        }
    }, [selectedActionMenuItem])

    useEffect(() => {
        if (selectedActionMenuItem && isPopOverVariant) {
            openFilterPopover()
        }
    }, [selectedActionMenuItem])

    // HANDLERS
    const handleMenuItemClick: ActionMenuProps<T>['onClick'] = (item) => {
        setSelectedActionMenuItem(item.id)
    }

    const handleMenuClose = () => {
        setSelectedActionMenuItem(null)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Backspace' && !(e.target as HTMLInputElement).value) {
            setSelectedActionMenuItem(null)
            shouldFocusActionMenuRef.current = true
        }
    }

    const filterTriggerButton = useMemo(
        () => (
            <button
                type="button"
                ref={triggerButtonRef}
                data-testid={id}
                className="grouped-filter-select-picker__button dc__transparent px-7 py-5 border__primary br-4 flex left dc__gap-6 bg__hover bg__secondary w-100"
            >
                <Icon name={isFilterApplied ? 'ic-filter-applied' : 'ic-filter'} color="N700" />
                <span className="fs-12 lh-20 fw-6 cn-9">Filter</span>
                <kbd className="icon-dim-20 flex bg__primary border__primary br-2 shadow__key fs-12 lh-20 cn-7">f</kbd>
            </button>
        ),
        [isFilterApplied],
    )

    const renderContent = () => {
        if (selectedActionMenuItem && isPopOverVariant) {
            return (
                <Popover
                    open={isFilterPopoverOpen}
                    triggerProps={filterPopoverTriggerProps}
                    overlayProps={filterPopoverOverlayProps}
                    popoverProps={{ ...filterPopoverContentProps, role: 'dialog' }}
                    buttonProps={null}
                    triggerElement={filterTriggerButton}
                >
                    {selectedItemConfig.component(closeFilterPopover, filterPopoverScrollableRef)}
                </Popover>
            )
        }

        if (selectedActionMenuItem) {
            const config = filterSelectPickerPropsMap[selectedActionMenuItem]
            if (config.variant !== 'popOver') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { variant: _variant, ...filterProps } = config as FilterSelectPickerMapSelectPickerVariant
                return (
                    <div className="grouped-filter-select-picker w-200">
                        <FilterSelectPicker
                            {...filterProps}
                            menuIsOpen
                            onMenuClose={handleMenuClose}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </div>
                )
            }
        }

        return (
            <ActionMenu {...restProps} id={id} isSearchable onClick={handleMenuItemClick}>
                {filterTriggerButton}
            </ActionMenu>
        )
    }

    return <div>{renderContent()}</div>
}
