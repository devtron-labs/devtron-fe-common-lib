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
