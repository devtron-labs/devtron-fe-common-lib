import { PropsWithChildren } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { noop, stopPropagation } from '@Common/Helper'
import { Backdrop, Button, ButtonStyleType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { MODAL_WIDTH_TO_CLASS_NAME_MAP } from './constants'
import { GenericModalProvider, useGenericModalContext } from './GenericModal.context'
import { GenericModalFooterProps, GenericModalHeaderProps, GenericModalProps } from './types'

const GenericModalHeader = ({ title }: GenericModalHeaderProps) => {
    const { name, onClose } = useGenericModalContext()

    return (
        <div className="flex dc__content-space dc__gap-12 border__secondary-translucent--bottom px-20 pt-12 pb-11">
            <h2 data-testid={`${name}-heading`} className="m-0 fs-16 lh-24 fw-6 cn-9 dc__truncate">
                {title}
            </h2>
            <Button
                dataTestId={`${name}-close-button`}
                ariaLabel={`${name}-close-button`}
                icon={<Icon name="ic-close-large" color={null} />}
                variant={ButtonVariantType.borderLess}
                style={ButtonStyleType.negativeGrey}
                size={ComponentSizeType.xs}
                onClick={onClose}
                showAriaLabelInTippy={false}
            />
        </div>
    )
}

const GenericModalFooter = ({
    leftSideElement,
    buttonConfig,
    children,
}: PropsWithChildren<GenericModalFooterProps>) => (
    <div
        className={`border__secondary-translucent--top px-20 pt-15 pb-16 ${!children ? `flex dc__gap-12 ${leftSideElement ? 'dc__content-space' : 'right'}` : ''}`}
    >
        {children || (
            <>
                {leftSideElement}
                {!!buttonConfig && (
                    <div className="flex dc__gap-12">
                        {buttonConfig?.secondaryButton && (
                            <Button
                                variant={ButtonVariantType.secondary}
                                style={ButtonStyleType.neutral}
                                {...buttonConfig.secondaryButton}
                            />
                        )}
                        {buttonConfig?.primaryButton && <Button {...buttonConfig.primaryButton} />}
                    </div>
                )}
            </>
        )}
    </div>
)

// eslint-disable-next-line react/jsx-no-useless-fragment
const GenericModalBody = ({ children }: PropsWithChildren<{}>) => <>{children}</>

const GenericModal = ({
    name,
    open,
    width = 600,
    onClose,
    onEscape = noop,
    closeOnBackdropClick = false,
    children,
}: PropsWithChildren<GenericModalProps>) => (
    <GenericModalProvider value={{ name, onClose }}>
        <AnimatePresence>
            {open && (
                <Backdrop onEscape={onEscape} onClick={closeOnBackdropClick ? onClose : undefined}>
                    <motion.div
                        className={`shadow__modal flexbox-col bg__primary border__secondary br-8 dc__m-auto mt-40 dc__overflow-hidden ${MODAL_WIDTH_TO_CLASS_NAME_MAP[width]}`}
                        exit={{ y: 100, opacity: 0, scale: 0.75, transition: { duration: 0.35 } }}
                        initial={{ y: 100, opacity: 0, scale: 0.75 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        onClick={stopPropagation}
                    >
                        {children}
                    </motion.div>
                </Backdrop>
            )}
        </AnimatePresence>
    </GenericModalProvider>
)

GenericModal.Header = GenericModalHeader
GenericModal.Body = GenericModalBody
GenericModal.Footer = GenericModalFooter

export default GenericModal
