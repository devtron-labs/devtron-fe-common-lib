import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { URLS } from '@Common/Constants'
import { showError } from '@Common/Helper'
import { ToastManager, ToastVariantType } from '@Shared/Services'

import { ButtonStyleType } from '../Button'
import { ConfirmationModal, ConfirmationModalVariantType } from '../ConfirmationModal'
import { Icon } from '../Icon'
import { resourceConflictRedeploy } from './service'
import { ResourceConflictDeployDialogProps, ResourceConflictDeployDialogURLParamsType } from './types'

const ResourceConflictDeployDialog = ({ appName, environmentName, handleClose }: ResourceConflictDeployDialogProps) => {
    const history = useHistory()
    const { appId, envId, pipelineId, triggerId } = useParams<ResourceConflictDeployDialogURLParamsType>()
    const [isLoading, setIsLoading] = useState(false)

    const handleDeploy = async () => {
        setIsLoading(true)
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
            history.push(`${URLS.APP}/${appId}/details/${envId}`)
        } catch (error) {
            showError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ConfirmationModal
            variant={ConfirmationModalVariantType.custom}
            Icon={<Icon name="ic-warning" color={null} size={48} />}
            title="Take resource ownership and redeploy"
            subtitle={`Ensure the resources belong to the '${appName}' application and the '${environmentName}' environment to avoid destructive changes.`}
            handleClose={handleClose}
            buttonConfig={{
                secondaryButtonConfig: {
                    text: 'Cancel',
                    onClick: handleClose,
                },
                primaryButtonConfig: {
                    isLoading,
                    text: 'Re-deploy',
                    onClick: handleDeploy,
                    style: ButtonStyleType.warning,
                },
            }}
        />
    )
}

export default ResourceConflictDeployDialog
