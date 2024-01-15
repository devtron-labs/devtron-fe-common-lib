import { ChangeEvent, FunctionComponent, useCallback, useState } from 'react'
import { ReactComponent as Search } from '../../Assets/Icon/ic-search.svg'
import { ReactComponent as Clear } from '../../Assets/Icon/ic-error-cross.svg'
import { SearchBarProps } from './types'
import './searchBar.scss'
import { debounce, noop } from '../Helper'

/**
 * Generic search input component with support for enter based and debounced search
 */
const SearchBar: FunctionComponent<SearchBarProps> = ({
    initialSearchText = '',
    handleSearchChange = noop,
    handleEnter = noop,
    inputProps = {},
    containerClassName,
    shouldDebounce = false,
    debounceTimeout = 300,
}) => {
    const [isSearchApplied, setIsSearchApplied] = useState(!!initialSearchText)
    const debouncedSearchChange = useCallback(debounce(handleSearchChange, debounceTimeout), [
        handleSearchChange,
        debounceTimeout,
    ])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setIsSearchApplied(!!value)
        if (shouldDebounce) {
            debouncedSearchChange(value)
        } else {
            handleSearchChange(value)
        }
    }

    const handleKeyDown = (e) => {
        const keyCode = e.key

        if (keyCode === 'Enter') {
            const event = { ...e, target: { ...e.target, value: e.target.value?.trim() } }
            handleSearchChange(event.target.value)
            handleEnter(event)
        }
    }

    const clearSearch = () => {
        handleSearchChange('')
    }

    return (
        <div className={containerClassName}>
            <div className="search-bar dc__position-rel en-2 bw-1 br-4 h-32">
                <Search className="search-bar__icon icon-dim-18" />
                <input
                    placeholder="Search"
                    {...inputProps}
                    type="text"
                    data-testid="search-bar"
                    defaultValue={initialSearchText}
                    className={`search-bar__input bcn-0 ${isSearchApplied ? 'search-bar__input--applied' : ''}`}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                {isSearchApplied && (
                    <button
                        className="flex search-bar__clear-button"
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
