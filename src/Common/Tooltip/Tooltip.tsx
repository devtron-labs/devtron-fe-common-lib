import { useCallback, useState, cloneElement, useRef, useEffect } from 'react'
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
    const nodeRef = useRef<HTMLElement>(null)

    const refCallback = useCallback((node: HTMLElement) => {
        if (node) {
            // NOTE: for line-clamp we need to check scrollHeight against clientHeight since orientation
            // is set to vertical through -webkit-box-orient prop that is needed for line-clamp to work
            // see: https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
            nodeRef.current = node
            setIsTextTruncated(node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight)
        }
    }, [])

    useEffect(() => {
        if (!nodeRef.current) {
            return
        }
        const hasTextOverflown =
            nodeRef.current?.scrollWidth > nodeRef.current?.clientWidth ||
            nodeRef.current?.scrollHeight > nodeRef.current?.clientHeight
        if (hasTextOverflown && !isTextTruncated) {
            setIsTextTruncated(true)
        }
        if (!hasTextOverflown && isTextTruncated) {
            setIsTextTruncated(false)
        }
    })

    return (!isTextTruncated || !showOnTruncate) && !alwaysShowTippyOnHover ? (
        cloneElement(child, { ...child.props, ref: refCallback })
    ) : (
        <TippyJS
            arrow={false}
            placement="top"
            {...rest}
            className={`default-tt ${wordBreak ? 'dc__word-break-all' : ''} dc__mxw-200 ${rest.className}`}
        >
            {cloneElement(child, { ...child.props, ref: refCallback })}
        </TippyJS>
    )
}

export default Tooltip
