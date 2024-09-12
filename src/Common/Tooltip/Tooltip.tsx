import { useState, cloneElement } from 'react'
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

    const handleMouseEnterEvent: React.MouseEventHandler = (event) => {
        const { currentTarget: node } = event
        const isTextOverflowing = node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight
        if (isTextOverflowing && !isTextTruncated) {
            setIsTextTruncated(true)
        } else if (!isTextOverflowing && isTextTruncated) {
            setIsTextTruncated(false)
        }
    }

    return (!isTextTruncated || !showOnTruncate) && !alwaysShowTippyOnHover ? (
        cloneElement(child, { ...child.props, onMouseEnter: handleMouseEnterEvent })
    ) : (
        <TippyJS
            arrow={false}
            placement="top"
            {...rest}
            className={`default-tt ${wordBreak ? 'dc__word-break-all' : ''} dc__mxw-200-imp ${rest.className}`}
        >
            {cloneElement(child, { ...child.props, onMouseEnter: handleMouseEnterEvent })}
        </TippyJS>
    )
}

export default Tooltip
