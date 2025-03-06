import { useMemo } from 'react'
import { Handle, Position, useEdges } from '@xyflow/react'

import { BaseNodeProps } from './types'

export const BaseNode = ({ id, className, isConnectable, children }: BaseNodeProps) => {
    const edges = useEdges()

    const { hasSource, hasTarget } = useMemo(
        () => ({
            hasSource: edges.some(({ source }) => source === id),
            hasTarget: edges.some(({ target }) => target === id),
        }),
        [edges],
    )

    return (
        <div className={className}>
            {children}
            {hasSource && <Handle type="source" position={Position.Right} isConnectable={isConnectable} />}
            {hasTarget && <Handle type="target" position={Position.Left} isConnectable={isConnectable} />}
        </div>
    )
}
