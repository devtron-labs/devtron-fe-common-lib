import { CreatePageArrType, Page, PageSizeOption } from './types'
import { FALLBACK_PAGE_SIZE_OPTIONS, VISIBLE_PAGES_LIMIT } from './constants'

export const createPageArr = ({ size, pageSize, selectedPageNo }: CreatePageArrType): Page[] => {
    const arr = []
    const numberOfPages = Math.ceil(size / pageSize)
    const lowerBound = selectedPageNo - 2 < 1 ? 1 : selectedPageNo - 2
    const upperBound = selectedPageNo + 2 > numberOfPages ? numberOfPages : selectedPageNo + 2
    for (let i = 1; i <= numberOfPages; i++) {
        arr.push({
            value: i,
            selected: i === selectedPageNo,
            isVisible: upperBound - VISIBLE_PAGES_LIMIT < i && i < lowerBound + VISIBLE_PAGES_LIMIT,
        })
    }
    return arr
}

export const getDefaultPageValueOptions = (pageSizeOptions: PageSizeOption[]): PageSizeOption[] => {
    return pageSizeOptions?.length ? pageSizeOptions : FALLBACK_PAGE_SIZE_OPTIONS
}
