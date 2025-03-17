import { ReactElement } from 'react'
import { SortableTableHeaderCellProps } from '@Common/SortableTableHeaderCell'
import { BulkOperation, BulkOperationModalProps } from '../BulkOperations'
import { ConfirmationModalProps } from '../ConfirmationModal'

type SizeType =
    | {
          range: [number, number]
          fixed?: never
      }
    | {
          range?: never
          fixed: number | 'auto'
      }

export interface Column
    extends Pick<SortableTableHeaderCellProps, 'isSortable' | 'isResizable' | 'showTippyOnTruncate'> {
    label: string
    size?: SizeType
}

export interface Cell {
    label: string
    data?: unknown
    render?: (data?: Cell['data']) => JSX.Element
}

export type BulkActionConfigType = (
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

// TODO: handle onRowClick in View
