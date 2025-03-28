import { Dispatch, FunctionComponent, ReactElement, SetStateAction } from 'react'
import { SortableTableHeaderCellProps, useResizableTableConfig } from '@Common/SortableTableHeaderCell'
import { UseStateFiltersProps, UseStateFiltersReturnType, UseUrlFiltersProps } from '@Common/Hooks'
import { GenericEmptyStateType } from '@Common/index'
import { GenericFilterEmptyStateProps } from '@Common/EmptyState/types'
import { useBulkSelection, UseBulkSelectionProps } from '../BulkSelection'

export interface UseFiltersReturnType extends UseStateFiltersReturnType<string> {}

export enum SignalEnum {
    ENTER_PRESSED = 'enter-pressed',
    DELETE_PRESSED = 'delete-pressed',
    ESCAPE_PRESSED = 'escape-pressed',

    OPEN_CONTEXT_MENU = 'open-context-menu',

    /** TODO: Not yet implemented */
    BULK_SELECTION_CHANGED = 'bulk-selection-changed',

    ACTIVE_ROW_CHANGED = 'active-row-changed',

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

type RowType = {
    id: string
    data: Record<string, unknown>
}

export type RowsType = RowType[]

export interface CellComponentProps extends Pick<BaseColumnType, 'field'>, AdditionalProps {
    signals: SignalsType
    value: unknown
    row: RowType
    filterData: UseFiltersReturnType
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
    /** Make sure to wrap it in useCallback */
    onBulkSelectionChanged: (selectedRows: RowsType) => void
    BulkActionsComponent: FunctionComponent<{}>
}

export enum PaginationEnum {
    PAGINATED = 'paginated',
    INFINITE = 'infinite',
    NOT_PAGINATED = 'not-paginated',
}

export enum FiltersTypeEnum {
    STATE = 'state',
    URL = 'url',
    NONE = 'none',
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

export type InternalTableProps = Record<'filterData', UseFiltersReturnType> &
    Record<'resizableConfig', ReturnType<typeof useResizableTableConfig>> &
    Required<Pick<ConfigurableColumnsType, 'visibleColumns' | 'setVisibleColumns'>> & {
        id: string

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

        /**
         * Enable this to let users choose which columns to display.
         * Example: Resource Browser > Node Listing
         *
         * Using the provided id for this table, we will store the user's preference in localStorage
         */
        configurableColumns?: boolean

        visibleRowsNumberRef: React.MutableRefObject<number>

        activeRowIndex: number

        additionalProps?: AdditionalProps

        /** Control the look of the table using this prop */
        stylesConfig?: {
            showSeparatorBetweenRows: boolean
        }

        /**
         * Use this component to display additional content at the end of a row when it is hovered over.
         */
        RowActionsOnHoverComponent?: FunctionComponent<{ row: RowsType[number] }>

        bulkSelectionReturnValue: ReturnType<typeof useBulkSelection> | null

        handleClearBulkSelection: () => void

        handleToggleBulkSelectionOnRow: (row: RowsType[number]) => void

        bulkSelectedRowIdsRef: React.MutableRefObject<string[]>

        activeRowRef: React.MutableRefObject<RowsType[number] | null>
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
              filter: (row: RowsType[number], filterData: UseFiltersReturnType) => boolean
          }
        | {
              filtersVariant: FiltersTypeEnum.STATE
              additionalFilterProps?: AdditionalFilterPropsType<FiltersTypeEnum.STATE>
              filter: (row: RowsType[number], filterData: UseFiltersReturnType) => boolean
          }
        | {
              filtersVariant: FiltersTypeEnum.NONE
              additionalFilterProps?: never
              filter?: never
          }
    )

export interface WrapperProps {
    children: ReactElement<InternalTableProps>
}

export interface ViewWrapperProps
    extends Pick<
            UseFiltersReturnType,
            'offset' | 'handleSearch' | 'searchKey' | 'sortBy' | 'sortOrder' | 'clearFilters'
        >,
        AdditionalProps,
        Partial<ConfigurableColumnsType>,
        WrapperProps {
    areRowsLoading: boolean
}

interface WrappersType {
    ViewWrapper?: FunctionComponent<ViewWrapperProps>
}

export type InternalTablePropsWithWrappers = InternalTableProps & WrappersType

export type TableProps = Pick<
    InternalTableProps,
    | 'additionalFilterProps'
    | 'bulkSelectionConfig'
    | 'configurableColumns'
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
> &
    WrappersType

export interface FilterWrapperProps<T extends Exclude<FiltersTypeEnum, FiltersTypeEnum.NONE>> extends WrapperProps {
    additionalFilterProps?: AdditionalFilterPropsType<T>
}

export interface UseResizableTableConfigWrapperProps extends WrapperProps {
    columns: TableProps['columns']
}

export interface BulkSelectionActionWidgetProps extends Pick<BulkSelectionConfigType, 'BulkActionsComponent'> {
    count: number
    handleClearBulkSelection: () => void
    parentRef: React.RefObject<HTMLDivElement>
}

export type ConfigurableColumnsConfigType = Record<string, ConfigurableColumnsType['visibleColumns']>
