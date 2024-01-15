import { CreatePageArrType, Page, PageSizeOption } from './types'
import { FALLBACK_PAGE_SIZE_OPTIONS, VISIBLE_PAGES_LIMIT } from './constants'

/**
 * Returns an array of pages numbers and whether they are selected, visible or not
 */
export const createPageArr = ({ size, pageSize, selectedPageNo }: CreatePageArrType): Page[] => {
    const arr = []
    const numberOfPages = Math.ceil(size / pageSize)
    // we are showing 2 numbers before and after the selected page, so computing the lower and upper bounds
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

export const getDefaultPageValueOptions = (pageSizeOptions: PageSizeOption[]): PageSizeOption[] =>
    pageSizeOptions?.length ? pageSizeOptions : FALLBACK_PAGE_SIZE_OPTIONS
