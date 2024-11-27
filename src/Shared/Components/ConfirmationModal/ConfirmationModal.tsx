import { ButtonHTMLAttributes, ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CustomInput, useRegisterShortcut, UseRegisterShortcutProvider } from '@Common/index'
import { ComponentSizeType } from '@Shared/constants'
import { ConfirmationModalProps } from './types'
import { getPrimaryButtonStyleFromVariant, getConfirmationLabel, getIconFromVariant } from './utils'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import './confirmationModal.scss'
import { Backdrop } from '../Backdrop'

const ConfirmationModal = ({
    title,
    subtitle,
    Icon,
    variant,
    buttonConfig,
    customInputConfig,
    children,
    showConfirmationModal,
    handleClose,
}: ConfirmationModalProps) => {
    const timeoutRef = useRef<number>(null)

    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    const [confirmationText, setConfirmationText] = useState<string>('')

    const customInputIdentifier = customInputConfig?.identifier
    const confirmationKeyword = customInputConfig?.confirmationKeyword

    const { primaryButtonConfig, secondaryButtonConfig } = buttonConfig

    const RenderIcon = Icon ?? getIconFromVariant(variant)

    const disablePrimaryButton: boolean = confirmationKeyword && confirmationText.trim() !== confirmationKeyword

    const handleTriggerPrimaryActionButton = () => {
        if (primaryButtonConfig && !disablePrimaryButton) {
            primaryButtonConfig.onClick()
        }
    }

    const handleEnterKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTriggerPrimaryActionButton()
        }
    }

    const handleCloseWrapper = useCallback(() => {
        if (!primaryButtonConfig?.isLoading && !secondaryButtonConfig?.disabled) {
            handleClose()
        }
    }, [primaryButtonConfig, secondaryButtonConfig])

    useEffect(() => {
        if (showConfirmationModal) {
            // Timeout so that if modal is opened on enter press, it does not trigger onClick
            timeoutRef.current = setTimeout(() => {
                registerShortcut({ keys: ['Enter'], callback: handleTriggerPrimaryActionButton })
            }, 100)
        }

        return () => {
            if (showConfirmationModal) {
                unregisterShortcut(['Enter'])
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [showConfirmationModal, primaryButtonConfig, disablePrimaryButton])

    const handleCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmationText(e.target.value)
    }

    return (
        <AnimatePresence>
            {showConfirmationModal ? (
                <Backdrop onEscape={handleCloseWrapper}>
                    <motion.div
                        className="confirmation-modal flexbox-col br-8 bcn-0 dc__m-auto mt-40 w-400"
                        exit={{ y: 100, opacity: 0, scale: 0.75, transition: { duration: 0.35 } }}
                        initial={{ y: 100, opacity: 0, scale: 0.75 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                    >
                        <div className="flexbox-col dc__gap-12 p-20">
                            <RenderIcon className="icon-dim-48 dc__no-shrink" />
                            <span className="cn-9 fs-16 fw-6 lh-24 dc__word-break">{title}</span>

                            {typeof subtitle === 'string' ? (
                                <span className="cn-8 fs-13 fw-4 lh-20 dc__word-break">{subtitle}</span>
                            ) : (
                                subtitle
                            )}

                            {customInputConfig && (
                                <CustomInput
                                    name={customInputIdentifier}
                                    value={confirmationText}
                                    onChange={handleCustomInputChange}
                                    label={getConfirmationLabel(confirmationKeyword)}
                                    inputWrapClassName="w-100"
                                    placeholder="Type to confirm"
                                    onKeyDown={handleEnterKeyPress}
                                    isRequiredField
                                    autoFocus
                                />
                            )}

                            {children}
                        </div>
                        <div className="p-16 dc__gap-12 flexbox dc__content-end">
                            {secondaryButtonConfig && (
                                <Button
                                    dataTestId="confirmation-modal-secondary-button"
                                    size={ComponentSizeType.large}
                                    variant={ButtonVariantType.secondary}
                                    style={
                                        'style' in secondaryButtonConfig
                                            ? secondaryButtonConfig.style
                                            : ButtonStyleType.neutral
                                    }
                                    disabled={secondaryButtonConfig.disabled}
                                    text={secondaryButtonConfig.text}
                                    onClick={
                                        secondaryButtonConfig.onClick as ButtonHTMLAttributes<HTMLButtonElement>['onClick']
                                    }
                                    startIcon={secondaryButtonConfig.startIcon}
                                    endIcon={secondaryButtonConfig.endIcon}
                                />
                            )}

                            {primaryButtonConfig && (
                                <Button
                                    dataTestId="confirmation-modal-primary-button"
                                    size={ComponentSizeType.large}
                                    variant={ButtonVariantType.primary}
                                    style={
                                        'style' in primaryButtonConfig
                                            ? primaryButtonConfig.style
                                            : getPrimaryButtonStyleFromVariant(variant)
                                    }
                                    disabled={
                                        ('disabled' in primaryButtonConfig && primaryButtonConfig.disabled) ||
                                        disablePrimaryButton
                                    }
                                    isLoading={primaryButtonConfig.isLoading}
                                    text={primaryButtonConfig.text}
                                    onClick={
                                        primaryButtonConfig.onClick as ButtonHTMLAttributes<HTMLButtonElement>['onClick']
                                    }
                                    startIcon={primaryButtonConfig.startIcon}
                                    endIcon={primaryButtonConfig.endIcon}
                                />
                            )}
                        </div>
                    </motion.div>
                </Backdrop>
            ) : null}
        </AnimatePresence>
    )
}

const WrapWithShortcutProvider = (props: ConfirmationModalProps) => (
    <UseRegisterShortcutProvider ignoreTags={['button']}>
        <ConfirmationModal {...props} />
    </UseRegisterShortcutProvider>
)

export default WrapWithShortcutProvider
