import { useCallback, useState, cloneElement } from 'react'
import TippyJS from '@tippyjs/react'
import { TooltipProps } from './types'

const Tooltip = ({
    showOnTruncate = false,
    alwaysShowTippyOnHover = false,
    children: child,
    ...rest
}: TooltipProps) => {
    const [isTextTruncated, setIsTextTruncated] = useState(false)

    const refCallback = useCallback((node: HTMLDivElement) => {
        if (node) {
            setIsTextTruncated(node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight)
        }
    }, [])

    return (!isTextTruncated || !showOnTruncate) && !alwaysShowTippyOnHover ? (
        cloneElement(child, { ...child.props, ref: refCallback })
    ) : (
        <TippyJS
            arrow={false}
            placement="top"
            {...rest}
            className={`default-tt dc__word-break-all dc__mxw-200 ${rest.className}`}
        >
            {cloneElement(child, { ...child.props, ref: refCallback })}
        </TippyJS>
    )
}

export default Tooltip
