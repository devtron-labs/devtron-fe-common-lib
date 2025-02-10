import { NodeProps } from '@xyflow/react'

import { ComponentSizeType } from '@Shared/constants'

import { SelectPicker, SelectPickerVariantType } from '../../SelectPicker'
import { DropdownNodeProps } from './types'
import { BaseNode } from './BaseNode'

export const DropdownNode = ({ id, data, isConnectable }: NodeProps<DropdownNodeProps>) => {
    const { isError, ...restData } = data

    return (
        <BaseNode
            id={id}
            className={`bg__primary border__primary br-6 dc__inline-flex w-180 ${isError ? 'er-5' : ''}`}
            isConnectable={isConnectable}
        >
            <SelectPicker<string | number, false>
                {...restData}
                classNamePrefix="graph-visualizer-dropdown-node"
                variant={SelectPickerVariantType.BORDER_LESS}
                menuPortalTarget={document.querySelector('.graph-visualizer')}
                menuSize={ComponentSizeType.xs}
                fullWidth
            />
        </BaseNode>
    )
}
