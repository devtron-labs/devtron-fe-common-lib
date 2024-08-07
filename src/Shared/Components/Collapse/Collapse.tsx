import { useEffect, useState, useRef } from 'react'

import { CollapseProps } from './types'

export const Collapse = ({ expand, onTransitionEnd, children }: CollapseProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const [contentHeight, setContentHeight] = useState(0)

    useEffect(() => {
        if (ref.current) {
            setContentHeight(ref.current.clientHeight)
        }
    }, [children])

    return (
        <div
            style={{
                height: expand ? contentHeight : 0,
                transition: 'height 200ms ease-out',
                overflow: 'hidden',
            }}
            onTransitionEnd={onTransitionEnd}
        >
            <div ref={ref}>{children}</div>
        </div>
    )
}
