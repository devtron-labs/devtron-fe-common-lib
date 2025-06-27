import { DEVTRON_BASE_MAIN_ID } from '@Shared/constants'

export const createPortalContainerAndAppendToDOM = (portalContainerId: string) => {
    const devtronBaseMainElement = document.getElementById(DEVTRON_BASE_MAIN_ID)
    if (!devtronBaseMainElement) {
        return null
    }

    const portalContainer = document.createElement('div')
    portalContainer.setAttribute('id', portalContainerId)
    devtronBaseMainElement.parentElement.appendChild(portalContainer)

    return portalContainer
}
