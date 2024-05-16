import { Breadcrumb } from '../../../Common/BreadCrumb/Types'
import { IMAGE_VARIANT } from './constant'

export interface FeatureDescriptionModalProps {
    image
    title: string
    renderDescriptionContent?: () => JSX.Element
    closeModalText?: string
    docLink?: string
    closeModal?: () => void
    imageVariant?: IMAGE_VARIANT
}

export interface DescriptorProps extends FeatureDescriptionModalProps {
    breadCrumbs: Breadcrumb[]
    additionalContainerClasses?: string
    iconClassName?: string
    children?: React.ReactNode
}
