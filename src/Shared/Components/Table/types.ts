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

import { Dispatch, FunctionComponent, MouseEvent, PropsWithChildren, SetStateAction } from 'react'

import { GenericFilterEmptyStateProps } from '@Common/EmptyState/types'
import {
    UseStateFiltersProps,
    UseStateFiltersReturnType,
    UseUrlFiltersProps,
    UseUrlFiltersReturnType,
} from '@Common/Hooks'
import { APIOptions, GenericEmptyStateType } from '@Common/index'
import { PageSizeOption } from '@Common/Pagination/types'
import { SortableTableHeaderCellProps, useResizableTableConfig } from '@Common/SortableTableHeaderCell'

import { useBulkSelection, UseBulkSelectionProps } from '../BulkSelection'

export interface UseFiltersReturnType extends UseStateFiltersReturnType<string> {}

export enum SignalEnum {
    ENTER_PRESSED = 'enter-pressed',
    DELETE_PRESSED = 'delete-pressed',
    ESCAPE_PRESSED = 'escape-pressed',

    OPEN_CONTEXT_MENU = 'open-context-menu',

    ROW_CLICKED = 'row-clicked',
}

export interface SignalsType<T extends string = SignalEnum>
    extends Pick<EventTarget, 'addEventListener' | 'removeEventListener'> {
    addEventListener: (
        type: T,
        callback: (event: CustomEvent) => void,
        options?: Parameters<EventTarget['addEventListener']>[2],
    ) => ReturnType<EventTarget['addEventListener']>

    removeEventListener: (
        type: T,
        callback: (event: CustomEvent) => void,
        options?: Parameters<EventTarget['removeEventListener']>[2],
    ) => ReturnType<EventTarget['removeEventListener']>
}

type SizeType =
    | {
          /** This signifies this column is resizable */
          range: {
              startWidth: number
              minWidth: number
              maxWidth: number | 'infinite'
          }
          /** If we want a fixed width */
          fixed?: never
      }
    | {
          range?: never
          fixed: number
      }
    | null

type BaseColumnType = {
    /** This is the key using which we will fetch the data of  */
    field: string

    /** This is the string that will be displayed to the user as header text */
    label?: string

    /**
     * If we want resizable columns, then every column has to have a fixed height
     * If we specify size to be null then the size be will set to 1fr
     */
    size: SizeType

    horizontallySticky?: boolean
}

export type RowType<Data extends unknown> = {
    id: string
    data: Data
}

export type RowsType<Data extends unknown> = RowType<Data>[]

export enum FiltersTypeEnum {
    STATE = 'state',
    URL = 'url',
    NONE = 'none',
}

export type CellComponentProps<
    RowData extends unknown = unknown,
    FilterVariant extends FiltersTypeEnum = FiltersTypeEnum.NONE,
    AdditionalProps extends Record<string, any> = {},
> = Pick<BaseColumnType, 'field'> &
    AdditionalProps & {
        signals: SignalsType
        value: unknown
        row: RowType<RowData>
        filterData: FilterVariant extends FiltersTypeEnum.NONE
            ? null
            : FilterVariant extends FiltersTypeEnum.STATE
              ? UseFiltersReturnType
              : UseUrlFiltersReturnType<string>
        isRowActive: boolean
    }

export type RowActionsOnHoverComponentProps<
    RowData extends unknown = unknown,
    AdditionalProps extends Record<string, any> = {},
> = {
    row: RowType<RowData>
} & AdditionalProps

export type Column<
    RowData extends unknown = unknown,
    FilterVariant extends FiltersTypeEnum = FiltersTypeEnum.NONE,
    AdditionalProps extends Record<string, any> = {},
> = Pick<SortableTableHeaderCellProps, 'showTippyOnTruncate'> &
    BaseColumnType & {
        CellComponent?: FunctionComponent<CellComponentProps<RowData, FilterVariant, AdditionalProps>>
    } & (
        | {
              isSortable: true
              /**
               * Compare two rows when sorting is triggered on this column
               * Values fed are from the field key in the row's data object
               * @returns -1 if a < b, 0 if a === b, 1 if a > b
               */
              comparator?: (a: unknown, b: unknown) => number
          }
        | {
              isSortable?: false
              comparator?: never
          }
    )

export interface BulkActionsComponentProps {
    onActionClick: (event: MouseEvent<HTMLButtonElement>) => void
    bulkActionsData: unknown
}

type BulkSelectionReturnValueType = ReturnType<typeof useBulkSelection>

export interface BulkOperationModalProps<
    T extends string = string,
    RowData extends Record<string, any> = Record<string, any>,
> extends Pick<BulkSelectionReturnValueType, 'isBulkSelectionApplied'> {
    action: T
    onClose: () => void
    selections: RowsType<RowData> | null
    bulkOperationModalData: unknown
}

