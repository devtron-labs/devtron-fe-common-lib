import { cloneElement } from 'react'
import { useResizableTableConfig } from '@Common/SortableTableHeaderCell'
import { UseResizableTableConfigWrapperProps } from './types'

const UseResizableTableConfigWrapper = ({ children, columns }: UseResizableTableConfigWrapperProps) => {
    const resizableConfig = useResizableTableConfig({
        headersConfig: columns.map(({ label, size }) => {
            const {
                range: { minWidth, maxWidth, startWidth },
            } = size

            return {
                id: label,
                minWidth,
                width: startWidth,
                maxWidth: maxWidth === 'infinite' ? Number.MAX_SAFE_INTEGER : maxWidth,
            }
        }),
    })

    return cloneElement(children, { ...children.props, resizableConfig })
}

export default UseResizableTableConfigWrapper
