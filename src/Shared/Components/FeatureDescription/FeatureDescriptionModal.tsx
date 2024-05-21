import { VisibleModal } from '../../../Common'
import { BUTTON_TEXT } from './constant'
import { FeatureDescriptionModalProps } from './types'
import './featureDescription.scss'
import { ReactComponent as ArrowOutSquare } from '../../../Assets/Icon/ic-arrow-square-out.svg'
import { getImageSize } from './utils'

export const FeatureDescriptionModal = ({
    image,
    title,
    renderDescriptionContent,
    closeModalText = BUTTON_TEXT.GOT_IT,
    docLink = '',
    closeModal,
    imageVariant,
    SVGImage,
    imageStyles = {},
}: FeatureDescriptionModalProps) => {
    const renderImage = () => {
        if (!image && !SVGImage) {
            return null
        }
        if (image) {
            return (
                <div className="} dc__overflow-auto">
                    <img
                        src={image}
                        style={{
                            ...imageStyles,
                            width: `${getImageSize(imageVariant).width}`,
                            height: `${getImageSize(imageVariant).height}`,
                        }}
                        className="image-class-name mt-16 mb-12"
                        alt="feature-description"
                    />
                    image
                </div>
            )
        }
        return (
            <div className="flexbox dc__align-center dc__justify-center mt-16 mb-12">
                <SVGImage
                    style={{
                        ...imageStyles,
                        width: `${getImageSize(imageVariant).width}`,
                        height: `${getImageSize(imageVariant).height}`,
                    }}
                />
            </div>
        )
    }
    const renderDescriptionBody = () => (
        <div className="pl-20 pr-20 pt-16 pb-16 dc__gap-16">
            <div className="flex left w-100 fs-16 fw-6">{title}</div>
            {renderImage()}
            {typeof renderDescriptionContent === 'function' && renderDescriptionContent()}
        </div>
    )

    const renderFooter = () => (
        <div
            className={`flex right w-100 dc__align-right pt-16 dc__border-top-n1 pb-16 pl-20 pr-20 pt-6 pb-6 ${docLink ? 'dc__content-space' : 'right'}`}
        >
            {docLink.length > 0 && (
                <a
                    className="flex dc__link en-2 bw-1 pl-8 pr-8 dc__gap-6 br-4 fw-6 lh-20 pt-6 pb-6 h-32"
                    href={docLink}
                    target="_blank"
                    rel="noreferrer"
                >
                    {BUTTON_TEXT.VIEW_DOCUMENTATION}
                    <ArrowOutSquare className="icon-dim-16 scb-5" />
                </a>
            )}
            <button className="cta flex small" type="submit" onClick={closeModal}>
                {closeModalText}
            </button>
        </div>
    )

    return (
        <VisibleModal className="" close={closeModal}>
            <div className="feature-description modal__body w-600 mt-40 flex column p-0 fs-13 dc__overflow-hidden">
                {renderDescriptionBody()}
                {renderFooter()}
            </div>
        </VisibleModal>
    )
}
