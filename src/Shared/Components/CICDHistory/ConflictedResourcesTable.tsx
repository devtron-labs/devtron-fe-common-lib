import { useMemo } from 'react'

import { FiltersTypeEnum, PaginationEnum, Table, TableViewWrapperProps } from '../Table'
import { RowsType } from '../Table/types'
import { CONFLICTED_RESOURCES_COLUMNS } from './constants'
import { ConflictedResourcesTableProps, ResourceConflictItemType } from './types'

import './ConflictedResourcesTable.scss'

const Wrapper = ({ children }: TableViewWrapperProps<unknown, FiltersTypeEnum.STATE>) => (
    <div className="dc__overflow-hidden flexbox-col flex-grow-1">{children}</div>
)
const filter = () => true

const ConflictedResourcesTable = ({ resourceConflictDetails }: ConflictedResourcesTableProps) => {
    const rows: RowsType<ResourceConflictItemType> = useMemo(
        () =>
            (resourceConflictDetails || []).map<RowsType<ResourceConflictItemType>[number]>((resource) => ({
                data: resource,
                id: resource.id,
            })),
        [resourceConflictDetails],
    )

    return (
        <Table<ResourceConflictItemType, FiltersTypeEnum.STATE>
            id="table__resource-conflict-details"
            columns={CONFLICTED_RESOURCES_COLUMNS}
            rows={rows}
            emptyStateConfig={{
                noRowsConfig: {
                    title: 'No resource found',
                },
                noRowsForFilterConfig: {
                    title: 'No results',
                    subTitle: "We couldn't find any matching results",
                },
            }}
            paginationVariant={PaginationEnum.NOT_PAGINATED}
            additionalFilterProps={{
                initialSortKey: 'name' satisfies keyof ResourceConflictItemType,
            }}
            filtersVariant={FiltersTypeEnum.STATE}
            ViewWrapper={Wrapper}
            filter={filter}
        />
    )
}

export default ConflictedResourcesTable
