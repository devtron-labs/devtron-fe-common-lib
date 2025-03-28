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

import { Dispatch, SetStateAction } from 'react'
import { Edge } from '@xyflow/react'

import { DropdownNodeProps, IconNodeProps, TextNodeProps } from './components'

export type GraphVisualizerExtendedNode = IconNodeProps | TextNodeProps | DropdownNodeProps

export type GraphVisualizerNode =
    | Omit<IconNodeProps, 'position'>
    | Omit<TextNodeProps, 'position'>
    | Omit<DropdownNodeProps, 'position'>

export type GraphVisualizerEdge = Omit<Edge, 'type'>

export interface GraphVisualizerProps {
    nodes: GraphVisualizerNode[]
    setNodes: Dispatch<SetStateAction<GraphVisualizerNode[]>>
    edges: GraphVisualizerEdge[]
    setEdges: Dispatch<SetStateAction<GraphVisualizerEdge[]>>
}
