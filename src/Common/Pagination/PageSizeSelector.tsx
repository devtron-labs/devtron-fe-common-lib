import React, { useRef, useState } from 'react'
import { PageSizeItemsProps, PageSizeOption, PageSizeSelectorProps } from './types'
import { useClickOutside } from '../Hooks'
import { getDefaultPageValueOptions } from './utils'

const PageSizeItems = ({
    optionValue,
    options,
    setOptions,
    handleCloseDropdown,
    changePageSize,
}: PageSizeItemsProps) => {
    const handlePageSizeSelect = () => {
        const newOptions = options.map((_option) => ({
            value: _option.value,
            selected: _option.value === optionValue,
        }))
        setOptions([...newOptions])
        handleCloseDropdown()
        changePageSize(optionValue)
    }

    return (
        <div key={optionValue} className="select__item" onClick={handlePageSizeSelect}>
            {optionValue}
        </div>
    )
}

const PageSizeSelector = ({ pageSizeOptions, pageSize, changePageSize }: PageSizeSelectorProps) => {
    const defaultOptions = getDefaultPageValueOptions(pageSizeOptions).map((option) => ({
        value: option.value,
        selected: option.value === pageSize,
    }))

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const [options, setOptions] = useState<PageSizeOption[]>(defaultOptions)

    const handleCloseDropdown = () => {
        setIsDropdownOpen(false)
    }

    const dropdownRef = useRef<HTMLDivElement>(null)
    useClickOutside(dropdownRef, handleCloseDropdown)

    const selectedOption = options.find((option) => option.selected)
    const font = isDropdownOpen ? 'fa fa-caret-up' : 'fa fa-caret-down'
    return (
        <div ref={dropdownRef}>
            {isDropdownOpen && (
                <div className="pagination__select-menu">
                    {options.map((_option) => (
                        <PageSizeItems
                            optionValue={_option.value}
                            options={options}
                            setOptions={setOptions}
                            handleCloseDropdown={handleCloseDropdown}
                            changePageSize={changePageSize}
                        />
                    ))}
                </div>
            )}

            <button type="button" className="select__button" onClick={handleCloseDropdown}>
                <span>{selectedOption ? selectedOption.value : ''}</span>
                <span className="select__icon">
                    <i className={font} />
                </span>
            </button>
        </div>
    )
}

export default PageSizeSelector
