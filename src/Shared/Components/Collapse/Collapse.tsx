import { useEffect, useState, useRef, useMemo } from 'react'

import { CollapseProps } from './types'

/**
 * Collapse component for expanding/collapsing content with smooth transitions.
 * Dynamically calculates and applies height based on the content, with support
 * for callback execution when the transition ends.
 */
export const Collapse = ({ expand, onTransitionEnd, children }: CollapseProps) => {
    // Ref to access the content container
    const contentRef = useRef<HTMLDivElement>(null)
    // State for dynamically calculated height
    const [contentHeight, setContentHeight] = useState(0)

    // Calculate and update content height when children change or initially on mount
    useEffect(() => {
        if (contentRef.current) {
            const _contentHeight = contentRef.current.clientHeight || 0
            setContentHeight(_contentHeight)
        }
    }, [children])

    const collapseStyle = useMemo(
        () => ({
            // Set height based on the 'expand' prop
            height: expand ? contentHeight : 0,
            transition: 'height 200ms ease-out',
            // Hide content overflow during collapse
            overflow: 'hidden',
        }),
        [expand, contentHeight],
    )

    return (
        <div style={collapseStyle} onTransitionEnd={onTransitionEnd}>
            {/* Content container with reference to calculate height */}
            <div ref={contentRef}>{children}</div>
        </div>
    )
}
