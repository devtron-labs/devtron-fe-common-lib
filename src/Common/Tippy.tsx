import { useCallback, useState, Children, cloneElement } from 'react'
import TippyJS from '@tippyjs/react'
import { TippyProps } from './Types'

const Tippy = ({ showOnTruncate = false, children, ...rest }: TippyProps) => {
    const [showTippy, setShowTippy] = useState(false)

    const refCallback = useCallback((node: HTMLDivElement) => {
        if (node && showOnTruncate) {
            setShowTippy(node.scrollWidth > node.clientWidth)
        }
    }, [])

    const child = Children.only(children)

    return !showTippy ? (
        cloneElement(child, { ...child.props, ref: refCallback })
    ) : (
        <TippyJS {...rest}>{cloneElement(child, { ...child.props, ref: refCallback })}</TippyJS>
    )
}

export default Tippy
