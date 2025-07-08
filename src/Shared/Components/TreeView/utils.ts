import { FindSelectedIdParentNodesProps, GetSelectedIdParentNodesProps, GetVisibleNodesProps } from './types'

/**
 * Recursively traverses a tree structure to find the parent nodes of the node with the specified `selectedId`.
 *
 * @param node - The current tree node to search within.
 * @param onFindParentNode - Callback invoked with the ID of each parent node found on the path to the selected node.
 * @returns `true` if the node with `selectedId` is found in the subtree rooted at `node`, otherwise `false`.
 *
 * @remarks
 * - This function is used to collect all parent node IDs leading to a specific node in a tree.
 * - The callback `onFindParentNode` is called for each parent node in the path from the root to the selected node.
 * - Only nodes of type `'heading'` are considered to have children.
 */
const findSelectedIdParentNodes = <DataAttributeType = null>({
    node,
    selectedId,
    onFindParentNode,
}: FindSelectedIdParentNodesProps<DataAttributeType>): boolean => {
    if (node.id === selectedId) {
        return true
    }

    if (node.type === 'heading' && node.items?.length) {
        let found = false
        node.items.forEach((childNode) => {
            if (
                findSelectedIdParentNodes({
                    node: childNode,
                    onFindParentNode,
                    selectedId,
                })
            ) {
                found = true
                onFindParentNode(node.id)
            }
        })
        return found
    }

    return false
}

/**
 * Retrieves an array of parent node IDs for the currently selected node.
 *
 * Iterates through the provided tree nodes and collects the IDs of all parent nodes
 * leading to the node identified by `selectedId`. If no node is selected, returns an empty array.
 *
 * @returns {string[]} An array of parent node IDs for the selected node, or an empty array if no node is selected.
 */
export const getSelectedIdParentNodes = <DataAttributeType = null>({
    nodes,
    selectedId,
}: GetSelectedIdParentNodesProps<DataAttributeType>): string[] => {
    const selectedIdParentNodes: string[] = []

    if (!selectedId) {
        return selectedIdParentNodes
    }

    nodes.forEach((node) => {
        findSelectedIdParentNodes<DataAttributeType>({
            node,
            selectedId,
            onFindParentNode: (id: string) => {
                selectedIdParentNodes.push(id)
            },
        })
    })
    return selectedIdParentNodes
}

/**
 * Recursively traverses a list of tree nodes and returns an array of all node IDs that are present in DOM.
 *
 * For each node in the provided list:
 * - Adds the node's `id` to the result array.
 * - If the node is of type `'heading'`, is expanded (as per `expandedMap`), and has child items,
 *   recursively traverses its child items and includes their IDs as well.
 *
 * @param nodeList - The list of nodes to traverse.
 * @returns An array of strings representing the IDs of all traversed nodes.
 */
export const getVisibleNodes = <DataAttributeType = null>({
    nodeList,
    expandedMap,
}: GetVisibleNodesProps<DataAttributeType>): string[] =>
    nodeList.reduce((acc: string[], node) => {
        acc.push(node.id)
        if (node.type === 'heading' && expandedMap[node.id] && node.items?.length) {
            // If the node is a heading and expanded, traverse its items
            acc.push(
                ...getVisibleNodes({
                    nodeList: node.items,
                    expandedMap,
                }),
            )
        }
        return acc
    }, [])
