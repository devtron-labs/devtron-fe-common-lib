import { Handle, NodeProps, Position, useEdges } from '@xyflow/react'

import { IconNodeProps } from './types'

export const IconNode = ({ data, id, isConnectable }: NodeProps<IconNodeProps>) => {
    const { icon } = data
    const edges = useEdges()

    const hasSource = edges.some(({ source }) => source === id)
    const hasTarget = edges.some(({ target }) => target === id)

    return (
        <div className="bg__primary border__primary br-6 dc__inline-flex p-7">
            <span className="dc__no-shrink flex dc__fill-available-space icon-dim-20">{icon}</span>
            {hasSource && <Handle type="source" position={Position.Right} isConnectable={isConnectable} />}
            {hasTarget && <Handle type="target" position={Position.Left} isConnectable={isConnectable} />}
        </div>
    )
}
