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

import { useEffect, useRef, useState } from 'react'
import { Prompt } from 'react-router-dom'
import { noop } from 'rxjs'

import { getIsRequestAborted } from '@Common/API'
import { showError } from '@Common/Helper'
import { ServerErrors } from '@Common/ServerError'
import { ApiQueuingWithBatch } from '@Shared/API'
import { usePrompt } from '@Shared/Hooks'
import { ToastManager, ToastVariantType } from '@Shared/Services'

import { ConfirmationModal } from '../ConfirmationModal'
import BulkOperationsResultModal from './BulkOperationsResultModal'
import { OperationResultStore } from './OperationResultStore'
import { BulkOperationModalProps, OperationResultStoreType } from './types'

import './styles.scss'

const BulkOperations = ({
    handleModalClose: handleModalCloseProp,
    operations: userOperations = [],
    getResultsChartSummaryText,
    handleReloadDataAfterBulkOperation = noop,
    hideResultsDrawer = false,
    textConfig,
    shouldSkipConfirmation,
    confirmationModalConfig,
    data,
    disableTransition,
}: BulkOperationModalProps) => {
    const [apiCallInProgress, setApiCallInProgress] = useState(!!shouldSkipConfirmation)
    const [, setLastUpdateTimeStamp] = useState(new Date().toISOString())
    const operationsRef = useRef<BulkOperationModalProps['operations']>(userOperations)
    const resultsStoreRef = useRef<OperationResultStoreType>(new OperationResultStore(operationsRef.current.length))
    const abortControllerRef = useRef<AbortController>(new AbortController())

    const showResultsDrawer = !hideResultsDrawer && !!resultsStoreRef.current.getSize()

    usePrompt({
        shouldPrompt: apiCallInProgress,
    })

    const handleModalClose = () => {
        const hasAnyOperationSucceeded = resultsStoreRef.current.getHasAnyOperationSucceeded()

        if (hasAnyOperationSucceeded || hideResultsDrawer) {
            handleReloadDataAfterBulkOperation()
        }

        handleModalCloseProp()
    }

    const handleBulkOperations = async () => {
        try {
            setApiCallInProgress(true)

            let timeout = -1

            const triggerUpdate = () => {
                if (timeout >= 0) {
                    return
                }

                timeout = setTimeout(() => {
                    setLastUpdateTimeStamp(new Date().toISOString())

                    timeout = -1
                }, 10)
            }

            const calls = operationsRef.current.map((op) => async () => {
                const { operation, name, additionalKeys, renderContentAtResultRowEnd = null } = op

                if (abortControllerRef.current.signal.aborted) {
                    throw new Error('bulk operations aborted')
                }

                let id = -1

                try {
                    id = resultsStoreRef.current.addResult({
                        name,
                        additionalKeys,
                        status: 'Progressing',
                        message: '-',
                    })

                    triggerUpdate()

                    const result = await operation(abortControllerRef, data)

                    resultsStoreRef.current.updateResultStatus(id, {
                        status: 'Completed',
                        ...(renderContentAtResultRowEnd
                            ? {
                                  renderContentAtResultRowEnd: () => renderContentAtResultRowEnd(result),
                              }
                            : {}),
                    })

                    triggerUpdate()
                } catch (err) {
                    if (getIsRequestAborted(err)) {
                        resultsStoreRef.current.updateResultStatus(id, {
                            status: 'Failed',
                            message: 'Aborted by you',
                            retryOperation: op,
                        })

                        triggerUpdate()

                        return
                    }

                    resultsStoreRef.current.updateResultStatus(id, {
                        status: 'Failed',
                        message:
                            (err &&
                                (err.message ||
                                    (err instanceof ServerErrors &&
                                        Array.isArray(err.errors) &&
                                        err.errors[0].userMessage))) ??
                            '',
                        retryOperation: op,
                    })

                    triggerUpdate()
                }
            })

            await ApiQueuingWithBatch(calls, true)

            ToastManager.showToast({
                variant: ToastVariantType.info,
                description: 'Action completed',
            })

            if (hideResultsDrawer) {
                handleModalClose()
            }
        } catch (err) {
            showError(err)
        } finally {
            setApiCallInProgress(false)
        }
    }

    // NOTE: this should really only be run at mount
    // therefore empty dependency array
    useEffect(() => {
        if (shouldSkipConfirmation) {
            handleBulkOperations().then(noop).catch(noop)
        }

        return () => {
            abortControllerRef.current?.abort()
        }
    }, [])

    const handleDrawerClose = apiCallInProgress ? noop : handleModalClose

    const handleRetryFailedOperations = async () => {
        operationsRef.current = resultsStoreRef.current.getRetryOperations()
        resultsStoreRef.current = new OperationResultStore(operationsRef.current.length)

        abortControllerRef.current = new AbortController()

        await handleBulkOperations()
    }

    const handleAbortBulkOperation = () => {
        abortControllerRef.current.abort()
    }

    const renderConfirmationDialog = () => (
        <ConfirmationModal
            {...confirmationModalConfig}
            handleClose={handleModalClose}
            buttonConfig={{
                primaryButtonConfig: {
                    ...confirmationModalConfig.buttonConfig.primaryButtonConfig,
                    onClick: handleBulkOperations,
                    disabled: apiCallInProgress || confirmationModalConfig.buttonConfig.primaryButtonConfig.disabled,
                    isLoading: apiCallInProgress,
                },
                secondaryButtonConfig: {
                    ...confirmationModalConfig.buttonConfig.secondaryButtonConfig,
                    onClick: handleModalClose,
                    disabled: apiCallInProgress || confirmationModalConfig.buttonConfig.secondaryButtonConfig.disabled,
                },
            }}
        />
    )

    const renderResultsDrawer = () => (
        <BulkOperationsResultModal
            apiCallInProgress={apiCallInProgress}
            handleAbortBulkOperation={handleAbortBulkOperation}
            handleModalClose={handleDrawerClose}
            isOperationAborted={abortControllerRef.current?.signal.aborted ?? false}
            resultsStore={resultsStoreRef.current}
            handleRetryFailedOperations={handleRetryFailedOperations}
            getResultsChartSummaryText={getResultsChartSummaryText}
            resultsHeader={textConfig.resultsHeader}
            disableTransition={disableTransition}
        />
    )

    return (
        <div className="bulk-operations">
            <Prompt when={apiCallInProgress} message={textConfig.prompt} />
            {!shouldSkipConfirmation && !showResultsDrawer ? renderConfirmationDialog() : renderResultsDrawer()}
        </div>
    )
}

export default BulkOperations
