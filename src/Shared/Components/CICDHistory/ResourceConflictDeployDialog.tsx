import { useState } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'

import { showError } from '@Common/Helper'
import { ROUTER_URLS } from '@PagesDevtron2.0/index'

import { ButtonStyleType } from '../Button'
import { ConfirmationModal, ConfirmationModalVariantType } from '../ConfirmationModal'
import { Icon } from '../Icon'
import { resourceConflictRedeploy } from './service'
import { ResourceConflictDeployDialogProps, ResourceConflictDeployDialogURLParamsType } from './types'

const ResourceConflictDeployDialog = ({ appName, environmentName, handleClose }: ResourceConflictDeployDialogProps) => {
    const navigate = useNavigate()
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
            setIsLoading(false)
            navigate(
                generatePath(ROUTER_URLS.DEVTRON_APP_DETAILS.ENV_DETAILS, {
                    appId,
                    envId,
                }),
            )
        } catch (error) {
            showError(error)
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
