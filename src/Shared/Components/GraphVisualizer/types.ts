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
