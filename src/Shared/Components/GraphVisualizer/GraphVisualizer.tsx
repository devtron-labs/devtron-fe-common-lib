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
    ReactFlowProps,
    ReactFlowProvider,
    Viewport,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { DEFAULT_VIEWPORT, NODE_TYPES, PADDING_X, PADDING_Y } from './constants'
import { GraphVisualizerExtendedNode, GraphVisualizerProps } from './types'
import { processEdges, processNodes } from './utils'

import './styles.scss'

const options: ReactFlowProps['proOptions'] = {
    hideAttribution: true,
}

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
            let shouldPanOnScroll = false
            entries.forEach((entry) => {
                const { width } = entry.contentRect
                shouldPanOnScroll = reactFlowInstanceRef.current.getNodesBounds(nodes).width + PADDING_X * 2 > width
            })
            setPanOnScroll(shouldPanOnScroll)
        })

        observer.observe(graphVisualizerRef.current)

        return () => {
            observer.disconnect()
        }
    }, [reactFlowInstanceRef.current])

    // METHODS
    const onNodesChange: OnNodesChange<GraphVisualizerExtendedNode> = (changes) => {
        setNodes((nds) =>
            applyNodeChanges(changes, processNodes(nds, edges)).map(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ({ position, ...node }) => node,
            ),
        )
    }

    const onEdgesChange: OnEdgesChange = (changes) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setEdges((eds) => applyEdgeChanges(changes, processEdges(eds)).map(({ type, ...edge }) => edge))
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
                    proOptions={options}
                />
            </div>
        </ReactFlowProvider>
    )
}
