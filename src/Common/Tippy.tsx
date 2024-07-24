import { useEffect, useRef, useState } from 'react'
import TippyJS, { TippyProps as TippyJSProps } from '@tippyjs/react'

// TODO: we should generalize this Tippy to work without sending in this truncateWidth
const Tippy = ({ truncateWidth = 0, children, ...rest }: TippyJSProps & Record<'truncateWidth', number>) => {
    // NOTE: if showOnTruncate is off then always showTippy
    const [showTippy, setShowTippy] = useState(!!truncateWidth)
    const ref = useRef(null)

    useEffect(() => {
        if (truncateWidth) {
            setShowTippy(ref.current?.offsetWidth >= truncateWidth)
        }
    }, [ref.current?.offsetWidth])

    return !showTippy ? (
        children
    ) : (
        <TippyJS {...rest}>
            <span ref={ref}>{children}</span>
        </TippyJS>
    )
}

export default Tippy
