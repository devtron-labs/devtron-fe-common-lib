/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
                variant={SelectPickerVariantType.COMPACT}
                menuPortalTarget={document.querySelector('.graph-visualizer')}
                menuSize={ComponentSizeType.xs}
                fullWidth
            />
        </BaseNode>
    )
}
