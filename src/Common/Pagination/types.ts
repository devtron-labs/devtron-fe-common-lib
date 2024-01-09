export interface PageSizeOption {
    value: number
    selected: boolean
}
export interface PaginationProps {
    size: number
    pageSize: number
    offset: number
    changePage: (pageNo: number) => void
    changePageSize?: (pageSize: number) => void
    isPageSizeFix?: boolean
    pageSizeOptions?: PageSizeOption[]
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
