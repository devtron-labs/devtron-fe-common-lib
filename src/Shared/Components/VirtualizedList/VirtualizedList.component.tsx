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
        <div key={node.id} className="bcn-0" style={style}>
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
