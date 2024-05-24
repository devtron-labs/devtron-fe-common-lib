/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { DATE_TIME_FORMATS, showError } from '../../../Common'
import { DEPLOYMENT_STATUS, statusIcon, TIMELINE_STATUS } from '../../constants'
import { ErrorInfoStatusBar } from './ErrorInfoStatusBar'
import { DeploymentStatusDetailRowType } from './types'
import { getManualSync } from './service'
import { MANIFEST_STATUS_HEADERS, TERMINAL_STATUS_MAP } from './constants'
import { ReactComponent as Close } from '../../../Assets/Icon/ic-close.svg'
import { ReactComponent as Check } from '../../../Assets/Icon/ic-check-grey.svg'
import { ReactComponent as ICHelpOutline } from '../../../Assets/Icon/ic-help-outline.svg'
import { ReactComponent as Error } from '../../../Assets/Icon/ic-error-exclamation.svg'
import { ReactComponent as Timer } from '../../../Assets/Icon/ic-timer.svg'
import { ReactComponent as Disconnect } from '../../../Assets/Icon/ic-disconnected.svg'
import { ReactComponent as TimeOut } from '../../../Assets/Icon/ic-timeout-red.svg'
import { ReactComponent as DropDownIcon } from '../../../Assets/Icon/ic-chevron-down.svg'
import { ShowMoreText } from '../ShowMoreText/ShowMoreText'
import AppStatusDetailsChart from './AppStatusDetailsChart'

