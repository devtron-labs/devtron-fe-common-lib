import { useState, useCallback } from 'react'
import { GenericEmptyState, stopPropagation, VisibleModal } from '@Common/index'
import { ComponentSizeType } from '@Shared/constants'
import ReactGA from 'react-ga4'
import { ReactComponent as Close } from '@Icons/ic-close.svg'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'

export const IframePromoButton = () => {
    const [showEmbeddedIframeModal, setEmbeddedIframeModal] = useState(false)

    const {
        FEATURE_PROMO_EMBEDDED_BUTTON_TEXT,
        FEATURE_PROMO_EMBEDDED_MODAL_TITLE,
        FEATURE_PROMO_EMBEDDED_IFRAME_URL,
    } = window._env_

    const onClickShowIframeModal = useCallback(() => {
        setEmbeddedIframeModal(true)
        ReactGA.event({
            category: 'PRIMARY_HEADER',
            action: 'HEADER_IFRAME_BUTTON_CLICKED',
        })
    }, [])
    const onClickCloseIframeModal = useCallback(() => setEmbeddedIframeModal(false), [])

    const renderIframeDrawer = () => (
        <VisibleModal close={onClickCloseIframeModal}>
            <div
                className="modal-body--ci-material h-100 dc__overflow-hidden dc__border-left flex column dc__content-space w-100"
                // NOTE: needed to prevent closing of modal on body click; clicking outside this div
                // will close the modal (outside click handled)
                onClick={stopPropagation}
            >
                <div className="trigger-modal__header w-100">
                    <h1 className="modal__title flex left fs-16 fw-6-imp" data-testid="app-details-url-heading">
                        {FEATURE_PROMO_EMBEDDED_MODAL_TITLE || FEATURE_PROMO_EMBEDDED_BUTTON_TEXT}
                    </h1>
                    <Button
                        ariaLabel="promo-header-button"
                        dataTestId="iframe-modal-close-button"
                        size={ComponentSizeType.small}
                        onClick={onClickCloseIframeModal}
                        style={ButtonStyleType.negativeGrey}
                        variant={ButtonVariantType.borderLess}
                        icon={<Close />}
                        showAriaLabelInTippy={false}
                    />
                </div>
                {FEATURE_PROMO_EMBEDDED_IFRAME_URL ? (
                    <iframe
                        title={FEATURE_PROMO_EMBEDDED_MODAL_TITLE || FEATURE_PROMO_EMBEDDED_BUTTON_TEXT}
                        src={FEATURE_PROMO_EMBEDDED_IFRAME_URL}
                        width="100%"
                        height="100%"
                        className="dc__no-border"
                        // NOTE: allow-forms is required to enable submitting the form
                        sandbox="allow-same-origin allow-scripts allow-forms"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="flex h-100">
                        <GenericEmptyState
                            title="Nothing to show"
                            subTitle="An iframe appears here in a parallel universe"
                        />
                    </div>
                )}
            </div>
        </VisibleModal>
    )

    return (
        <div>
            {FEATURE_PROMO_EMBEDDED_BUTTON_TEXT && (
                <Button
                    dataTestId="iframe-header-button"
                    size={ComponentSizeType.small}
                    onClick={onClickShowIframeModal}
                    text={FEATURE_PROMO_EMBEDDED_BUTTON_TEXT}
                    variant={ButtonVariantType.secondary}
                />
            )}
            {showEmbeddedIframeModal && renderIframeDrawer()}
        </div>
    )
}
