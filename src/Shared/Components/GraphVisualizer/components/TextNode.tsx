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
