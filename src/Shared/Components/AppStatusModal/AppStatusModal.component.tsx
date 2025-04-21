import { useState } from 'react'

import { Drawer, stopPropagation } from '@Common/index'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { AppStatusBody } from './AppStatusBody'
import { AppStatusModalProps } from './types'

import './AppStatusModal.scss'

const AppStatusModal = ({
    title,
    handleClose,
    type,
    appDetails,
    isConfigDriftEnabled,
    configDriftModal: ConfigDriftModal,
}: AppStatusModalProps) => {
    const [showConfigDriftModal, setShowConfigDriftModal] = useState(false)

    const handleShowConfigDriftModal = isConfigDriftEnabled
        ? () => {
              setShowConfigDriftModal(true)
          }
        : null

    const handleCloseConfigDriftModal = () => {
        setShowConfigDriftModal(false)
    }

    if (showConfigDriftModal) {
        return (
            <ConfigDriftModal
                appId={appDetails.appId}
                envId={+appDetails.environmentId}
                handleCloseModal={handleCloseConfigDriftModal}
            />
        )
    }

    return (
        <Drawer position="right" width="1024px" onClose={handleClose} onEscape={handleClose}>
            <div
                className="flexbox-col dc__content-space h-100 border__primary--left bg__modal--primary shadow__modal app-status-modal"
                onClick={stopPropagation}
            >
                <div className="flexbox-col px-20 border__primary--bottom dc__no-shrink">
                    <div className="flexbox py-12 dc__content-space">
                        {title}

                        <Button
                            dataTestId="close-modal-header-icon-button"
                            variant={ButtonVariantType.borderLess}
                            style={ButtonStyleType.negativeGrey}
                            size={ComponentSizeType.xs}
                            icon={<Icon name="ic-close-large" color={null} />}
                            ariaLabel="Close modal"
                            showAriaLabelInTippy={false}
                            onClick={handleClose}
                        />
                    </div>
                </div>

                <div className="flexbox-col flex-grow-1 dc__overflow-auto p-20 dc__gap-16">
                    <AppStatusBody
                        appDetails={appDetails}
                        type={type}
                        handleShowConfigDriftModal={handleShowConfigDriftModal}
                    />
                </div>
            </div>
        </Drawer>
    )
}

export default AppStatusModal
