import { NodeTypes, Viewport } from '@xyflow/react'

import { DropdownNode, IconNode, TextNode } from './components'

const nodeTypes = {
    iconNode: IconNode,
    textNode: TextNode,
    dropdownNode: DropdownNode,
}

export const NODE_TYPES = nodeTypes as NodeTypes

export const NODE_WIDTH_MAP: Record<keyof typeof nodeTypes, number> = {
    iconNode: 36,
    textNode: 180,
    dropdownNode: 180,
}

export const NODE_HEIGHT_MAP: Record<keyof typeof nodeTypes, number> = {
    iconNode: 36,
    textNode: 36,
    dropdownNode: 36,
}

export const PADDING_X = 16
export const PADDING_Y = 20

export const NODE_GAP_X = 50
export const NODE_GAP_Y = 12

export const DEFAULT_VIEWPORT: Viewport = { x: 16, y: 20, zoom: 1 }
