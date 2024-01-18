export interface PageSizeOption {
    value: number
    selected: boolean
}
export interface PaginationProps {
    /**
     * number of items
     */
    size: number
    /**
     * pageSize
     */
    pageSize: number
    offset: number
    changePage: (pageNo: number) => void
    changePageSize?: (pageSize: number) => void
    /**
     * If true will not show page size selector
     */
    isPageSizeFix?: boolean
    /**
     * If given would show these options in page size selector else [20,40,50] with 20 as selected
     */
    pageSizeOptions?: PageSizeOption[]
    /**
     * class for wrapper
     */
    rootClassName?: string
}

export interface Page {
    value: number
    selected: boolean
    isVisible: boolean
}

export interface CreatePageArrType extends Pick<PaginationProps, 'size' | 'pageSize'> {
    selectedPageNo: number
}

export interface PageSizeSelectorProps
    extends Pick<PaginationProps, 'pageSizeOptions' | 'pageSize' | 'changePageSize'> {}

export interface PageSizeItemsProps extends Pick<PageSizeSelectorProps, 'changePageSize'> {
    optionValue: PageSizeOption['value']
    options: PageSizeOption[]
    setOptions: React.Dispatch<React.SetStateAction<PageSizeOption[]>>
    handleCloseDropdown: () => void
}

export interface PageValueItemProps {
    value: PageSizeOption['value']
    isSelected: PageSizeOption['selected']
    selectPage: (selectedPageNo: number) => void
}
