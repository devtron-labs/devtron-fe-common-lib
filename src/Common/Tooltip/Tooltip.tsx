import { useCallback, useState, cloneElement } from 'react'
import TippyJS from '@tippyjs/react'
import { TooltipProps } from './types'

const Tooltip = ({
    alwaysShowTippyOnHover,
    // NOTE: if alwaysShowTippyOnHover is being passed by user don't apply truncation logic at all
    showOnTruncate = alwaysShowTippyOnHover === undefined,
    wordBreak = true,
    children: child,
    ...rest
}: TooltipProps) => {
    const [isTextTruncated, setIsTextTruncated] = useState(false)

    const refCallback = useCallback((node: HTMLDivElement) => {
        if (node) {
            // NOTE: for line-clamp we need to check scrollHeight against clientHeight since orientation
            // is set to vertical through -webkit-box-orient prop that is needed for line-clamp to work
            // see: https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
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
            className={`default-tt ${wordBreak ? 'dc__word-break' : ''} dc__mxw-200-imp ${rest.className}`}
        >
            {cloneElement(child, { ...child.props, ref: refCallback })}
        </TippyJS>
    )
}

export default Tooltip
