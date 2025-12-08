import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { useQuery } from '@Common/API'
import { URLS } from '@Common/Constants'
import { Drawer } from '@Common/Drawer'
import { showError, stopPropagation } from '@Common/Helper'
import { ComponentSizeType } from '@Shared/constants'
import { ToastManager, ToastVariantType } from '@Shared/Services'

import { APIResponseHandler } from '../APIResponseHandler'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import ConflictedResourcesTable from './ConflictedResourcesTable'
import { getResourceConflictDetails, resourceConflictRedeploy } from './service'
import {
    ResourceConflictDeployDialogURLParamsType,
    ResourceConflictDetailsModalProps,
    ResourceConflictItemType,
} from './types'

const ResourceConflictDetailsModal = ({ appName, environmentName, handleClose }: ResourceConflictDetailsModalProps) => {
    const { appId, envId, pipelineId, triggerId } = useParams<ResourceConflictDeployDialogURLParamsType>()
    const history = useHistory()

    const {
        isFetching: isLoadingResourceData,
        data: resourceConflictDetails,
        refetch: refetchResourceConflictDetails,
        error: resourceConflictDetailsError,
    } = useQuery<ResourceConflictItemType[], ResourceConflictItemType[], [string, string, string, string], false>({
        queryKey: ['getResourceConflictDetails', pipelineId, triggerId, appId],
        queryFn: ({ signal }) => getResourceConflictDetails({ pipelineId, triggerId, appId, signal }),
    })

    const [isDeploying, setIsDeploying] = useState(false)

    const handleDeploy = async () => {
        setIsDeploying(true)
        try {
            await resourceConflictRedeploy({
                pipelineId,
                triggerId,
                appId,
            })
            ToastManager.showToast({
                variant: ToastVariantType.success,
                title: 'Redeploy initiated',
                description: `Redeployment for application '${appName}' in environment '${environmentName}' has been initiated successfully.`,
            })
            handleClose()
            history.push(`${URLS.APPLICATION_MANAGEMENT_APP}/${appId}/details/${envId}`)
        } catch (error) {
            showError(error)
        } finally {
            setIsDeploying(false)
        }
    }

    return (
        <Drawer width="800px" onClose={handleClose} onEscape={handleClose} position="right">
            <div
                className="flexbox-col dc__content-space h-100 bg__modal--primary shadow__modal dc__overflow-auto"
                onClick={stopPropagation}
            >
                <div className="flexbox-col dc__overflow-auto flex-grow-1">
                    <div className="px-20 py-12 flexbox dc__content-space dc__align-items-center border__primary--bottom">
                        <h2 className="m-0 fs-16 fw-6 lh-24 cn-9">Resources with conflict</h2>

                        <Button
                            dataTestId="header-close-button"
                            ariaLabel="Close"
                            showAriaLabelInTippy={false}
                            onClick={handleClose}
                            variant={ButtonVariantType.borderLess}
                            style={ButtonStyleType.negativeGrey}
                            icon={<Icon name="ic-close-large" color={null} />}
                            size={ComponentSizeType.xs}
                        />
                    </div>

                    <div className="flexbox-col flex-grow-1 dc__overflow-auto w-100">
                        <APIResponseHandler
                            isLoading={isLoadingResourceData}
                            progressingProps={{
                                pageLoader: true,
                            }}
                            error={resourceConflictDetailsError}
                            errorScreenManagerProps={{
                                code: resourceConflictDetailsError?.code,
                                reload: refetchResourceConflictDetails,
                                on404Redirect: handleClose,
                            }}
                        >
                            <ConflictedResourcesTable resourceConflictDetails={resourceConflictDetails} />
                        </APIResponseHandler>
                    </div>
                </div>

                <div className="flexbox dc__align-items-center dc__content-space dc__gap-20 py-16 px-20 border__primary--top dc__no-shrink">
                    <div className="flexbox dc__gap-8">
                        <Icon name="ic-warning" size={20} color={null} />
                        <div className="flexbox-col">
                            <span className="cn-9 fs-13 fw-6 lh-1-5">Take resource ownership and redeploy</span>
                            <span>
                                Ensure all resources strictly belong to the {appName} application and the&nbsp;
                                {environmentName}
                                environment. Any resource outside this Helm release may cause incorrect associations and
                                potentially destructive changes.
                            </span>
                        </div>
                    </div>
                    <div className="dc__no-shrink">
                        <Button
                            dataTestId="footer-redeploy-button"
                            variant={ButtonVariantType.primary}
                            style={ButtonStyleType.warning}
                            size={ComponentSizeType.large}
                            text="Re-deploy"
                            startIcon={<Icon name="ic-rocket-launch" color={null} />}
                            isLoading={isDeploying}
                            disabled={!!resourceConflictDetailsError || isLoadingResourceData}
                            onClick={handleDeploy}
                        />
                    </div>
                </div>
            </div>
        </Drawer>
    )
}

export default ResourceConflictDetailsModal
