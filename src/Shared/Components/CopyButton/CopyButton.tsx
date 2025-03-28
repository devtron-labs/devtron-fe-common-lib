import { ReactComponent as ICClipboard } from '@Icons/ic-copy.svg'
import { ReactComponent as ICCheck } from '@Icons/ic-check.svg'
import { useState } from 'react'
import { ComponentSizeType } from '@Shared/constants'
import { copyToClipboard, showError } from '@Common/index'
import { Button, ButtonProps, ButtonStyleType, ButtonVariantType } from '../Button'

interface CopyButtonProps {
    buttonConfig?: Partial<Pick<ButtonProps, 'style' | 'variant' | 'size' | 'text'>>
    copyContent: string
}

const CopyButton = ({ buttonConfig, copyContent }: CopyButtonProps) => {
    const [clicked, setClicked] = useState<boolean>(false)

    const handleCopy = async () => {
        try {
            await copyToClipboard(copyContent)
            setClicked(true)
            setTimeout(() => {
                setClicked(false)
            }, 1000)
        } catch (err) {
            showError(err)
        }
    }

    return (
        <Button
            dataTestId="copy-button"
            text={buttonConfig?.text || 'Copy'}
            startIcon={clicked ? <ICCheck /> : <ICClipboard />}
            style={buttonConfig?.style ?? ButtonStyleType.default}
            variant={buttonConfig?.variant ?? ButtonVariantType.primary}
            size={buttonConfig?.size ?? ComponentSizeType.large}
            onClick={handleCopy}
        />
    )
}

export default CopyButton
