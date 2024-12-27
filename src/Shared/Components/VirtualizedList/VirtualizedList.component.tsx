import { useMemo } from 'react'
import { AutoSizedStickyTree, StickyTreeGetChildren, StickyTreeRowRenderer } from 'react-virtualized-sticky-tree'

import { VIRTUALIZED_LIST_ROOT_Z_INDEX } from './VirtualizedList.constants'
import { VirtualizedListItem, VirtualizedListProps } from './VirtualizedList.types'

export const VirtualizedList = <ListKeys extends string | number, ExtendedType extends object>({
    items,
    renderItem,
    ...restProps
}: VirtualizedListProps<ListKeys, ExtendedType>) => {
    // CONSTANTS
    const root = useMemo(
        () => ({
            node: {
                id: 'root',
                children: Object.keys(items).filter((item) => !!items[item].children),
            } as VirtualizedListItem<ListKeys, ExtendedType>,
            isSticky: true,
            stickyTop: 0,
            height: 10,
            zIndex: VIRTUALIZED_LIST_ROOT_Z_INDEX,
        }),
        [items],
    )

    // METHODS
    const getChildren: StickyTreeGetChildren<VirtualizedListItem<ListKeys, ExtendedType>> = ({ children }) => {
        if (Array.isArray(children)) {
            return children.map((childrenId) => ({
                node: items[childrenId],
                isSticky: true,
                stickyTop: 0,
                height: items[childrenId].height,
                zIndex: VIRTUALIZED_LIST_ROOT_Z_INDEX - items[childrenId].depth,
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
            renderRoot={false}
            root={root}
            getChildren={getChildren}
            rowRenderer={rowRenderer}
        />
    )
}
