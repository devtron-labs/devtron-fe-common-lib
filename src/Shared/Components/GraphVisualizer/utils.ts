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

import { Edge, MarkerType, Viewport } from '@xyflow/react'

import { NODE_GAP_X, NODE_GAP_Y, NODE_HEIGHT_MAP, NODE_WIDTH_MAP } from './constants'
import { GraphVisualizerExtendedNode, GraphVisualizerNode, GraphVisualizerProps } from './types'

/**
 * Processes edges by assigning a default type and customizing the marker (arrow style).
 *
 * @param edges - List of all edges representing connections between nodes.
 * @returns A new array of edges with updated properties.
 */
export const processEdges = (edges: GraphVisualizerProps['edges']): Edge[] =>
    edges.map((edge) => ({
        ...edge,
        type: 'step',
        markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 30,
            height: 30,
            color: 'var(--N600)',
        },
    }))

/**
 * Finds the root node in a directed graph.
 * The root node is a node that is never a target (i.e., it has no parent).
 *
 * @param nodes - List of all nodes in the graph.
 * @param edges - List of all edges representing parent-child relationships.
 * @returns The root node's ID, or `null` if no root is found.
 */
const findRootNodes = (nodes: GraphVisualizerProps['nodes'], edges: GraphVisualizerProps['edges']) => {
    // Create a set of all node IDs
    const nodeIds = new Set(nodes.map((node) => node.id))

    // Create a set of all child node IDs (targets in edges)
    const childIds = new Set(edges.map((edge) => edge.target))

    // Find all nodes that are NOT a child of any other node (i.e., root nodes)
    return Array.from(nodeIds).filter((nodeId) => !childIds.has(nodeId))
}

/**
 * Recursively positions nodes in a tree structure.
 * @param nodeId - The ID of the current node being placed.
 * @param x - The x-coordinate of the node.
 * @param y - The y-coordinate of the node.
 * @param positions - Object to store computed positions.
 * @param childrenMap - Map of node ID → child nodes.
 * @param nodeMap - Map of node ID → node data.
 */
const placeNode = (
    nodeId: string,
    x: number,
    y: number,
    positions: Record<string, Pick<Viewport, 'x' | 'y'>>,
    childrenMap: Map<string, string[]>,
    nodeMap: Map<string, GraphVisualizerNode>,
) => {
    const updatedPositions = positions

    // Prevent duplicate processing (avoid cycles)
    if (updatedPositions[nodeId]) {
        return
    }

    const node = nodeMap.get(nodeId)
    // Get the node width
    const nodeWidth = NODE_WIDTH_MAP[node.type]

    // Store computed position
    updatedPositions[nodeId] = { x, y }

    // Retrieve children of the current node
    const children = childrenMap.get(nodeId) || []
    // No children, no further positioning needed
    if (children.length === 0) {
        return
    }

    // Determine x-position for child nodes
    const childX = x + nodeWidth + NODE_GAP_X

    // Start placing children **below** the parent
    let startY = y
    children.forEach((child) => {
        const childHeight = NODE_HEIGHT_MAP[nodeMap.get(child).type]
        // Position each child at the calculated coordinates
        placeNode(child, childX, startY, updatedPositions, childrenMap, nodeMap)
        startY += childHeight + NODE_GAP_Y // Move the next sibling below
    })
}

const calculateNodePositions = (nodes: GraphVisualizerProps['nodes'], edges: GraphVisualizerProps['edges']) => {
    // Store calculated positions for each node
    const positions: Record<string, Pick<Viewport, 'x' | 'y'>> = {}

    // Map to store parent-child relationships
    const childrenMap = new Map<string, string[]>()
    const nodeMap = new Map(nodes.map((node) => [node.id, node]))

    // Initialize adjacency list (each node starts with an empty children array)
    nodes.forEach((node) => childrenMap.set(node.id, []))
    edges.forEach((edge) => (childrenMap.get(edge.source) ?? []).push(edge.target))

    // Identify all the root nodes (the nodes that are never a target in edges)
    const rootNodes = findRootNodes(nodes, edges)
    if (!rootNodes.length) {
        return {}
    }

    // Place multiple root nodes vertically spaced at x = 0
    let startY = 0
    rootNodes.forEach((rootId) => {
        const nodeHeight = NODE_HEIGHT_MAP[nodeMap.get(rootId).type]
        placeNode(rootId, 0, startY, positions, childrenMap, nodeMap)
        startY += nodeHeight + NODE_GAP_Y // Move next root node downward
    })

    return positions
}

/**
 * Processes nodes by calculating their positions based on parent-child relationships.
 *
 * @param nodes - List of all nodes in the graph.
 * @param edges - List of all edges representing parent-child relationships.
 * @returns A new array of nodes with computed positions.
 */
export const processNodes = (
    nodes: GraphVisualizerProps['nodes'],
    edges: GraphVisualizerProps['edges'],
): GraphVisualizerExtendedNode[] => {
    // Compute node positions based on hierarchy
    const positions = calculateNodePositions(nodes, edges)

    return nodes.map(
        (node) =>
            ({
                ...node,
                selectable: node.type === 'dropdownNode',
                // Assign computed position; default to (0,0) if not found (shouldn't happen in a valid tree)
                position: positions[node.id] ?? { x: 0, y: 0 },
            }) as GraphVisualizerExtendedNode,
    )
}
