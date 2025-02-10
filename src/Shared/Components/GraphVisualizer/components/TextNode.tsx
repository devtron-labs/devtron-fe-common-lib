import { NodeProps } from '@xyflow/react'

import { Tooltip } from '@Common/Tooltip'

import { TextNodeProps } from './types'
import { BaseNode } from './BaseNode'

export const TextNode = ({ id, data, isConnectable }: NodeProps<TextNodeProps>) => {
    const { icon, text } = data

    return (
        <BaseNode
            id={id}
            className="bg__primary border__primary br-6 p-7 dc__inline-flex dc__align-items-center dc__gap-8 w-180"
            isConnectable={isConnectable}
        >
            {!!icon && <span className="dc__no-shrink flex dc__fill-available-space icon-dim-20">{icon}</span>}
            <Tooltip content={text}>
                <p className="m-0 fs-12 lh-20 fw-6 cn-9 dc__truncate">{text}</p>
            </Tooltip>
        </BaseNode>
    )
}
