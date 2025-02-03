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

import { AutoSizedStickyTreeProps, StickyTreeRowRenderer } from 'react-virtualized-sticky-tree'

/**
 * Represents a virtualized list item.
 *
 * @template ListKeys - The type of the keys used to identify list items (e.g., `string` or `number`).
 * @template ExtendedType - An optional type to extend the base item structure with additional fields.
 */
export type VirtualizedListItem<ListKeys, ExtendedType = {}> = ExtendedType & {
    /** The unique identifier of the item. */
    id: string | number
    /** The height of the item. (in pixels) */
    height: number
    /** The depth level of the item in the hierarchical structure. */
    depth: number
    /** An optional array of child item keys. */
    children?: ListKeys[]
}

/**
 * Props for the VirtualizedList component, which supports a virtualized tree-like structure.
 *
 * @template ListKeys - The type of the keys used to identify list items (e.g., `string` or `number`).
 * @template ExtendedType - An optional type to extend the base item structure with additional fields.
 */
export interface VirtualizedListProps<ListKeys extends string | number, ExtendedType extends object = {}>
    extends Omit<
        AutoSizedStickyTreeProps<VirtualizedListItem<ListKeys, ExtendedType>>,
        'root' | 'renderRoot' | 'rowRenderer' | 'getChildren'
    > {
    /**
     * A dictionary of items keyed by their unique identifiers.
     */
    items: Record<ListKeys, VirtualizedListItem<ListKeys, ExtendedType>>
    /**
     * A function that renders an individual list item.
     *
     * @param params - An object containing the node and nodeInfo to render.
     * @returns A React node representing the rendered item.
     */
    renderItem: (
        params: Pick<
            Parameters<StickyTreeRowRenderer<VirtualizedListItem<ListKeys, ExtendedType>>>['0'],
            'node' | 'nodeInfo'
        >,
    ) => React.ReactNode
}