export const DeploymentStatusDetailRow = ({
    type,
    hideVerticalConnector,
    deploymentDetailedData,
}: DeploymentStatusDetailRowType) => {
    const { appId, envId } = useParams<{ appId: string; envId: string }>()
    const statusBreakDownType = deploymentDetailedData.deploymentStatusBreakdown[type]
    const [collapsed, toggleCollapsed] = useState<boolean>(statusBreakDownType.isCollapsed)
    const appHealthDropDownlist = ['inprogress', 'failed', 'disconnect', 'timed_out']
    const isHelmManifestPushFailed =
        type === TIMELINE_STATUS.HELM_MANIFEST_PUSHED_TO_HELM_REPO &&
        deploymentDetailedData.deploymentStatus === statusIcon.failed

    useEffect(() => {
        toggleCollapsed(statusBreakDownType.isCollapsed)
    }, [statusBreakDownType.isCollapsed])

    async function manualSyncData() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const response = await getManualSync({ appId, envId })
        } catch (error) {
            showError(error)
        }
    }
    const toggleDropdown = () => {
        toggleCollapsed(!collapsed)
    }

    const renderIcon = (iconState: string): JSX.Element => {
        switch (iconState) {
            case 'success':
                return <Check className="icon-dim-20 green-tick" data-testid="success-green-tick" />
            case 'failed':
                return <Error className="icon-dim-20" />
            case 'unknown':
                return <ICHelpOutline className="icon-dim-20" />
            case 'inprogress':
                return (
                    <div className="icon-dim-20">
                        <div className="pulse-highlight" />
                    </div>
                )
            case 'unreachable':
                return <Close className="icon-dim-20" />
            case 'loading':
                return <div className="dc__app-summary__icon icon-dim-20 mr-6 progressing progressing--node" />
            case 'disconnect':
                return <Disconnect className="icon-dim-20" />
            case 'time_out':
                return <TimeOut className="icon-dim-20" />
            default:
                return <Timer className="icon-dim-20 timer-icon" />
        }
    }

    const renderDetailedData = () =>
        !collapsed ? (
            <div className="bcn-0 en-2 detail-tab_border bw-1">
                {statusBreakDownType.timelineStatus && (
                    <div
                        className={`flex left pt-8 pl-12 pb-8 lh-20 ${
                            statusBreakDownType.icon !== 'inprogress' ? 'bcr-1' : 'bcy-2'
                        }`}
                    >
                        {deploymentDetailedData.deploymentStatusBreakdown[type].timelineStatus}
                        {(deploymentDetailedData.deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT ||
                            deploymentDetailedData.deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH) && (
                            <span className="cb-5 fw-6 ml-8 cursor" onClick={manualSyncData}>
                                Try now
                            </span>
                        )}
                    </div>
                )}
                {type === TIMELINE_STATUS.KUBECTL_APPLY && (
                    <div className="pr-8 pl-8 pt-12 pb-12">
                        <div className="">
                            {deploymentDetailedData.deploymentStatusBreakdown[
                                TIMELINE_STATUS.KUBECTL_APPLY
                            ].kubeList?.map((items, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div className="flex left lh-20 mb-8" key={`item-${index}`}>
                                    {renderIcon(items.icon)}
                                    <span className="ml-12">{items.message}</span>
                                </div>
                            ))}
                        </div>
                        {statusBreakDownType.resourceDetails?.length ? (
                            <div className="pl-32">
                                <div className="app-status-row dc__border-bottom pt-8 pb-8">
                                    {MANIFEST_STATUS_HEADERS.map((headerKey, index) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <div className="fs-13 fw-6 cn-7" key={`header_${index}`}>
                                            {headerKey}
                                        </div>
                                    ))}
                                </div>
                                <div className="resource-list fs-13">
                                    {statusBreakDownType.resourceDetails.map((nodeDetails) => (
                                        <div
                                            className="app-status-row pt-8 pb-8"
                                            key={`${nodeDetails.resourceKind}/${nodeDetails.resourceName}`}
                                        >
                                            <div className="dc__break-word">{nodeDetails.resourceKind}</div>
                                            <div className="dc__break-word">{nodeDetails.resourceName}</div>
                                            <div
                                                className={`app-summary__status-name f-${
                                                    nodeDetails.resourceStatus
                                                        ? nodeDetails.resourceStatus.toLowerCase() ===
                                                          TERMINAL_STATUS_MAP.RUNNING
                                                            ? TERMINAL_STATUS_MAP.PROGRESSING
                                                            : nodeDetails.resourceStatus.toLowerCase()
                                                        : ''
                                                }`}
                                            >
                                                {nodeDetails.resourceStatus}
                                            </div>
                                            <ShowMoreText text={nodeDetails.statusMessage} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        ) : null

    const renderDetailChart = () =>
        !collapsed && (
            <div className="bcn-0 en-2 detail-tab_border bw-1">
                {statusBreakDownType.timelineStatus && (
                    <div
                        className={`flex left pt-8 pl-12 pb-8 lh-20 ${
                            statusBreakDownType.icon !== 'inprogress' ? 'bcr-1' : 'bcy-2'
                        }`}
                    >
                        {statusBreakDownType.timelineStatus}
                        {(deploymentDetailedData.deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT ||
                            deploymentDetailedData.deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH) && (
                            <span className="cb-5 fw-6 ml-8 cursor" onClick={manualSyncData}>
                                Try now
                            </span>
                        )}
                    </div>
                )}
                <div>
                    <AppStatusDetailsChart filterRemoveHealth showFooter={false} />
                </div>
            </div>
        )

    const renderErrorInfoBar = () => (
        <ErrorInfoStatusBar
            type={TIMELINE_STATUS.HELM_MANIFEST_PUSHED_TO_HELM_REPO}
            nonDeploymentError={deploymentDetailedData.nonDeploymentError}
            errorMessage={deploymentDetailedData.deploymentError}
            hideVerticalConnector
            hideErrorIcon
        />
    )

    return (
        <>
            <div className="bw-1 en-2">
                <div
                    className={`deployment-status-breakdown-row pt-8 pb-8 pl-8 pr-8 bcn-0  ${
                        collapsed ? (!isHelmManifestPushFailed ? 'br-4' : '') : 'border-collapse'
                    }`}
                >
                    {renderIcon(statusBreakDownType.icon)}
                    <span className="ml-12 mr-12 fs-13">
                        <span data-testid="deployment-status-step-name">{statusBreakDownType.displayText}</span>
                        {statusBreakDownType.displaySubText && (
                            <span className={`ml-12 f-${statusBreakDownType.icon || 'waiting'}`}>
                                {statusBreakDownType.displaySubText}
                            </span>
                        )}
                    </span>

                    {statusBreakDownType.time !== '' && statusBreakDownType.icon !== 'inprogress' && (
                        <span
                            data-testid="deployment-status-kubernetes-dropdown"
                            className={`pl-8 pr-8 pt-4 pb-4 br-12 ${
                                statusBreakDownType.icon === 'failed' ? 'bcr-1 cr-5' : 'bcg-1 cg-7'
                            }`}
                        >
                            {moment(statusBreakDownType.time, 'YYYY-MM-DDTHH:mm:ssZ').format(
                                DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT,
                            )}
                        </span>
                    )}
                    {((type === TIMELINE_STATUS.KUBECTL_APPLY && statusBreakDownType.kubeList?.length) ||
                        (type === TIMELINE_STATUS.APP_HEALTH &&
                            appHealthDropDownlist.includes(statusBreakDownType.icon)) ||
                        ((type === TIMELINE_STATUS.GIT_COMMIT || type === TIMELINE_STATUS.ARGOCD_SYNC) &&
                            statusBreakDownType.icon === 'failed')) && (
                        <DropDownIcon
                            style={{ marginLeft: 'auto', ['--rotateBy' as any]: `${180 * Number(!collapsed)}deg` }}
                            className="icon-dim-24 rotate pointer"
                            onClick={toggleDropdown}
                            data-testid="steps-deployment-history-dropdown"
                        />
                    )}
                </div>
                {isHelmManifestPushFailed && renderErrorInfoBar()}
            </div>

            {type === TIMELINE_STATUS.GIT_COMMIT && renderDetailedData()}
            {type === TIMELINE_STATUS.ARGOCD_SYNC && renderDetailedData()}
            {type === TIMELINE_STATUS.KUBECTL_APPLY && renderDetailedData()}
            {type === TIMELINE_STATUS.APP_HEALTH && renderDetailChart()}
            {!hideVerticalConnector && <div className="vertical-connector" />}
        </>
    )
}