type BulkSelectionConfigType = Pick<UseBulkSelectionProps<unknown>, 'getSelectAllDialogStatus'> & {
    BulkActionsComponent: FunctionComponent<BulkActionsComponentProps>
    BulkOperationModal: FunctionComponent<BulkOperationModalProps>
} & Pick<BulkActionsComponentProps, 'bulkActionsData'> &
    Pick<BulkOperationModalProps, 'bulkOperationModalData'>

export enum PaginationEnum {
    PAGINATED = 'paginated',
    INFINITE = 'infinite',
    NOT_PAGINATED = 'not-paginated',
}

export interface ConfigurableColumnsType<
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
> {
    allColumns: Column<RowData, FilterVariant, AdditionalProps>[]
    visibleColumns: Column<RowData, FilterVariant, AdditionalProps>[]
    setVisibleColumns: Dispatch<SetStateAction<Column<RowData, FilterVariant, AdditionalProps>[]>>
}

interface GetRowsProps
    extends Pick<UseFiltersReturnType, 'offset' | 'pageSize' | 'searchKey' | 'sortBy' | 'sortOrder'> {}

type AdditionalFilterPropsType<T extends FiltersTypeEnum> = T extends FiltersTypeEnum.URL
    ? Pick<
          UseUrlFiltersProps<string, unknown>,
          'parseSearchParams' | 'localStorageKey' | 'redirectionMethod' | 'initialSortKey' | 'defaultPageSize'
      >
    : T extends FiltersTypeEnum.STATE
      ? Pick<UseStateFiltersProps<string>, 'initialSortKey' | 'defaultPageSize'>
      : never

export type ViewWrapperProps<
    RowData extends unknown = unknown,
    FilterVariant extends FiltersTypeEnum = FiltersTypeEnum.NONE,
    AdditionalProps extends Record<string, any> = {},
> = PropsWithChildren<
    (FilterVariant extends FiltersTypeEnum.NONE
        ? {}
        : Pick<
              UseFiltersReturnType,
              'offset' | 'handleSearch' | 'searchKey' | 'sortBy' | 'sortOrder' | 'clearFilters' | 'areFiltersApplied'
          >) &
        AdditionalProps &
        Partial<ConfigurableColumnsType<RowData, FilterVariant, AdditionalProps>> & {
            areRowsLoading: boolean
            filteredRows: RowsType<RowData> | null
            rows: RowsType<RowData> | null
        } & (FilterVariant extends FiltersTypeEnum.URL
            ? Pick<UseUrlFiltersReturnType<string>, 'updateSearchParams'>
            : {})
>

type FilterConfig<FilterVariant extends FiltersTypeEnum, RowData extends unknown> = {
    filtersVariant: FilterVariant
    /**
     * Props for useUrlFilters/useStateFilters hooks
     */
    additionalFilterProps?: AdditionalFilterPropsType<FilterVariant>
    /**
     * This func is used to filter the rows based on filter data.
     * Only applicable if filtersVariant is NOT set to NONE
     *
     * If filter is only being used for sorting, then send `noop` in this prop
     */
    filter: FilterVariant extends FiltersTypeEnum.NONE
        ? null
        : (row: RowType<RowData>, filterData: UseFiltersReturnType) => boolean
    clearFilters?: FilterVariant extends FiltersTypeEnum.URL
        ? () => void
        : FilterVariant extends FiltersTypeEnum.STATE
          ? never
          : never
}

export type InternalTableProps<
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
> = Required<
    Pick<ConfigurableColumnsType<RowData, FilterVariant, AdditionalProps>, 'visibleColumns' | 'setVisibleColumns'>
