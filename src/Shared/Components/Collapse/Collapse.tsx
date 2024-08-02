import { useEffect, useState, useRef } from 'react'

import { CollapseProps } from './types'

export const Collapse = ({ expand, children }: CollapseProps) => {
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
                transitionProperty: 'height',
                transitionDuration: '0.3s',
                overflow: 'hidden',
            }}
        >
            <div ref={ref}>{children}</div>
        </div>
    )
}
