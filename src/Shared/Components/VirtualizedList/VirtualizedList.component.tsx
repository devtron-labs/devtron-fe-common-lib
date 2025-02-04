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

import { useMemo } from 'react'
import { AutoSizedStickyTree, StickyTreeGetChildren, StickyTreeRowRenderer } from 'react-virtualized-sticky-tree'

import { VIRTUALIZED_LIST_ROOT_ID, VIRTUALIZED_LIST_ROOT_Z_INDEX } from './VirtualizedList.constants'
import { VirtualizedListItem, VirtualizedListProps } from './VirtualizedList.types'

export const VirtualizedList = <ListKeys extends string | number, ExtendedType extends object>({
    className,
    items,
    renderItem,
    ...restProps
}: VirtualizedListProps<ListKeys, ExtendedType>) => {
    // CONSTANTS
    const root = useMemo(
        () => ({
            node: {
                id: VIRTUALIZED_LIST_ROOT_ID,
                children: Object.keys(items).filter((item) => items[item].depth === 0),
            } as VirtualizedListItem<ListKeys, ExtendedType>,
            isSticky: true,
            stickyTop: 0,
            height: 10,
            zIndex: VIRTUALIZED_LIST_ROOT_Z_INDEX,
        }),
        [items],
    )

    // METHODS
    const getChildren: StickyTreeGetChildren<VirtualizedListItem<ListKeys, ExtendedType>> = ({ children, id }) => {
        if (Array.isArray(children)) {
            return children.map((childrenId) => ({
                node: items[childrenId],
                height: items[childrenId].height,
                ...(id === VIRTUALIZED_LIST_ROOT_ID
                    ? {
                          isSticky: true,
                          stickyTop: 0,
                          zIndex: VIRTUALIZED_LIST_ROOT_Z_INDEX - items[childrenId].depth,
                      }
                    : {}),
            }))
        }

        return null
    }

    const rowRenderer: StickyTreeRowRenderer<VirtualizedListItem<ListKeys, ExtendedType>> = ({
        node,
        nodeInfo,
        style,
    }) => (
        <div key={node.id} className="bg__primary" style={style}>
            {renderItem({ node, nodeInfo })}
        </div>
    )

    return (
        <AutoSizedStickyTree
            {...restProps}
            className={`mh-0 ${className || ''}`}
            renderRoot={false}
            root={root}
            getChildren={getChildren}
            rowRenderer={rowRenderer}
        />
    )
}
