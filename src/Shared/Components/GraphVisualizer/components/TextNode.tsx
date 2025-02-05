import { Handle, NodeProps, Position, useEdges } from '@xyflow/react'

import { Tooltip } from '@Common/Tooltip'

import { TextNodeProps } from './types'

export const TextNode = ({ id, data, isConnectable }: NodeProps<TextNodeProps>) => {
    const { icon, text } = data
    const edges = useEdges()

    const hasSource = edges.some(({ source }) => source === id)
    const hasTarget = edges.some(({ target }) => target === id)

    return (
        <div className="bg__primary border__primary br-6 p-7 dc__inline-flex dc__align-items-center dc__gap-8 w-180">
            {!!icon && <span className="dc__no-shrink flex dc__fill-available-space icon-dim-20">{icon}</span>}
            <Tooltip content={text}>
                <p className="m-0 fs-12 lh-20 fw-6 cn-9 dc__ellipsis-right">{text}</p>
            </Tooltip>
            {hasSource && <Handle type="source" position={Position.Right} isConnectable={isConnectable} />}
            {hasTarget && <Handle type="target" position={Position.Left} isConnectable={isConnectable} />}
        </div>
    )
}
