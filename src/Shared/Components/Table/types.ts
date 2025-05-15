import { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction } from 'react'

import { GenericFilterEmptyStateProps } from '@Common/EmptyState/types'
import {
    UseStateFiltersProps,
    UseStateFiltersReturnType,
    UseUrlFiltersProps,
    UseUrlFiltersReturnType,
} from '@Common/Hooks'
import { GenericEmptyStateType } from '@Common/index'
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

interface AdditionalProps {
    [key: string]: unknown
}

export type RowType = {
    id: string
    data: Record<string, unknown>
}

export type RowsType = RowType[]

export enum FiltersTypeEnum {
    STATE = 'state',
    URL = 'url',
    NONE = 'none',
}

export interface CellComponentProps<T = FiltersTypeEnum.NONE> extends Pick<BaseColumnType, 'field'>, AdditionalProps {
    signals: SignalsType
    value: unknown
    row: RowType
    filterData: T extends FiltersTypeEnum.NONE
        ? null
        : T extends FiltersTypeEnum.STATE
          ? UseFiltersReturnType
          : UseUrlFiltersReturnType<string>
    isRowActive: boolean
}

export type Column = Pick<SortableTableHeaderCellProps, 'showTippyOnTruncate'> &
    BaseColumnType & {
        CellComponent?: FunctionComponent<CellComponentProps>
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

type BulkSelectionConfigType = Pick<UseBulkSelectionProps<unknown>, 'getSelectAllDialogStatus'> & {
    BulkActionsComponent: FunctionComponent<{}>
}

export enum PaginationEnum {
    PAGINATED = 'paginated',
    INFINITE = 'infinite',
    NOT_PAGINATED = 'not-paginated',
}

export interface ConfigurableColumnsType {
    allColumns: Column[]
    visibleColumns: Column[]
    setVisibleColumns: Dispatch<SetStateAction<ConfigurableColumnsType['visibleColumns']>>
}

interface GetRowsProps
    extends Pick<UseFiltersReturnType, 'offset' | 'pageSize' | 'searchKey' | 'sortBy' | 'sortOrder'> {}

type AdditionalFilterPropsType<T extends Exclude<FiltersTypeEnum, FiltersTypeEnum.NONE>> = T extends FiltersTypeEnum.URL
    ? Pick<
          UseUrlFiltersProps<string, unknown>,
          'parseSearchParams' | 'localStorageKey' | 'redirectionMethod' | 'initialSortKey'
      >
    : Pick<UseStateFiltersProps<string>, 'initialSortKey'>

export type ViewWrapperProps<T = FiltersTypeEnum.STATE> = PropsWithChildren<
    (T extends FiltersTypeEnum.NONE
        ? {}
        : Pick<
              UseFiltersReturnType,
              'offset' | 'handleSearch' | 'searchKey' | 'sortBy' | 'sortOrder' | 'clearFilters'
          >) &
        AdditionalProps &
        Partial<ConfigurableColumnsType> & {
            areRowsLoading: boolean
        } & (T extends FiltersTypeEnum.URL ? Pick<UseUrlFiltersReturnType<string>, 'updateSearchParams'> : {})
>

export type InternalTableProps = PropsWithChildren<
    Required<Pick<ConfigurableColumnsType, 'visibleColumns' | 'setVisibleColumns'>> & {
        id: `table__${string}`

        loading?: boolean

        paginationVariant: PaginationEnum

        /**
         * Memoize columns before passing as props.
         *
         * For columns from backend: initialize as empty array and set loading
         * to true until API call completes.
         */
        columns: Column[]

        /** If bulk selections are not a concern omit this prop */
        bulkSelectionConfig?: BulkSelectionConfigType

        emptyStateConfig: {
            noRowsConfig: Omit<GenericEmptyStateType, 'children'>
            noRowsForFilterConfig?: Pick<GenericFilterEmptyStateProps, 'title' | 'subTitle'> & {
                clearFilters: () => void
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
        RowActionsOnHoverComponent?: FunctionComponent<{ row: RowType }>

        bulkSelectionReturnValue: ReturnType<typeof useBulkSelection> | null

        handleClearBulkSelection: () => void

        handleToggleBulkSelectionOnRow: (row: RowType) => void

        ViewWrapper?: FunctionComponent<ViewWrapperProps>
    } & (
            | {
                  /**
                   * Direct rows data for frontend-only datasets like resource browser.
                   */
                  rows: RowsType
                  /**
                   * Use `getRows` function instead for data that needs to be fetched from backend with pagination/sorting/filtering.
                   */
                  getRows?: never
              }
            | {
                  rows?: never
                  /** NOTE: Sorting on frontend is only handled if rows is provided instead of getRows */
                  getRows: (props: GetRowsProps) => Promise<RowsType>
              }
        ) &
        (
            | {
                  filtersVariant: FiltersTypeEnum.URL

                  /**
                   * props for useUrlFilters/useStateFilters hooks
                   */
                  additionalFilterProps?: AdditionalFilterPropsType<FiltersTypeEnum.URL>

                  /**
                   * This func is used to filter the rows based on filter data.
                   * Only applicable if filtersVariant is NOT set to NONE
                   *
                   * If filter is only being used for sorting, then send `noop` in this prop
                   */
                  filter: (row: RowType, filterData: UseFiltersReturnType) => boolean
              }
            | {
                  filtersVariant: FiltersTypeEnum.STATE
                  additionalFilterProps?: AdditionalFilterPropsType<FiltersTypeEnum.STATE>
                  filter: (row: RowType, filterData: UseFiltersReturnType) => boolean
              }
            | {
                  filtersVariant: FiltersTypeEnum.NONE
                  additionalFilterProps?: never
                  filter?: never
              }
        )
>

export type UseResizableTableConfigWrapperProps = Omit<InternalTableProps, 'resizableConfig'>

export type TableWithBulkSelectionProps = Omit<
    UseResizableTableConfigWrapperProps,
    'bulkSelectionReturnValue' | 'handleClearBulkSelection' | 'handleToggleBulkSelectionOnRow'
>

export type VisibleColumnsWrapperProps = Omit<TableWithBulkSelectionProps, 'visibleColumns' | 'setVisibleColumns'>

export type FilterWrapperProps = Omit<VisibleColumnsWrapperProps, 'filterData'>

export type TableProps = Pick<
    FilterWrapperProps,
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
    | 'children'
>

export interface BulkSelectionActionWidgetProps extends Pick<BulkSelectionConfigType, 'BulkActionsComponent'> {
    count: number
    handleClearBulkSelection: () => void
    parentRef: React.RefObject<HTMLDivElement>
}

export type ConfigurableColumnsConfigType = Record<string, ConfigurableColumnsType['visibleColumns']>

export interface GetFilteringPromiseProps {
    searchSortTimeoutRef: React.MutableRefObject<number>
    callback: () => Promise<RowsType> | RowsType
}
