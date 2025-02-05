import { Edge, MarkerType } from '@xyflow/react'

import { NODE_GAP_X, NODE_GAP_Y, NODE_HEIGHT_MAP, NODE_WIDTH_MAP } from './constants'
import { GraphVisualizerBaseNode, GraphVisualizerNode, GraphVisualizerProps } from './types'

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
const findRootNode = (nodes: GraphVisualizerProps['nodes'], edges: GraphVisualizerProps['edges']): string | null => {
    // Create a set of all node IDs
    const nodeIds = new Set(nodes.map((node) => node.id))

    // Create a set of all child node IDs (targets in edges)
    const childIds = new Set(edges.map((edge) => edge.target))

    // The root node is the one that is in nodeIds but not in childIds
    const rootNodeId = Array.from(nodeIds).find((nodeId) => !childIds.has(nodeId))

    if (rootNodeId) {
        return rootNodeId
    }

    // If no root node is found, return null (could indicate a cycle or disconnected nodes)
    return null
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
const placeNodes = (
    nodeId: string,
    x: number,
    y: number,
    positions: Record<string, { x: number; y: number }>,
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

    // Get height values for each child node
    const childHeights = children.map((id) => NODE_HEIGHT_MAP[nodeMap.get(id).type])

    // Calculate total height required for children (with spacing)
    const totalHeight = childHeights.reduce((sum, h) => sum + h + NODE_GAP_Y, -NODE_GAP_Y)

    // Start positioning children from the topmost position
    let startY = y - totalHeight / 2

    children.forEach((child, index) => {
        // Position each child at the calculated coordinates
        placeNodes(child, childX, startY + childHeights[index] / 2, updatedPositions, childrenMap, nodeMap)
        startY += childHeights[index] + NODE_GAP_Y // Move Y down for next sibling
    })
}

const calculateNodePositions = (nodes: GraphVisualizerProps['nodes'], edges: GraphVisualizerProps['edges']) => {
    // Store calculated positions for each node
    const positions: Record<string, { x: number; y: number }> = {}

    // Map to store parent-child relationships
    const childrenMap = new Map<string, string[]>()
    const nodeMap = new Map(nodes.map((node) => [node.id, node]))

    // Initialize adjacency list (each node starts with an empty children array)
    nodes.forEach((node) => childrenMap.set(node.id, []))
    edges.forEach((edge) => childrenMap.get(edge.source).push(edge.target))

    // Identify the root node (the node that is never a target in edges)
    const rootNode = findRootNode(nodes, edges)
    if (!rootNode) {
        throw new Error('Either cyclic or disconnected nodes are present!')
    }

    // Start recursive positioning from the root node
    placeNodes(rootNode, 0, 0, positions, childrenMap, nodeMap)

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
): GraphVisualizerBaseNode[] => {
    // Compute node positions based on hierarchy
    const positions = calculateNodePositions(nodes, edges)

    return nodes.map(
        (node) =>
            ({
                ...node,
                selectable: node.type === 'dropdownNode',
                // Assign computed position; default to (0,0) if not found (shouldn't happen in a valid tree)
                position: positions[node.id] ?? { x: 0, y: 0 },
            }) as GraphVisualizerBaseNode,
    )
}
