import { ChangeEvent, useCallback, useRef, useState, KeyboardEvent } from 'react'
import { ReactComponent as Search } from '../../Assets/Icon/ic-search.svg'
import { ReactComponent as Clear } from '../../Assets/Icon/ic-error-cross.svg'
import { SearchBarProps } from './types'
import './searchBar.scss'
import { debounce } from '../Helper'

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
    placeholder = 'Search',
    inputClassName = '',
}: SearchBarProps) => {
    const [showClearButton, setShowClearButton] = useState(!!initialSearchText)
    const inputRef = useRef<HTMLInputElement>()
    const debouncedSearchChange = useCallback(debounce(handleSearchChange, debounceTimeout), [
        handleSearchChange,
        debounceTimeout,
    ])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setShowClearButton(!!value)
        if (shouldDebounce) {
            debouncedSearchChange(value)
        } else {
            handleSearchChange(value)
        }
    }

    const _applySearch = (value: string) => {
        handleSearchChange(value)
        handleEnter(value)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const { key } = e

        if (key === 'Enter') {
            const inputTarget = e.target as HTMLInputElement
            const value = inputTarget.value.trim()
            _applySearch(value)
        }
    }

    const clearSearch = () => {
        inputRef.current.value = ''
        _applySearch('')
    }

    return (
        <div className={containerClassName}>
            <div className="search-bar bcn-0 dc__block w-100 min-w-200 dc__position-rel en-2 bw-1 br-4 h-32">
                <Search className="search-bar__icon dc__position-abs icon-color-n6 icon-dim-18" />
                <input
                    placeholder={placeholder}
                    data-testid="search-bar"
                    type="text"
                    {...inputProps}
                    defaultValue={initialSearchText}
                    className={`search-bar__input bcn-0 dc__position-abs w-100 h-100 br-4 dc__no-border pt-6 pr-10 pb-6 pl-30 fs-13 lh-20 fw-4 cn-9 placeholder-cn5 ${
                        showClearButton ? 'pr-30' : 'pr-10'
                    } ${inputClassName}}`}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                />
                {showClearButton && (
                    <button
                        className="flex search-bar__clear-button dc__position-abs dc__transparent mt-0 mb-0 mr-5 ml-5"
                        type="button"
                        onClick={clearSearch}
                        aria-label="Clear search"
                    >
                        <Clear className="icon-dim-18 icon-n4 dc__vertical-align-middle" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default SearchBar
