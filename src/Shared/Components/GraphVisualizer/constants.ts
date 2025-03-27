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
