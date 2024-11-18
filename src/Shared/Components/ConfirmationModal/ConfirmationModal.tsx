import { ButtonHTMLAttributes, ChangeEvent, useState } from 'react'
import { CustomInput, VisibleModal } from '@Common/index'
import { ComponentSizeType } from '@Shared/constants'
import { ConfirmationModalProps } from './types'
import { getPrimaryButtonStyleFromVariant, getConfirmationLabel, getIconFromVariant } from './utils'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import './confirmationModal.scss'

const ConfirmationModal = ({
    title,
    subtitle,
    Icon,
    variant,
    buttonConfig,
    customInputConfig,
    children,
    handleClose,
}: ConfirmationModalProps) => {
    const customInputIdentifier = customInputConfig?.identifier
    const confirmationKeyword = customInputConfig?.confirmationKeyword
    const { primaryButtonConfig, secondaryButtonConfig } = buttonConfig
    const [confirmationText, setConfirmationText] = useState<string>('')
    const RenderIcon = Icon ?? getIconFromVariant(variant)

    const handleCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmationText(e.target.value)
    }

    const disablePrimaryButton: boolean = confirmationKeyword && confirmationText.trim() !== confirmationKeyword

    return (
        <VisibleModal onEscape={handleClose}>
            <div className="confirmation-modal flexbox-col br-8 bcn-0 dc__m-auto mt-40 w-400 ">
                <div className="flexbox-col dc__gap-12 p-20">
                    <RenderIcon className=" icon-dim-48 dc__no-shrink" />
                    {typeof title === 'string' ? (
                        <div className="cn-9 fs-16 fw-6 lh-24 dc__word-break">{title}</div>
                    ) : (
                        title
                    )}
                    {typeof subtitle === 'string' ? (
                        <div className="cn-8 fs-13 fw-4 lh-20 dc__word-break">{subtitle}</div>
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
                            isRequiredField
                            autoFocus
                        />
                    )}
                    {children}
                </div>
                <div className="p-16 dc__gap-12 flexbox dc__content-end">
                    {secondaryButtonConfig && (
                        <Button
                            dataTestId={secondaryButtonConfig.dataTestId}
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
                            dataTestId={primaryButtonConfig.dataTestId}
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
                            onClick={primaryButtonConfig.onClick as ButtonHTMLAttributes<HTMLButtonElement>['onClick']}
                            startIcon={primaryButtonConfig.startIcon}
                            endIcon={primaryButtonConfig.endIcon}
                        />
                    )}
                </div>
            </div>
        </VisibleModal>
    )
}

export default ConfirmationModal
