import { Dispatch, SetStateAction } from 'react'
import { BuiltInNode, Edge } from '@xyflow/react'

import { DropdownNodeProps, IconNodeProps, TextNodeProps } from './components'

export type GraphVisualizerBaseNode = IconNodeProps | TextNodeProps | DropdownNodeProps | BuiltInNode

export type GraphVisualizerNode = Omit<GraphVisualizerBaseNode, 'position'>

export type GraphVisualizerEdge = Omit<Edge, 'type'>

export interface GraphVisualizerProps {
    nodes: GraphVisualizerNode[]
    setNodes: Dispatch<SetStateAction<GraphVisualizerNode[]>>
    edges: GraphVisualizerEdge[]
    setEdges: Dispatch<SetStateAction<GraphVisualizerEdge[]>>
}
