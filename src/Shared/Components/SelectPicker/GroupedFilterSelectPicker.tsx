import { KeyboardEvent, useEffect, useRef, useState } from 'react'

import { useRegisterShortcut } from '@Common/Hooks'

import { ActionMenu, ActionMenuItemType, ActionMenuProps } from '../ActionMenu'
import { Icon } from '../Icon'
import { ShortcutKeyBadge } from '../Widgets'
import FilterSelectPicker from './FilterSelectPicker'
import { GroupedFilterSelectPickerProps } from './type'

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
    const triggerButtonRef = useRef<HTMLButtonElement>()

    // HOOKS
    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

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

    return selectedActionMenuItem ? (
        <FilterSelectPicker
            {...filterSelectPickerPropsMap[selectedActionMenuItem]}
            focusOnMount
            menuIsOpen
            onMenuClose={handleMenuClose}
            onKeyDown={handleKeyDown}
        />
    ) : (
        <ActionMenu {...restProps} id={id} isSearchable onClick={handleMenuItemClick}>
            <button
                type="button"
                ref={triggerButtonRef}
                data-testid={id}
                className="grouped-filter-select-picker__button dc__transparent px-7 py-5 border__primary br-4 flex dc__gap-6 bg__hover bg__secondary"
            >
                <Icon name={isFilterApplied ? 'ic-filter-applied' : 'ic-filter'} color="N700" />
                <span className="fs-12 lh-20 fw-6 cn-9">Filter</span>
                <ShortcutKeyBadge shortcutKey="F" />
            </button>
        </ActionMenu>
    )
}
