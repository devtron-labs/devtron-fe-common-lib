import { NodeProps } from '@xyflow/react'

import { IconNodeProps } from './types'
import { BaseNode } from './BaseNode'

export const IconNode = ({ data, id, isConnectable }: NodeProps<IconNodeProps>) => {
    const { icon } = data

    return (
        <BaseNode
            id={id}
            isConnectable={isConnectable}
            className="bg__primary border__primary br-6 dc__inline-flex p-7"
        >
            <span className="dc__no-shrink flex dc__fill-available-space icon-dim-20">{icon}</span>
        </BaseNode>
    )
}
