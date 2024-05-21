import { useRouteMatch } from 'react-router'
import { URLS } from '../../../Common'
import { TIMELINE_STATUS } from '../../constants'
import { ErrorInfoStatusBar } from './ErrorInfoStatusBar'
import { DeploymentStatusDetailRow } from './DeploymentStatusDetailRow'
import { DeploymentStatusDetailBreakdownType } from './types'
import { getAppDetails } from './utils'
import ErrorBar from '../Error/ErrorBar'

const DeploymentStatusDetailBreakdown = ({
    deploymentStatusDetailsBreakdownData,
    isVirtualEnvironment,
}: DeploymentStatusDetailBreakdownType) => {
    const _appDetails = getAppDetails()
    const { url } = useRouteMatch()
    const isHelmManifestPushed =
        deploymentStatusDetailsBreakdownData.deploymentStatusBreakdown[
            TIMELINE_STATUS.HELM_MANIFEST_PUSHED_TO_HELM_REPO
        ]?.showHelmManifest
    return (
        <>
            {!url.includes(`/${URLS.CD_DETAILS}`) && <ErrorBar appDetails={_appDetails} />}
            <div
                className="deployment-status-breakdown-container pl-20 pr-20 pt-20 pb-20"
                data-testid="deployment-history-steps-status"
            >
                <DeploymentStatusDetailRow
                    type={TIMELINE_STATUS.DEPLOYMENT_INITIATED}
                    deploymentDetailedData={deploymentStatusDetailsBreakdownData}
                />
                {!(
                    isVirtualEnvironment &&
                    deploymentStatusDetailsBreakdownData.deploymentStatusBreakdown[
                        TIMELINE_STATUS.HELM_PACKAGE_GENERATED
                    ]
                ) ? (
                    <>
                        <ErrorInfoStatusBar
                            type={TIMELINE_STATUS.GIT_COMMIT}
                            nonDeploymentError={deploymentStatusDetailsBreakdownData.nonDeploymentError}
                            errorMessage={deploymentStatusDetailsBreakdownData.deploymentError}
                        />
                        <DeploymentStatusDetailRow
                            type={TIMELINE_STATUS.GIT_COMMIT}
                            deploymentDetailedData={deploymentStatusDetailsBreakdownData}
                        />

                        <ErrorInfoStatusBar
                            type={TIMELINE_STATUS.ARGOCD_SYNC}
                            nonDeploymentError={deploymentStatusDetailsBreakdownData.nonDeploymentError}
                            errorMessage={deploymentStatusDetailsBreakdownData.deploymentError}
                        />
                        <DeploymentStatusDetailRow
                            type={TIMELINE_STATUS.ARGOCD_SYNC}
                            deploymentDetailedData={deploymentStatusDetailsBreakdownData}
                        />

                        <ErrorInfoStatusBar
                            type={TIMELINE_STATUS.KUBECTL_APPLY}
                            nonDeploymentError={deploymentStatusDetailsBreakdownData.nonDeploymentError}
                            errorMessage={deploymentStatusDetailsBreakdownData.deploymentError}
                        />
                        <DeploymentStatusDetailRow
                            type={TIMELINE_STATUS.KUBECTL_APPLY}
                            deploymentDetailedData={deploymentStatusDetailsBreakdownData}
                        />

                        <DeploymentStatusDetailRow
                            type={TIMELINE_STATUS.APP_HEALTH}
                            hideVerticalConnector
                            deploymentDetailedData={deploymentStatusDetailsBreakdownData}
                        />
                    </>
                ) : (
                    <>
                        <DeploymentStatusDetailRow
                            type={TIMELINE_STATUS.HELM_PACKAGE_GENERATED}
                            hideVerticalConnector={!isHelmManifestPushed}
                            deploymentDetailedData={deploymentStatusDetailsBreakdownData}
                        />
                        {isHelmManifestPushed && (
                            <DeploymentStatusDetailRow
                                type={TIMELINE_STATUS.HELM_MANIFEST_PUSHED_TO_HELM_REPO}
                                hideVerticalConnector
                                deploymentDetailedData={deploymentStatusDetailsBreakdownData}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default DeploymentStatusDetailBreakdown
