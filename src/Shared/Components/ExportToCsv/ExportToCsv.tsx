import { useEffect, useRef, useState } from 'react'
import { CSVLink } from 'react-csv'
import moment from 'moment'

import { getIsRequestAborted } from '@Common/API'
import { DATE_TIME_FORMATS } from '@Common/Constants'
import { showError } from '@Common/Helper'
import { ServerErrors } from '@Common/ServerError'
import { ALLOW_ACTION_OUTSIDE_FOCUS_TRAP, ComponentSizeType } from '@Shared/constants'
import { isNullOrUndefined } from '@Shared/Helpers'

import { Button, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import ExportToCsvDialog from './ExportToCsvDialog'
import { ExportToCsvProps } from './types'

const ExportToCsv = <HeaderItemType extends string>({
    apiPromise,
    fileName,
    triggerElementConfig,
    disabled,
    modalConfig,
    headers,
    downloadRequestId,
}: ExportToCsvProps<HeaderItemType>) => {
    const csvRef = useRef(null)
    const abortControllerRef = useRef<AbortController>(new AbortController())

    const [dataToExport, setDataToExport] = useState<Awaited<ReturnType<typeof apiPromise>>>([])
    const [confirmationModalType, setConfirmationModalType] = useState<'default' | 'custom' | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [dataFetchError, setDataFetchError] = useState<ServerErrors>(null)

    const handleInitiateDownload = async () => {
        if (disabled) {
            return
        }

        try {
            setIsLoading(true)
            setDataFetchError(null)
            const data = await apiPromise({ signal: abortControllerRef.current.signal })
            setDataToExport(data)

            csvRef.current?.link?.click()
        } catch (error) {
            if (!getIsRequestAborted(error)) {
                showError(error)
                setDataFetchError(error)
            }
        } finally {
            abortControllerRef.current = new AbortController()
            setIsLoading(false)
        }
    }

    const handleExportButtonClick = async () => {
        if (!modalConfig?.hideDialog) {
            setConfirmationModalType(!modalConfig ? 'default' : 'custom')
        }

        if (!modalConfig || modalConfig.hideDialog) {
            await handleInitiateDownload()
        }
    }

    useEffect(
        () => () => {
            abortControllerRef.current.abort()
        },
        [],
    )

    useEffect(() => {
        if (!isNullOrUndefined(downloadRequestId)) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            handleExportButtonClick()
        }
    }, [downloadRequestId])

    const handleCancelRequest = () => {
        abortControllerRef.current.abort()
        abortControllerRef.current = new AbortController()
        setConfirmationModalType(null)
        setIsLoading(false)
    }

    const renderTriggerButton = () => {
        if (!triggerElementConfig || triggerElementConfig.showOnlyIcon) {
            return (
                <Button
                    {...(triggerElementConfig?.showOnlyIcon
                        ? {
                              icon: <Icon name="ic-download" color={null} />,
                              ariaLabel: 'Export CSV',
                              showAriaLabelInTippy: false,
                          }
                        : {
                              text: 'Export CSV',
                              startIcon: <Icon name="ic-download" color={null} />,
                          })}
                    onClick={handleExportButtonClick}
                    size={ComponentSizeType.medium}
                    variant={ButtonVariantType.secondary}
                    dataTestId="export-csv-button"
                    isLoading={isLoading}
                    disabled={disabled}
                    showTooltip={disabled}
                    tooltipProps={{
                        content: 'Nothing to export',
                    }}
                />
            )
        }

        if (triggerElementConfig.buttonProps) {
            return <Button {...triggerElementConfig.buttonProps} onClick={handleExportButtonClick} />
        }

        if (triggerElementConfig.customButton) {
            return (
                <button
                    data-testid="export-csv-button"
                    type="button"
                    onClick={handleExportButtonClick}
                    disabled={disabled}
                    className={`dc__transparent ${triggerElementConfig.customButton.className}`}
                >
                    {triggerElementConfig.customButton.content}
                </button>
            )
        }

        return null
    }

    const proceedWithDownloadFromCustomModal = async (shouldProceed: boolean) => {
        if (!shouldProceed) {
            setConfirmationModalType(null)
            return
        }

        setConfirmationModalType('default')
        await handleInitiateDownload()
    }

    const renderModal = () => {
        if (!confirmationModalType || modalConfig?.hideDialog) {
            return null
        }

        if (confirmationModalType === 'custom' && modalConfig?.renderCustomModal) {
            return modalConfig.renderCustomModal(proceedWithDownloadFromCustomModal)
        }

        return (
            <ExportToCsvDialog
                exportDataError={dataFetchError}
                isLoading={isLoading}
                initiateDownload={handleInitiateDownload}
                handleCancelRequest={handleCancelRequest}
            />
        )
    }

    return (
        <div>
            {renderTriggerButton()}

            <CSVLink
                ref={csvRef}
                filename={`${fileName}_${moment().format(DATE_TIME_FORMATS.TWELVE_HOURS_EXPORT_FORMAT)}.csv`}
                headers={headers}
                data={dataToExport || []}
                className={ALLOW_ACTION_OUTSIDE_FOCUS_TRAP}
            />

            {renderModal()}
        </div>
    )
}

export default ExportToCsv
