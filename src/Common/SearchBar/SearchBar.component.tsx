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

import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

import { ReactComponent as ICCross } from '@Icons/ic-cross.svg'
import { ReactComponent as Search } from '@Icons/ic-search.svg'
import { useRegisterShortcut } from '@Common/Hooks'
import { Button, ButtonStyleType, ButtonVariantType } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { debounce, noop } from '../Helper'
import { SearchBarProps } from './types'
import { getSearchBarHeightFromSize } from './utils'

import './searchBar.scss'

/**
 * Generic search input component with support for enter based and debounced search
 * Note: The component is uncontrolled
 *
 * @example Usage with default debounced search
 * ```tsx
 * <SearchBar handleSearchChange={triggerSearchApi} shouldDebounce />
 * ```
 *
 * @example Initial search text
 * ```tsx
 * <SearchBar initialSearchText="Keyword" />
 * ```
 *
 * @example Custom width
 * ```tsx
 * <SearchBar containerClassName="w-300" />
 * ```
 *
 * @example Trigger search on enter key press
 * ```tsx
 * <SearchBar handleEnter={triggerSearchApi} />
 * ```
 *
 * @example Custom timeout for debounced search
 * ```tsx
 * <SearchBar handleSearchChange={triggerSearchApi} shouldDebounce debounceTimeout={500} />
 * ```
 *
 * @example Placeholder for the search
 * ```tsx
 * <SearchBar inputProps={{ placeholder: 'Enter search text' }} />
 * ```
 */
const SearchBar = ({
    initialSearchText = '',
    handleSearchChange = () => {},
    handleEnter = () => {},
    inputProps = {},
    containerClassName,
    shouldDebounce = false,
    debounceTimeout = 300,
    dataTestId = 'search-bar',
    noBackgroundAndBorder = false,
    size = ComponentSizeType.medium,
    keyboardShortcut,
}: SearchBarProps) => {
    const [showClearButton, setShowClearButton] = useState(!!initialSearchText)
    const inputRef = useRef<HTMLInputElement>()
    const debouncedSearchChange = useCallback(debounce(handleSearchChange, debounceTimeout), [
        handleSearchChange,
        debounceTimeout,
    ])
    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    // assuming initialSearchText will change if we are changing history otherwise will be constant and will not change
    // since on changing history we expect to make api call using useAsync so not applying handleEnter
    useEffect(() => {
        inputRef.current.value = initialSearchText
        setShowClearButton(!!initialSearchText)
    }, [initialSearchText])

    useEffect(() => {
        if (keyboardShortcut) {
            registerShortcut({
                keys: [keyboardShortcut],
                callback: () => {
                    inputRef.current?.focus()
                },
            })

            return () => {
                unregisterShortcut([keyboardShortcut])
            }
        }

        return noop
    }, [keyboardShortcut])

    const _applySearch = (value: string) => {
        handleSearchChange(value)
        handleEnter(value)
    }

    const clearSearch = () => {
        inputRef.current.value = ''
        _applySearch('')
        setShowClearButton(false)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setShowClearButton(!!value)

        if (shouldDebounce) {
            debouncedSearchChange(value)
        } else {
            handleSearchChange(value)
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const { key } = e

        if (key === 'Enter') {
            e.preventDefault()
            const inputTarget = e.target as HTMLInputElement
            const value = inputTarget.value.trim()
            _applySearch(value)
        }
    }

    const inputCallbackRef: React.RefCallback<HTMLInputElement> = (node = null) => {
        if (inputProps.ref) {
            // eslint-disable-next-line no-param-reassign
            inputProps.ref.current = node
        }
        inputRef.current = node
    }

    const handleFilterKeyUp = (e: KeyboardEvent): void => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            inputRef.current?.blur()
        }
    }

    return (
        <div className={`search-bar-container ${containerClassName || ''}`}>
            <div
                className={`search-bar ${noBackgroundAndBorder ? 'dc__no-border dc__no-background dc__hover-n50' : 'bg__secondary en-2 dc__hover-border-n300'} focus-within-border-b5 dc__block w-100 min-w-200 dc__position-rel br-4 bw-1 ${getSearchBarHeightFromSize(size)}`}
            >
                <Search className="search-bar__icon dc__position-abs icon-color-n6 icon-dim-16" />
                <input
                    placeholder="Search"
                    data-testid={dataTestId}
                    type="text"
                    {...inputProps}
                    defaultValue={initialSearchText}
                    className={`search-bar__input  dc__position-abs w-100 h-100 br-4 dc__no-border pt-6 pr-10 pb-6 pl-30 fs-13 lh-20 fw-4 cn-9 placeholder-cn5 dc__left-0 ${
                        showClearButton || (!showClearButton && keyboardShortcut) ? 'pr-30' : 'pr-10'
                    } ${noBackgroundAndBorder ? 'dc__no-background' : 'bg__secondary'}`}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    ref={inputCallbackRef}
                    onKeyUp={handleFilterKeyUp}
                />
                {/* TODO: Sync with product since it should have ic-enter in case of not applied */}
                {showClearButton ? (
                    <div className="flex search-bar__clear-button dc__position-abs dc__transparent">
                        <Button
                            icon={<ICCross />}
                            size={ComponentSizeType.xs}
                            variant={ButtonVariantType.borderLess}
                            style={ButtonStyleType.negativeGrey}
                            dataTestId="clear-search"
                            ariaLabel="Clear search"
                            onClick={clearSearch}
                            showAriaLabelInTippy={false}
                        />
                    </div>
                ) : (
                    keyboardShortcut && (
                        <kbd className="icon-dim-20 flex bg__primary border__primary br-2 shadow__key fs-12 lh-20 cn-7 dc__no-shrink dc__position-abs search-bar__kbd-shortcut">
                            {keyboardShortcut}
                        </kbd>
                    )
                )}
            </div>
        </div>
    )
}

export default SearchBar
