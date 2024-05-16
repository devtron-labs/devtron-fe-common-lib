import { VisibleModal } from '../../../Common'
import { BUTTON_TEXT, IMAGE_VARIANT } from './constant'
import { FeatureDescriptionModalProps } from './types'
import './featureDescription.scss'
import { ReactComponent as ArrowOutSquare } from '../../../Assets/Icon/ic-arrow-square-out.svg'

export const FeatureDescriptionModal = ({
    image,
    title,
    renderDescriptionContent,
    closeModalText = BUTTON_TEXT.GOT_IT,
    docLink = '',
    closeModal,
    imageVariant,
}: FeatureDescriptionModalProps) => {
    const renderDescriptionBody = () => (
        <div className="pl-20 pr-20 pt-16 pb-16 dc__gap-16">
            <div className="flex left w-100 fs-16 fw-6">{title}</div>
            <div className={`${imageVariant === IMAGE_VARIANT.SMALL ? 'mxh-350' : 'mxh-450'} dc__overflow-auto`}>
                <img
                    src={image}
                    className={`${imageVariant === IMAGE_VARIANT.SMALL ? 'small' : 'large'}  mt-16 mb-12`}
                    alt="feature-description"
                />
                {typeof renderDescriptionContent === 'function' && renderDescriptionContent()}
            </div>
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
        <VisibleModal className="">
            <div className="feature-description modal__body w-600 mt-40 flex column p-0 fs-13 dc__overflow-hidden">
                {renderDescriptionBody()}
                {renderFooter()}
            </div>
        </VisibleModal>
    )
}
