import { useMemo, useRef, useState } from 'react'
import {
    applyEdgeChanges,
    applyNodeChanges,
    CoordinateExtent,
    OnEdgesChange,
    OnNodesChange,
    PanOnScrollMode,
    ReactFlow,
    ReactFlowInstance,
    ReactFlowProvider,
    Viewport,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { DEFAULT_VIEWPORT, NODE_TYPES, PADDING_X, PADDING_Y } from './constants'
import { GraphVisualizerBaseNode, GraphVisualizerProps } from './types'
import { processEdges, processNodes } from './utils'

import './styles.scss'

export const GraphVisualizer = ({
    nodes: initialNodes,
    edges: initialEdges,
    setNodes,
    setEdges,
}: GraphVisualizerProps) => {
    // REFS
    const reactFlowInstanceRef = useRef<ReactFlowInstance>()

    // STATES
    const [viewport, setViewport] = useState<Viewport>()

    // MEMOS
    const nodes = useMemo(() => processNodes(initialNodes, initialEdges), [initialNodes])
    const edges = useMemo(() => processEdges(initialEdges), [initialEdges])

    const translateExtent = useMemo<CoordinateExtent>(() => {
        if (reactFlowInstanceRef.current && nodes.length) {
            const bounds = reactFlowInstanceRef.current.getNodesBounds(nodes)

            return [
                [bounds.x - PADDING_X, bounds.y - PADDING_Y], // minX, minY
                [bounds.x + bounds.width + PADDING_X, bounds.y + bounds.height + PADDING_Y], // maxX, maxY
            ]
        }

        return [
            [-Infinity, -Infinity],
            [Infinity, Infinity],
        ]
    }, [reactFlowInstanceRef.current, nodes])

    const containerHeight = useMemo(() => {
        if (reactFlowInstanceRef.current && nodes.length) {
            return reactFlowInstanceRef.current.getNodesBounds(nodes).height + PADDING_Y * 2
        }

        return 0
    }, [reactFlowInstanceRef.current, nodes])

    // METHODS
    const onNodesChange: OnNodesChange<GraphVisualizerBaseNode> = (changes) => {
        setNodes((nds) =>
            applyNodeChanges(changes, processNodes(nds, edges)).map((node) => {
                const _node = node
                delete _node.position
                return _node
            }),
        )
    }

    const onEdgesChange: OnEdgesChange = (changes) => {
        setEdges((eds) =>
            applyEdgeChanges(changes, processEdges(eds)).map((edge) => {
                const _edge = edge
                delete _edge.type
                return _edge
            }),
        )
    }

    const onViewportChange = (updatedViewport: Viewport) => {
        const normalizedViewport = updatedViewport
        normalizedViewport.x = Math.min(updatedViewport.x, DEFAULT_VIEWPORT.x)
        setViewport(normalizedViewport)
    }

    const onInit = async (reactFlowInstance: ReactFlowInstance) => {
        reactFlowInstanceRef.current = reactFlowInstance
        const bounds = reactFlowInstance.getNodesBounds(nodes)
        await reactFlowInstance.setViewport({
            ...DEFAULT_VIEWPORT,
            y: Math.abs(bounds.y - PADDING_Y),
        })
    }

    return (
        <ReactFlowProvider>
            <div className="graph-visualizer" style={{ height: containerHeight ? `${containerHeight}px` : '100%' }}>
                <ReactFlow
                    className="border__secondary br-8"
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={NODE_TYPES}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    translateExtent={translateExtent}
                    viewport={viewport}
                    onViewportChange={onViewportChange}
                    panOnScroll
                    panOnScrollMode={PanOnScrollMode.Horizontal}
                    panOnDrag={false}
                    zoomOnDoubleClick={false}
                    zoomOnPinch={false}
                    zoomOnScroll={false}
                    nodesConnectable={false}
                    nodesDraggable={false}
                    elementsSelectable={false}
                    onInit={onInit}
                />
            </div>
        </ReactFlowProvider>
    )
}
