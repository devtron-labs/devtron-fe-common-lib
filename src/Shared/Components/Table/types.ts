import { Dispatch, FunctionComponent, MouseEvent, ReactElement, SetStateAction } from 'react'
import { SortableTableHeaderCellProps, useResizableTableConfig } from '@Common/SortableTableHeaderCell'
import { UseStateFiltersProps, UseStateFiltersReturnType, UseUrlFiltersProps } from '@Common/Hooks'
import { GenericEmptyStateType } from '@Common/index'
import { GenericFilterEmptyStateProps } from '@Common/EmptyState/types'
import { BulkOperation, BulkOperationModalProps } from '../BulkOperations'
import { ConfirmationModalProps } from '../ConfirmationModal'

type SizeType =
    | {
          /** This signifies this column is resizable */
          range: {
              startWidth: number
              minWidth: number
              maxWidth: number | 'infinite'
          }
          fixed?: never
      }
    | {
          range?: never
          fixed: number | 'auto'
      }

export interface UseFiltersReturnType extends UseStateFiltersReturnType<string> {}

export interface Cell {
    label: string
    data?: unknown
    render?: (data?: Cell['data'], filterData?: UseFiltersReturnType) => JSX.Element
    horizontallySticky?: boolean
    filter?: (
        label: Cell['label'],
        filterData?: UseFiltersReturnType & Record<string, any>,
        data?: Cell['data'],
    ) => boolean
}

export type Column = Pick<SortableTableHeaderCellProps, 'showTippyOnTruncate'> & {
    label: string
    size: SizeType
} & (
        | {
              isSortable: true
              /**
               * Function to compare two rows if sorting is triggered on this column
               * @returns -1 if a < b, 0 if a === b, 1 if a > b
               */
              comparator?: (a: Cell['data'], b: Cell['data']) => number
          }
        | {
              isSortable?: false
              comparator?: never
          }
    )

type BulkActionConfigType = (
    | {
          applyActionOnEachSelection: true
          action: BulkOperation['operation']
          Icon: ReactElement
          confirmationConfig?: ConfirmationModalProps<true>
      }
    | {
          applyActionOnEachSelection: false
          action: (
              abortControllerRef: Parameters<BulkOperation['operation']>[0],
              data: Array<Parameters<BulkOperation['operation']>[1]>,
          ) => ReturnType<BulkOperation['operation']>
      }
) &
    Pick<BulkOperationModalProps, 'hideResultsDrawer'>

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

interface AdditionalProps {
    [key: string]: unknown
}

export type RowsType = Cell[][]

interface GetRowsProps
    extends Pick<UseFiltersReturnType, 'offset' | 'pageSize' | 'searchKey' | 'sortBy' | 'sortOrder'> {}

interface MetaRowType {
    rowData: RowsType[number]
    rowIndex: number
}

/** Will be wrapped with our own div to handle bulk selection using shift + click, keyboard navigation etc */
export interface RowComponentProps extends MetaRowType {}

type AdditionalFilterPropsType<T extends Exclude<FiltersTypeEnum, FiltersTypeEnum.NONE>> = T extends FiltersTypeEnum.URL
    ? Pick<
          UseUrlFiltersProps<string, unknown>,
          'parseSearchParams' | 'localStorageKey' | 'redirectionMethod' | 'initialSortKey'
      >
    : Pick<UseStateFiltersProps<string>, 'initialSortKey'>

export type InternalTableProps = Record<'filterData', UseFiltersReturnType> &
    Record<'resizableConfig', ReturnType<typeof useResizableTableConfig>> & {
        id: string

        paginationVariant: PaginationEnum
        /** Needs to be memoized */
        columns: Column[]
        bulkActionConfig?: BulkActionConfigType
        // TODO: need to handle isFilterApplied so that users can customize the empty state message in case filter is applied
        emptyStateConfig: {
            noRowsConfig: Omit<GenericEmptyStateType, 'children'>
            noRowsForFilterConfig?: Pick<GenericFilterEmptyStateProps, 'title' | 'subTitle'> & {
                clearFilters: () => void
            }
        }
        configurableColumns?: boolean

        additionalProps?: AdditionalProps

        // TODO: handle configuration of styles like borders and stuff
        styleConfig?: Partial<{
            separatorBetweenRows: {
                width: number
                colorToken?: string
            }
            headerBottomBorder: {
                width: number
                colorToken?: string
                showBorderOnlyWhenStuck?: boolean
            }
            /** NOTE: a tuple of color tokens, will start alternating from the first color (index 0 of tuple) */
            alternateColorsForRows: [string, string]
        }>

        onRowClick?: (data: MetaRowType, event: MouseEvent) => void
        onActiveChange?: (data: MetaRowType, event: MouseEvent | KeyboardEvent) => void
        onSelectionChange?: (newSelectedRows: MetaRowType[]) => void
    } & (
        | {
              rows: RowsType
              loading?: boolean
              getRows?: never
          }
        | {
              rows?: never
              loading?: never
              /** NOTE: Sorting on frontend is only handled if rows is provided instead of getRows */
              getRows: (props: GetRowsProps) => Promise<RowsType>
          }
    ) &
    (
        | {
              filtersVariant: FiltersTypeEnum.URL
              additionalFilterProps?: AdditionalFilterPropsType<FiltersTypeEnum.URL>
          }
        | {
              filtersVariant: FiltersTypeEnum.STATE
              additionalFilterProps?: AdditionalFilterPropsType<FiltersTypeEnum.STATE>
          }
        | {
              filtersVariant: FiltersTypeEnum.NONE
              additionalFilterProps?: never
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
    RowComponent?: FunctionComponent<RowComponentProps>
    HeaderComponent?: FunctionComponent
}

export type InternalTablePropsWithWrappers = InternalTableProps & WrappersType

export type TableProps = Omit<InternalTableProps, 'filterData' | 'resizableConfig'> & WrappersType

export interface FilterWrapperProps<T extends Exclude<FiltersTypeEnum, FiltersTypeEnum.NONE>> extends WrapperProps {
    additionalFilterProps?: AdditionalFilterPropsType<T>
}

export interface UseResizableTableConfigWrapperProps extends WrapperProps {
    columns: TableProps['columns']
}
