import { useCallback, useState, Children, cloneElement } from 'react'
import TippyJS, { TippyProps as TippyJSProps } from '@tippyjs/react'

const Tippy = ({ children, ...rest }: TippyJSProps) => {
    const [showTippy, setShowTippy] = useState(false)

    const refCallback = useCallback((node: HTMLDivElement) => {
        if (node) {
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
