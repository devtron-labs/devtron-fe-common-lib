import { Handle, NodeProps, Position, useEdges } from '@xyflow/react'

import { ComponentSizeType } from '@Shared/constants'

import { SelectPicker, SelectPickerVariantType } from '../../SelectPicker'
import { DropdownNodeProps } from './types'

export const DropdownNode = ({ id, data, isConnectable }: NodeProps<DropdownNodeProps>) => {
    const { isError, ...restData } = data
    const edges = useEdges()

    const hasSource = edges.some(({ source }) => source === id)
    const hasTarget = edges.some(({ target }) => target === id)

    return (
        <div className={`bg__primary border__primary br-6 dc__inline-flex w-180 ${isError ? 'er-5' : ''}`}>
            <SelectPicker<string | number, false>
                {...restData}
                classNamePrefix="graph-visualizer-dropdown-node"
                variant={SelectPickerVariantType.BORDER_LESS}
                menuPortalTarget={document.querySelector('.graph-visualizer')}
                menuSize={ComponentSizeType.xs}
                fullWidth
            />
            {hasSource && <Handle type="source" position={Position.Right} isConnectable={isConnectable} />}
            {hasTarget && <Handle type="target" position={Position.Left} isConnectable={isConnectable} />}
        </div>
    )
}
