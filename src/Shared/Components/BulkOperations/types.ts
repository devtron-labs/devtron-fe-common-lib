import { SegmentedBarChartProps } from '@Common/SegmentedBarChart'
import { MutableRefObject, ReactNode } from 'react'
import { getProgressingStateForStatus } from '../Security'
import { ConfirmationModalProps } from '../ConfirmationModal/types'

interface BulkOperationAdditionalKeysType {
    label: string
    value: string
    isSortable: boolean
    /**
     * width to be given in gridTemplateColumns
     */
    width: string
}

export interface BulkOperation {
    name: string
    /**
     * Would these keys beside the name
     */
    additionalKeys?: BulkOperationAdditionalKeysType[]
    operation: (abortControllerRef: MutableRefObject<AbortController>, data?: unknown) => Promise<void>
}

export type FailedOperationType = {
    status: 'Failed'
    retryOperation: BulkOperation
}

export type OtherStatusOperationType = {
    status: Exclude<Parameters<typeof getProgressingStateForStatus>[0], 'Failed' | 'Running'> | 'Pending'
}

export type BulkOperationResultType = {
    message?: string
} & (FailedOperationType | OtherStatusOperationType) &
    Pick<BulkOperation, 'name' | 'additionalKeys'>

export type BulkOperationResultWithIdType = BulkOperationResultType & Record<'id', number>

export interface OperationResultStoreType {
    addResult: (result: BulkOperationResultType) => number
    getResults: (
        sortComparator: (a: BulkOperationResultType, b: BulkOperationResultType) => number,
    ) => BulkOperationResultWithIdType[]
    getBarChartEntities: () => SegmentedBarChartProps['entities']
    getResultsStatusCount: () => Record<BulkOperationResultType['status'], number>
    getSize: () => number
    updateResultStatus: (
        id: number,
        result: Partial<Pick<BulkOperationResultType, 'message'>> & (FailedOperationType | OtherStatusOperationType),
    ) => void
    getRetryOperations: () => FailedOperationType['retryOperation'][]
    hasAnyOperationFailed: () => boolean
    getHasAnyOperationSucceeded: () => boolean
}

export type BulkOperationModalProps = {
    operations: NonNullable<BulkOperation[]>
    handleModalClose: () => void
    textConfig: Record<'prompt' | 'resultsHeader', string>
    getResultsChartSummaryText: (counts: Record<BulkOperationResultType['status'], number>) => ReactNode
    data?: unknown
    handleReloadDataAfterBulkOperation?: () => void
    hideResultsDrawer?: boolean
} & (
    | {
          shouldSkipConfirmation?: never
          confirmationModalConfig: ConfirmationModalProps<true>
      }
    | {
          shouldSkipConfirmation: true
          confirmationModalConfig?: never
      }
)

export interface BulkOperationsResultModalProps
    extends Pick<BulkOperationModalProps, 'handleModalClose' | 'getResultsChartSummaryText'>,
        Pick<BulkOperationModalProps['textConfig'], 'resultsHeader'> {
    resultsStore: OperationResultStoreType
    apiCallInProgress: boolean
    isOperationAborted: boolean
    handleAbortBulkOperation: () => void
    handleRetryFailedOperations: () => void
}
