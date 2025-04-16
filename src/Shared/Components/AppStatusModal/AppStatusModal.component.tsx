import { Drawer, stopPropagation } from '@Common/index'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { AppStatusBody } from './AppStatusBody'
import { AppStatusModalProps } from './types'

const AppStatusModal = ({ title, handleClose, type, appDetails }: AppStatusModalProps) => (
    <Drawer position="right" width="1024px" onClose={handleClose} onEscape={handleClose}>
        <div
            className="flexbox-col dc__content-space h-100 border__primary--left bg__modal--primary shadow__modal"
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
                <AppStatusBody appDetails={appDetails} type={type} />
            </div>
        </div>
    </Drawer>
)

export default AppStatusModal
