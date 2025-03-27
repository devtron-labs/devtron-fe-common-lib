/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ButtonHTMLAttributes, ChangeEvent, cloneElement, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { noop, stopPropagation, useRegisterShortcut, UseRegisterShortcutProvider } from '@Common/index'
import { ComponentSizeType } from '@Shared/constants'
import { getUniqueId } from '@Shared/Helpers'
import { ConfirmationModalBodyProps, ConfirmationModalProps, ConfirmationModalVariantType } from './types'
import { getPrimaryButtonStyleFromVariant, getConfirmationLabel, getIconFromVariant } from './utils'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { Backdrop } from '../Backdrop'
import { useConfirmationModalContext } from './ConfirmationModalContext'
import { CustomInput } from '../CustomInput'
import { Confetti } from '../Confetti'
import './confirmationModal.scss'

const ConfirmationModalBody = ({
    title,
    subtitle,
    Icon,
    variant,
    buttonConfig,
    confirmationConfig,
    children,
    handleClose,
    shouldCloseOnEscape = true,
    isLandscapeView = false,
    showConfetti = false,
}: ConfirmationModalBodyProps) => {
    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    const [confirmationText, setConfirmationText] = useState<string>('')

    const customInputIdentifier = confirmationConfig?.identifier
    const confirmationKeyword = confirmationConfig?.confirmationKeyword

    const { primaryButtonConfig, secondaryButtonConfig } = buttonConfig

    const RenderIcon = Icon ?? getIconFromVariant(variant)
    const hideIcon = variant === ConfirmationModalVariantType.custom && !Icon

    const disablePrimaryButton: boolean =
        ('disabled' in primaryButtonConfig && primaryButtonConfig.disabled) ||
        (confirmationKeyword && confirmationText.trim() !== confirmationKeyword)

    const handleTriggerPrimaryActionButton = () => {
        if (primaryButtonConfig && !disablePrimaryButton) {
            primaryButtonConfig.onClick()
        }
    }

    const handleCloseWrapper = useCallback(() => {
        if (!primaryButtonConfig?.isLoading && !secondaryButtonConfig?.disabled) {
            handleClose()
        }
    }, [primaryButtonConfig, secondaryButtonConfig])

    useEffect(() => {
        registerShortcut({ keys: ['Enter'], callback: handleTriggerPrimaryActionButton })

        return () => {
            unregisterShortcut(['Enter'])
        }
    }, [primaryButtonConfig, disablePrimaryButton])

    const handleCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmationText(e.target.value)
    }

    return (
        <Backdrop onEscape={shouldCloseOnEscape ? handleCloseWrapper : noop}>
            <motion.div
                className={`${isLandscapeView ? 'w-500' : 'w-400'} confirmation-modal border__secondary flexbox-col br-8 bg__primary dc__m-auto mt-40`}
                exit={{ y: 100, opacity: 0, scale: 0.75, transition: { duration: 0.35 } }}
                initial={{ y: 100, opacity: 0, scale: 0.75 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                onClick={stopPropagation}
            >
                <div className="flexbox-col dc__gap-16 p-20">
                    {hideIcon
                        ? null
                        : cloneElement(RenderIcon, {
                              className: `${RenderIcon.props?.className ?? ''} icon-dim-48 dc__no-shrink`,
                          })}

                    <div className={`flexbox-col ${isLandscapeView ? '' : 'dc__gap-8'}`}>
                        <span className="cn-9 fs-16 fw-6 lh-24 dc__word-break">{title}</span>

                        {typeof subtitle === 'string' ? (
                            <span className="cn-8 fs-13 fw-4 lh-20 dc__word-break">{subtitle}</span>
                        ) : (
                            subtitle
                        )}
                    </div>

                    {children}

                    {confirmationConfig && (
                        <CustomInput
                            name={customInputIdentifier}
                            value={confirmationText}
                            onChange={handleCustomInputChange}
                            label={getConfirmationLabel(confirmationKeyword)}
                            fullWidth
                            placeholder="Type to confirm"
                            required
                            autoFocus
                        />
                    )}
                </div>
                <div className="px-20 py-16 dc__gap-12 flexbox dc__content-end">
                    {secondaryButtonConfig && (
                        <Button
                            dataTestId="confirmation-modal-secondary-button"
                            size={ComponentSizeType.large}
                            variant={ButtonVariantType.secondary}
                            style={
                                'style' in secondaryButtonConfig ? secondaryButtonConfig.style : ButtonStyleType.neutral
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
                            disabled={disablePrimaryButton}
                            isLoading={primaryButtonConfig.isLoading}
                            text={primaryButtonConfig.text}
                            onClick={primaryButtonConfig.onClick as ButtonHTMLAttributes<HTMLButtonElement>['onClick']}
                            startIcon={primaryButtonConfig.startIcon}
                            endIcon={primaryButtonConfig.endIcon}
                        />
                    )}
                </div>
            </motion.div>

            {showConfetti && <Confetti />}
        </Backdrop>
    )
}

export const BaseConfirmationModal = () => {
    const { modalKey, settersRef } = useConfirmationModalContext()
    const [confirmationProps, setConfirmationProps] = useState<ConfirmationModalProps | null>(null)

    useEffect(() => {
        settersRef.current = {
            setProps: setConfirmationProps,
        }
    }, [])

    return (
        <UseRegisterShortcutProvider ignoreTags={['button']}>
            <AnimatePresence>{!!modalKey && <ConfirmationModalBody {...confirmationProps} />}</AnimatePresence>
        </UseRegisterShortcutProvider>
    )
}

const ConfirmationModal = (props: ConfirmationModalProps) => {
    const { setModalKey, settersRef } = useConfirmationModalContext()

    useEffect(() => {
        const id = getUniqueId()
        setModalKey(id)

        return () => {
            setModalKey((prev) => {
                if (prev === id) {
                    return ''
                }

                return prev
            })
        }
    }, [])

    useEffect(() => {
        settersRef.current.setProps(props)
    }, [props])

    return null
}

export default ConfirmationModal
