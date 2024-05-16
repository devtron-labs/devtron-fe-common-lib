import { VisibleModal, noop } from '../../../Common'
import { BUTTON_TEXT, IMAGE_VARIANT } from './constant'
import { FeatureDescriptionModalProps } from './types'
import './featureDescription.scss'

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
        <div className="pl-20 pr-20 pt-16 pb-16">
            <div className="flex left w-100 fs-16 fw-6">{title}</div>
            <img
                src={image}
                className={`${imageVariant === IMAGE_VARIANT.SMALL ? 'small' : 'large'} mt-16 mb-12`}
                alt="feature-description"
            />
            {typeof renderDescriptionContent === 'function' && renderDescriptionContent()}
        </div>
    )

    const renderFooter = () => (
        <div
            className={`flex right w-100 dc__align-right pt-16 dc__border-top-n1 pb-16 pl-20 pr-20 ${docLink ? 'dc__content-space' : 'right'}`}
        >
            {docLink && (
                <button className="cta flex h-36" type="submit" onClick={noop}>
                    <a className="" href={docLink} target="_blank" rel="noreferrer">
                        {BUTTON_TEXT.VIEW_DOCUMENTATION}
                    </a>
                </button>
            )}
            <button className="cta flex h-36" type="submit" onClick={closeModal}>
                {closeModalText}
            </button>
        </div>
    )

    return (
        <VisibleModal className="">
            <div className="feature-description modal__body w-600 mt-40 flex column dc__gap-16 p-0 fs-13">
                {renderDescriptionBody()}
                {renderFooter()}
            </div>
        </VisibleModal>
    )
}
