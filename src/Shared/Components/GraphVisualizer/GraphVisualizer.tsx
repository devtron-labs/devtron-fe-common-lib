import { useEffect, useMemo, useRef, useState } from 'react'
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
import { GraphVisualizerExtendedNode, GraphVisualizerProps } from './types'
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
    const graphVisualizerRef = useRef<HTMLDivElement>()

    // STATES
    const [viewport, setViewport] = useState<Viewport>()
    const [panOnScroll, setPanOnScroll] = useState(false)

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

    // Enable `panOnScroll` if the total node width exceeds the available width.
    // When `panOnScroll` is true, it prevents browser scrolling while interacting with the React Flow graph
    // So we are disabling `panOnScroll` when no scrolling is needed, so as to browser scrolling works.
    useEffect(() => {
        if (!graphVisualizerRef.current || !reactFlowInstanceRef.current) return () => {}

        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const { width } = entry.contentRect
                setPanOnScroll(reactFlowInstanceRef.current.getNodesBounds(nodes).width + PADDING_X * 2 > width)
            })
        })

        observer.observe(graphVisualizerRef.current)

        return () => {
            observer.disconnect()
        }
    }, [reactFlowInstanceRef.current])

    // METHODS
    const onNodesChange: OnNodesChange<GraphVisualizerExtendedNode> = (changes) => {
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
        const bounds = reactFlowInstanceRef.current.getNodesBounds(nodes)
        const normalizedViewport = updatedViewport
        normalizedViewport.x = Math.min(updatedViewport.x, DEFAULT_VIEWPORT.x)
        normalizedViewport.y = Math.abs(bounds.y - PADDING_Y)
        setViewport(normalizedViewport)
    }

    const onInit = async (reactFlowInstance: ReactFlowInstance) => {
        reactFlowInstanceRef.current = reactFlowInstance
        await reactFlowInstance.setViewport(DEFAULT_VIEWPORT)
    }

    return (
        <ReactFlowProvider>
            <div
                ref={graphVisualizerRef}
                className="graph-visualizer"
                style={{ height: containerHeight ? `${containerHeight}px` : '100%' }}
            >
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
                    panOnScroll={panOnScroll}
                    panOnScrollMode={PanOnScrollMode.Horizontal}
                    preventScrolling={panOnScroll}
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
