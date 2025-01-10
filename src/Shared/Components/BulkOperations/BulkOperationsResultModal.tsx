import { useCallback, useEffect } from 'react'
import { SortingOrder } from '@Common/Constants'
import { stopPropagation } from '@Common/Helper'
import { useStateFilters } from '@Common/Hooks'
import { Drawer } from '@Common/index'
import { SegmentedBarChart } from '@Common/SegmentedBarChart'
import { SortableTableHeaderCell } from '@Common/SortableTableHeaderCell'
import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'
import { stringComparatorBySortOrder } from '@Shared/Helpers'
import { ReactComponent as ICInfo } from '@Icons/ic-info-outline.svg'
import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ReactComponent as ICAborted } from '@Icons/ic-aborted.svg'
import { ReactComponent as ICRestart } from '@Icons/ic-arrows-clockwise.svg'
import { RESULTS_MODAL_HEADERS, SORT_KEY_TO_NORMALIZER, SORT_ORDER_TO_KEY } from './constants'
import { BulkOperationResultType, BulkOperationsResultModalProps } from './types'
import { Button, ButtonComponentType, ButtonStyleType, ButtonVariantType } from '../Button'
import { getProgressingStateForStatus } from '../Security'

const BulkOperationsResultModal = ({
    apiCallInProgress,
    handleModalClose,
    isOperationAborted,
    resultsStore,
    handleAbortBulkOperation,
    handleRetryFailedOperations,
    resultsHeader: headerText,
    getResultsChartSummaryText,
    disableTransition,
}: BulkOperationsResultModalProps) => {
    const { handleSorting, sortBy, sortOrder, clearFilters } = useStateFilters<string>({
        initialSortKey: RESULTS_MODAL_HEADERS[1].label,
    })

    useEffect(
        () => () => {
            clearFilters()
        },
        [],
    )

    const getSortingHandler = (newSortBy: string) => () => {
        handleSorting(newSortBy)
    }

    const sortComparator = useCallback(
        (a: BulkOperationResultType, b: BulkOperationResultType) => {
            const isSortByKnown = RESULTS_MODAL_HEADERS.some((header) => header.label === sortBy)
            const normalizer = SORT_KEY_TO_NORMALIZER[sortBy] ?? ((value: unknown) => value)

            if (!isSortByKnown) {
                const firstAdditionalKeyValue = a.additionalKeys?.find((item) => item.label === sortBy)?.value || ''
                const secondAdditionalKeyValue = b.additionalKeys?.find((item) => item.label === sortBy)?.value || ''
                return stringComparatorBySortOrder(firstAdditionalKeyValue, secondAdditionalKeyValue, sortOrder)
            }

            return (
                (sortOrder === SortingOrder.ASC ? 1 : -1) *
                (normalizer(a[SORT_ORDER_TO_KEY[sortBy]]) < normalizer(b[SORT_ORDER_TO_KEY[sortBy]]) ? -1 : 1)
            )
        },
        [sortOrder, sortBy],
    )

    const sortedList = resultsStore.getResults(!apiCallInProgress ? sortComparator : null)

    const modalHeaders: typeof RESULTS_MODAL_HEADERS = RESULTS_MODAL_HEADERS.reduce<typeof RESULTS_MODAL_HEADERS>(
        (acc, headerDetails, index) => {
            acc.push(headerDetails)

            if (index === 0) {
                const itemConfig = sortedList?.[0]?.additionalKeys
                if (itemConfig?.length) {
                    itemConfig.forEach((item) => {
                        acc.push({
                            label: item.label,
                            isSortable: item.isSortable,
                            width: item.width,
                        })
                    })
                }
            }

            return acc
        },
        [],
    )

    const gridTemplateColumns = modalHeaders.map((header) => header.width).join(' ')

    return (
        <Drawer
            onClose={handleModalClose}
            onEscape={handleModalClose}
            disableTransition={disableTransition}
            position="right"
            width="1024px"
            parentClassName="h-100"
        >
            <dialog
                className="bcn-0 h-100 cn-9 w-100 flexbox-col dc__overflow-hidden p-0 bulk-operation__results-modal"
                onClick={stopPropagation}
            >
                <header className="px-20 py-12 lh-24 flexbox dc__content-space dc__align-items-center dc__border-bottom">
                    <span className="fs-16 fw-6 dc__first-letter-capitalize">{headerText.toLowerCase()}</span>

                    <Button
                        icon={<ICClose />}
                        dataTestId="rb-bulk-action__cross"
                        component={ButtonComponentType.button}
                        style={ButtonStyleType.negativeGrey}
                        size={ComponentSizeType.xs}
                        variant={ButtonVariantType.borderLess}
                        ariaLabel={`Close ${headerText} drawer`}
                        showTooltip={apiCallInProgress}
                        tooltipProps={{
                            content:
                                'Bulk action in progress. Please wait for it to complete. Leaving will disrupt the ongoing process.',
                        }}
                        disabled={apiCallInProgress}
                        onClick={handleModalClose}
                        showAriaLabelInTippy={false}
                    />
                </header>
                <div className="flexbox-col dc__gap-16 dc__overflow-hidden pt-20 flex-grow-1 bulk-operations__results-modal__content">
                    <div className="bulk-operations__results-modal__bar-chart br-8 flexbox-col dc__align-start dc__align-self-stretch dc__border bcn-0 ml-20 mr-20">
                        <SegmentedBarChart
                            entities={resultsStore.getBarChartEntities()}
                            rootClassName="p-16 fs-13 dc__border-bottom-n1"
                            countClassName="fw-6"
                        />

                        <div className="flexbox dc__gap-8 py-8 px-16 dc__align-items-center">
                            {apiCallInProgress ? (
                                getProgressingStateForStatus('Progressing')
                            ) : (
                                <ICInfo className="dc__no-shrink icon-dim-16" />
                            )}

                            {getResultsChartSummaryText(resultsStore.getResultsStatusCount())}
                        </div>
                    </div>
                    <div className="flexbox-col lh-20 dc__overflow-hidden">
                        <div
                            className="dc__grid dc__border-bottom-n1 py-8 fs-12 fw-6 cn-7 ml-20 mr-20 dc__gap-16"
                            style={{ gridTemplateColumns }}
                        >
                            {modalHeaders.map((header) => (
                                <SortableTableHeaderCell
                                    key={header.label}
                                    title={header.label}
                                    disabled={apiCallInProgress}
                                    isSorted={sortBy === header.label}
                                    sortOrder={sortOrder}
                                    // NOTE: only show sort icon after api call finishes
                                    isSortable={!!header.isSortable && !apiCallInProgress}
                                    triggerSorting={getSortingHandler(header.label)}
                                    showTippyOnTruncate
                                />
                            ))}
                        </div>

                        <div className="dc__overflow-scroll px-20">
                            {sortedList.map((result, index, arr) => (
                                <div
                                    className={`dc__grid py-10 fs-13 dc__gap-16 dc__align-items-start ${index === arr.length - 1 ? 'mb-20' : ''}`}
                                    style={{
                                        gridTemplateColumns: result.renderContentAtResultRowEnd
                                            ? `${gridTemplateColumns} min-content`
                                            : gridTemplateColumns,
                                    }}
                                    key={result.id}
                                >
                                    <Tooltip content={result.name}>
                                        <span className="dc__word-break">{result.name}</span>
                                    </Tooltip>

                                    {result.additionalKeys?.map((item) => (
                                        <Tooltip content={item.value}>
                                            <span className="dc__word-break">{item.value || '-'}</span>
                                        </Tooltip>
                                    ))}

                                    <div className="flexbox dc__gap-6 dc__align-items-center dc__align-self-start">
                                        {/* NOTE: any element that is visible in the modal will not be in Pending state */}
                                        {result.status !== 'Pending' && getProgressingStateForStatus(result.status)}
                                        <span>{result.status}</span>
                                    </div>

                                    <span className="dc__word-break">{result.message}</span>

                                    {result.renderContentAtResultRowEnd?.()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <footer className="flexbox dc__content-space pt-15 pb-16 px-20 dc__border-top">
                    {apiCallInProgress ? (
                        <>
                            <div className="flex-grow-1" />
                            <Button
                                dataTestId="rb-bulk-action__abort"
                                size={ComponentSizeType.large}
                                variant={ButtonVariantType.secondary}
                                style={ButtonStyleType.negative}
                                onClick={handleAbortBulkOperation}
                                startIcon={<ICAborted />}
                                text="Abort"
                                disabled={isOperationAborted}
                            />
                        </>
                    ) : (
                        <>
                            <Button
                                dataTestId="rb-bulk-action__close"
                                size={ComponentSizeType.large}
                                variant={ButtonVariantType.secondary}
                                style={ButtonStyleType.neutral}
                                isLoading={apiCallInProgress}
                                onClick={handleModalClose}
                                text="Close"
                            />

                            {resultsStore.getRetryOperations().length > 0 && (
                                <Button
                                    dataTestId="rb-bulk-action__retry"
                                    size={ComponentSizeType.large}
                                    variant={ButtonVariantType.primary}
                                    style={ButtonStyleType.default}
                                    component={ButtonComponentType.button}
                                    isLoading={apiCallInProgress}
                                    onClick={handleRetryFailedOperations}
                                    startIcon={<ICRestart />}
                                    text="Retry failed"
                                />
                            )}
                        </>
                    )}
                </footer>
            </dialog>
        </Drawer>
    )
}

export default BulkOperationsResultModal
