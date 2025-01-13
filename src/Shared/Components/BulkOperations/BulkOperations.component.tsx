import { Prompt } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getIsRequestAborted } from '@Common/Api'
import { showError } from '@Common/Helper'
import { ServerErrors } from '@Common/ServerError'
import { ApiQueuingWithBatch } from '@Shared/API'
import { usePrompt } from '@Shared/Hooks'
import { ConfirmationModal, ToastManager, ToastVariantType } from '@Shared/index'
import { noop } from 'rxjs'
import { OperationResultStore } from './OperationResultStore'
import BulkOperationsResultModal from './BulkOperationsResultModal'
import { OperationResultStoreType, BulkOperationModalProps } from './types'
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
                description: 'Bulk action completed',
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
            showConfirmationModal
            buttonConfig={{
                primaryButtonConfig: {
                    ...confirmationModalConfig.buttonConfig.primaryButtonConfig,
                    onClick: handleBulkOperations,
                    disabled: apiCallInProgress,
                    isLoading: apiCallInProgress,
                },
                secondaryButtonConfig: {
                    ...confirmationModalConfig.buttonConfig.secondaryButtonConfig,
                    onClick: handleModalClose,
                    disabled: apiCallInProgress,
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