> & {
    id: `table__${string}`

    loading?: boolean

    /**
     * Memoize columns before passing as props.
     *
     * For columns from backend: initialize as empty array and set loading
     * to true until API call completes.
     */
    columns: Column<RowData, FilterVariant, AdditionalProps>[]

    /** If bulk selections are not a concern omit this prop */
    bulkSelectionConfig?: BulkSelectionConfigType

    emptyStateConfig: {
        noRowsConfig: Omit<GenericEmptyStateType, 'children'>
        noRowsForFilterConfig?: Pick<GenericFilterEmptyStateProps, 'title' | 'subTitle'> & {
            clearFilters?: () => void
        }
    }

    filterData: UseFiltersReturnType | null

    resizableConfig: ReturnType<typeof useResizableTableConfig> | null

    /**
     * Enable this to let users choose which columns to display.
     * Example: Resource Browser > Node Listing
     *
     * Using the provided id for this table, we will store the user's preference in localStorage
     */
    areColumnsConfigurable?: boolean

    additionalProps?: AdditionalProps

    /** Control the look of the table using this prop */
    stylesConfig?: {
        showSeparatorBetweenRows: boolean
    }

    /**
     * Use this component to display additional content at the end of a row when it is hovered over.
     */
    RowActionsOnHoverComponent?: FunctionComponent<RowActionsOnHoverComponentProps<RowData, AdditionalProps>>

    bulkSelectionReturnValue: BulkSelectionReturnValueType | null

    handleClearBulkSelection: () => void

    handleToggleBulkSelectionOnRow: (row: RowType<RowData>) => void

    ViewWrapper?: FunctionComponent<ViewWrapperProps<RowData, FilterVariant, AdditionalProps>>
} & (
        | {
              /**
               * Direct rows data for frontend-only datasets like resource browser.
               */
              rows: RowsType<RowData>
              /**
               * Use `getRows` function instead for data that needs to be fetched from backend with pagination/sorting/filtering.
               */
              getRows?: never
          }
        | {
              rows?: never
              /** NOTE: Sorting on frontend is only handled if rows is provided instead of getRows */
              getRows: (
                  props: GetRowsProps,
                  abortControllerRef: APIOptions['abortControllerRef'],
              ) => Promise<{ rows: RowsType<RowData>; totalRows: number }>
          }
    ) &
    (
        | {
              paginationVariant: PaginationEnum.PAGINATED
              pageSizeOptions?: PageSizeOption[]
          }
        | {
              paginationVariant: Omit<PaginationEnum, 'PAGINATED'>
              pageSizeOptions?: never
          }
    ) &
    FilterConfig<FilterVariant, RowData>

export type UseResizableTableConfigWrapperProps<
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
> = Omit<InternalTableProps<RowData, FilterVariant, AdditionalProps>, 'resizableConfig'>

export type TableWithBulkSelectionProps<
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
> = Omit<
    UseResizableTableConfigWrapperProps<RowData, FilterVariant, AdditionalProps>,
    'bulkSelectionReturnValue' | 'handleClearBulkSelection' | 'handleToggleBulkSelectionOnRow'
>

export type VisibleColumnsWrapperProps<
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
> = Omit<TableWithBulkSelectionProps<RowData, FilterVariant, AdditionalProps>, 'visibleColumns' | 'setVisibleColumns'>

export type FilterWrapperProps<
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
> = Omit<VisibleColumnsWrapperProps<RowData, FilterVariant, AdditionalProps>, 'filterData'>

export type TableProps<
    RowData extends unknown = unknown,
    FilterVariant extends FiltersTypeEnum = FiltersTypeEnum.NONE,
    AdditionalProps extends Record<string, any> = {},
> = Pick<
    FilterWrapperProps<RowData, FilterVariant, AdditionalProps>,
    | 'additionalFilterProps'
    | 'bulkSelectionConfig'
    | 'areColumnsConfigurable'
    | 'emptyStateConfig'
    | 'filtersVariant'
    | 'filter'
    | 'additionalProps'
    | 'columns'
    | 'getRows'
    | 'rows'
    | 'paginationVariant'
    | 'stylesConfig'
    | 'id'
    | 'RowActionsOnHoverComponent'
    | 'loading'
    | 'ViewWrapper'
    | 'pageSizeOptions'
    | 'clearFilters'
>

export type BulkActionStateType = string | null

export interface BulkSelectionActionWidgetProps
    extends Pick<BulkSelectionConfigType, 'BulkActionsComponent' | 'bulkActionsData'> {
    count: number
    handleClearBulkSelection: () => void
    parentRef: React.RefObject<HTMLDivElement>
    /** If it is null, we can say no bulk action has been selected yet */
    setBulkActionState: Dispatch<SetStateAction<BulkActionStateType>>
}

export type ConfigurableColumnsConfigType<
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
> = Record<string, ConfigurableColumnsType<RowData, FilterVariant, AdditionalProps>['visibleColumns']>

export interface GetFilteringPromiseProps<RowData extends unknown> {
    searchSortTimeoutRef: React.MutableRefObject<number>
    callback: () => Promise<RowsType<RowData>> | RowsType<RowData>
}

export interface TableContentProps<
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
> extends Pick<
        InternalTableProps<RowData, FilterVariant, AdditionalProps>,
        | 'filterData'
        | 'rows'
        | 'resizableConfig'
        | 'additionalProps'
        | 'visibleColumns'
        | 'stylesConfig'
        | 'loading'
        | 'bulkSelectionConfig'
        | 'bulkSelectionReturnValue'
        | 'handleClearBulkSelection'
        | 'handleToggleBulkSelectionOnRow'
        | 'paginationVariant'
        | 'RowActionsOnHoverComponent'
        | 'pageSizeOptions'
        | 'getRows'
    > {
    filteredRows: RowsType<RowData>
    areFilteredRowsLoading: boolean
    totalRows: number
}
