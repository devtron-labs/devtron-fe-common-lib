import { useState } from 'react'
import Tippy from '@tippyjs/react'
import { IframeElementProps } from './types'
import { stopPropagation, VisibleModal } from '../../../Common'
import { ReactComponent as ICFullScreen } from '../../../Assets/Icon/ic-fullscreen-2.svg'
import { ReactComponent as ICClose } from '../../../Assets/Icon/ic-close.svg'
import './IframeElement.scss'
import { GenericSectionErrorState } from '../GenericSectionErrorState'

const IframeElement = ({ URL, width, height, title, maxHeight, maxWidth }: IframeElementProps) => {
    const [showFullScreen, setShowFullScreen] = useState<boolean>(false)
    const [hasError, setHasError] = useState<boolean>(false)

    const handleEnterFullScreen = () => {
        setShowFullScreen(true)
    }

    const handleExitFullScreen = () => {
        setShowFullScreen(false)
    }

    const handleError = () => {
        setHasError(true)
    }

    if (hasError) {
        return <GenericSectionErrorState description="Please try again later" />
    }

    return (
        <>
            <div className="flexbox-col dc__gap-4">
                <div className="flexbox dc__content-space dc__gap-4">
                    <h3 className="m-0 fs-12 cn-7 fw-6 dc__truncate">{title}</h3>

                    <Tippy content="Enter Full Screen" className="default-tt" arrow={false}>
                        <button
                            type="button"
                            className="p-0 flex dc__no-border dc__no-background dc__outline-none-imp dc__tab-focus icon-dim-18 dc__tab-focus"
                            onClick={handleEnterFullScreen}
                            aria-label="Enter Full Screen"
                        >
                            <ICFullScreen className="dc__no-shrink icon-dim-18" />
                        </button>
                    </Tippy>
                </div>

                {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                <iframe
                    src={URL}
                    width={Math.min(maxWidth, width)}
                    height={Math.min(maxHeight, height)}
                    className="dc__no-border"
                    onError={handleError}
                    sandbox="allow-same-origin allow-scripts"
                    referrerPolicy="no-referrer"
                />
            </div>

            {showFullScreen && (
                <VisibleModal className="" close={handleExitFullScreen}>
                    <div
                        className="dc__overflow-scroll br-8 dc__position-rel bcn-0 custom-panel--iframe-element flexbox-col dc__content-space"
                        onClick={stopPropagation}
                    >
                        <div className="flexbox dc__align-items-center dc__content-space dc__border-bottom py-20 px-16">
                            <h3 className="m-0 cn-9 fs-16 fw-6 lh-24 dc__truncate">{title}</h3>
                            <button
                                type="button"
                                className="p-0 flex dc__no-border dc__no-background dc__outline-none-imp dc__tab-focus icon-dim-18 dc__tab-focus"
                                onClick={handleExitFullScreen}
                                aria-label="Close"
                            >
                                <ICClose className="dc__no-shrink icon-dim-18 fcn-6" />
                            </button>
                        </div>
                        <div className="flex px-16 py-8 h-100">
                            {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                            <iframe
                                src={URL}
                                width="100%"
                                height="100%"
                                className="dc__no-border"
                                sandbox="allow-same-origin allow-scripts"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>
                </VisibleModal>
            )}
        </>
    )
}

export default IframeElement
