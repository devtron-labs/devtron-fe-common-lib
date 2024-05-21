import { ImageType } from '../../../Common'
import { Breadcrumb } from '../../../Common/BreadCrumb/Types'

export interface FeatureDescriptionModalProps {
    image?
    title: string
    renderDescriptionContent?: () => JSX.Element
    closeModalText?: string
    docLink?: string
    closeModal?: () => void
    imageVariant?: ImageType
    SVGImage?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    imageStyles?: React.CSSProperties
}

export interface DescriptorProps extends FeatureDescriptionModalProps {
    breadCrumbs: Breadcrumb[]
    additionalContainerClasses?: string
    iconClassName?: string
    children?: React.ReactNode
}
