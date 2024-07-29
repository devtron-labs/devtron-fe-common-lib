import { SyntheticEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { showError } from '@Common/Helper'
import { CustomInput } from '@Common/CustomInput'
import { ButtonWithLoader, ImageWithFallback } from '@Shared/Components'
import { validateIfImageExist, validateURL } from '@Shared/validations'
import { ReactComponent as ICPencil } from '@Icons/ic-pencil.svg'
import { EditImageFormFieldProps, FallbackImageProps } from './types'
import { DEFAULT_IMAGE_DIMENSIONS, DEFAULT_MAX_IMAGE_SIZE, EMPTY_PREVIEW_URL_ERROR_MESSAGE } from './constants'
import './EditImageFormField.scss'

const FallbackImage = ({ showEditIcon, defaultIcon }: FallbackImageProps) => (
    <div
        className={`flex dc__align-self-start dc__no-shrink br-4 edit-image-form-field__fallback-image p-12 ${showEditIcon ? 'base-image' : ''}`}
        // Adding inline style to make sure it is configurable through constants
        style={{
            height: DEFAULT_IMAGE_DIMENSIONS.height,
            width: DEFAULT_IMAGE_DIMENSIONS.width,
        }}
    >
        {defaultIcon}
    </div>
)

// NOTE: Have to replace component in UpsertTenantModal with EditImageFormField when prioritized.
const EditImageFormField = ({
    defaultIcon,
    errorMessage,
    handleError,
    url,
    handleURLChange,
    ariaLabelPrefix,
    dataTestIdPrefix,
    altText,
}: EditImageFormFieldProps) => {
    const [lastPreviewedURL, setLastPreviewedURL] = useState<string>(url)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // Since we need to show error message for empty preview URL but not propagate it to parent, we need to maintain a separate state
    const [emptyPreviewURLErrorMessage, setEmptyPreviewURLErrorMessage] = useState<string>('')

    const handleEnableEditing = () => {
        setIsEditing(true)
    }

    const handleLastPreviewedURLChange = (newURL: string) => {
        setLastPreviewedURL(newURL)
    }

    const handleReset = (newURL?: string) => {
        handleLastPreviewedURLChange(newURL ?? lastPreviewedURL)
        handleURLChange(newURL ?? lastPreviewedURL)
        handleError('')
        setIsEditing(false)
        setIsLoading(false)
    }

    const handleSuccess = () => {
        handleReset(url)
    }

    const handleCancel = () => {
        handleReset()
    }

    const handleChange = (event: SyntheticEvent) => {
        const { value } = event.target as HTMLInputElement
        handleURLChange(value)
        if (!value.trim()) {
            handleError('')
            return
        }
        setEmptyPreviewURLErrorMessage('')
        handleError(validateURL(value, false).message)
    }

    const handlePreviewImage = async () => {
        if (!url) {
            // Not setting the error since can save without image
            setEmptyPreviewURLErrorMessage(EMPTY_PREVIEW_URL_ERROR_MESSAGE)
            toast.error(EMPTY_PREVIEW_URL_ERROR_MESSAGE)
            return
        }

        if (errorMessage) {
            toast.error(errorMessage)
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(url, { mode: 'cors' })
            if (!response.ok) {
                throw new Error('Invalid network response')
            }

            const blob = await response.blob()
            if (blob.size > DEFAULT_MAX_IMAGE_SIZE) {
                throw new Error(`Please add an image smaller than ${DEFAULT_MAX_IMAGE_SIZE} bytes`)
            }

            const src = URL.createObjectURL(blob)
            const imageValidation = await validateIfImageExist(src)
            URL.revokeObjectURL(src)

            if (!imageValidation.isValid) {
                throw new Error(imageValidation.message)
            }

            handleSuccess()
        } catch (error) {
            handleError(error.message || 'Failed to load image')
            showError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            await handlePreviewImage()
        }
    }

    const renderImage = (showEditIcon: boolean, rootClassName?: string) => (
        <ImageWithFallback
            imageProps={{
                alt: altText,
                src: lastPreviewedURL,
                height: DEFAULT_IMAGE_DIMENSIONS.height,
                width: DEFAULT_IMAGE_DIMENSIONS.width,
                className: `br-4 dc__no-shrink ${rootClassName || ''}`,
            }}
            fallbackImage={<FallbackImage defaultIcon={defaultIcon} showEditIcon={showEditIcon} />}
        />
    )

    if (!isEditing) {
        return (
            <button
                className="dc__no-background dc__no-border dc__outline-none-imp display-grid edit-image-form-field__figure-container p-0 icon-dim-72 dc__no-shrink"
                type="button"
                data-testid={`${dataTestIdPrefix}-button`}
                aria-label={`${ariaLabelPrefix} image`}
                onClick={handleEnableEditing}
            >
                {renderImage(true, 'base-image')}

                <div className="flex p-4 br-4 bcn-0 dc__border edit-image-icon dc__zi-1 bcn-0 dc__hover-n50 icon-dim-24">
                    <ICPencil className="dc__no-shrink icon-dim-16" />
                </div>
            </button>
        )
    }

    return (
        <div className="flexbox dc__gap-20">
            {renderImage(false)}

            <div className="flexbox-col dc__gap-16 flex-grow-1">
                <div className="flexbox-col dc__gap-6 w-100 dc__align-start">
                    <CustomInput
                        name={`${ariaLabelPrefix} url input`}
                        label="Image URL"
                        labelClassName="m-0 fs-13 fw-4 lh-20 cn-7"
                        placeholder="Enter image url"
                        value={url}
                        onChange={handleChange}
                        error={errorMessage || emptyPreviewURLErrorMessage}
                        inputWrapClassName="w-100"
                        dataTestid={`${dataTestIdPrefix}-input`}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>

                <div className="flexbox dc__gap-8">
                    <ButtonWithLoader
                        isLoading={isLoading}
                        rootClassName="cta h-28 flex"
                        type="button"
                        disabled={isLoading}
                        data-testid={`${dataTestIdPrefix}-preview`}
                        onClick={handlePreviewImage}
                    >
                        Preview
                    </ButtonWithLoader>

                    <button
                        className="cta cancel h-28 flex"
                        data-testid={`${dataTestIdPrefix}-cancel`}
                        type="button"
                        disabled={isLoading}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditImageFormField
