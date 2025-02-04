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

import { SegmentedBarChartProps } from '@Common/SegmentedBarChart'
import { ReactNode } from 'react'
import { APIOptions, DrawerProps } from '@Common/index'
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
     * Would show these keys beside the name
     */
    additionalKeys?: BulkOperationAdditionalKeysType[]
    operation: (abortControllerRef: APIOptions['abortControllerRef'], data?: unknown) => Promise<unknown | void>
    renderContentAtResultRowEnd?: (data: Awaited<ReturnType<BulkOperation['operation']>>) => ReactNode
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
    renderContentAtResultRowEnd?: () => void
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
        result: Partial<Pick<BulkOperationResultType, 'message' | 'renderContentAtResultRowEnd'>> &
            (FailedOperationType | OtherStatusOperationType),
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
) &
    Pick<DrawerProps, 'disableTransition'>

export interface BulkOperationsResultModalProps
    extends Pick<BulkOperationModalProps, 'handleModalClose' | 'getResultsChartSummaryText' | 'disableTransition'>,
        Pick<BulkOperationModalProps['textConfig'], 'resultsHeader'> {
    resultsStore: OperationResultStoreType
    apiCallInProgress: boolean
    isOperationAborted: boolean
    handleAbortBulkOperation: () => void
    handleRetryFailedOperations: () => void
}
