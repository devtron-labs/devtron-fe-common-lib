import { cloneElement } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as ICCaretSmall } from '@Icons/ic-caret-left-small.svg'
import { GenericInfoCardProps } from './types'
import { getClassNameForBorderVariant } from './utils'
import './styles.scss'

const GenericInfoCard = ({
    title,
    description,
    author,
    isLoading,
    borderVariant,
    Icon,
    onClick,
    linkProps,
}: GenericInfoCardProps) => {
    const IconElement = isLoading ? <div className="shimmer" /> : Icon

    const renderShimmerContent = () => (
        <>
            <div className="icon-dim-40 dc__no-shrink br-6">
                <div className="shimmer shimmer__fill-dimensions" />
            </div>

            <div className="flexbox-col dc__gap-8 flex-grow-1">
                <div className="flexbox-col dc__gap-4">
                    <span className={isLoading ? 'shimmer w-300' : ''} />
                    <span className={isLoading ? 'shimmer w-150 pt-2' : ''} />
                </div>

                <span className={isLoading ? 'shimmer w-600' : ''} />
            </div>
        </>
    )

    const renderContent = () => (
        <div
            className={`flexbox dc__gap-16 p-12 bg__primary generic-info-card br-8 ${getClassNameForBorderVariant(borderVariant)}`}
        >
            {isLoading ? (
                renderShimmerContent()
            ) : (
                <>
                    {cloneElement(IconElement, {
                        className: `${IconElement.props?.className ?? ''} icon-dim-40 dc__no-shrink br-6`,
                    })}

                    <div className="flexbox-col dc__gap-8 flex-grow-1">
                        <div className="flexbox-col">
                            <div className="flexbox dc__align-items-center">
                                <h3 className="fw-6 fs-13 lh-20 cn-9 m-0 generic-info-card__title">{title}</h3>

                                {/* TODO: animation not working on hover */}
                                <div className="generic-info-card__arrow dc__no-shrink">
                                    <ICCaretSmall className="icon-dim-16 dc__flip-180 scb-5" />
                                </div>
                            </div>

                            <h4 className="fw-4 fs-12 lh-16 cn-7 m-0">By {author}</h4>
                        </div>

                        <p className="fw-4 fs-12 lh-16 cn-7 m-0">{description}</p>
                    </div>
                </>
            )}
        </div>
    )

    if (!linkProps && !onClick) {
        return renderContent()
    }

    if (linkProps) {
        return <Link {...linkProps}>{renderContent()}</Link>
    }

    return (
        <button type="button" onClick={onClick} className="dc__unset-button-styles dc__align-unset">
            {renderContent()}
        </button>
    )
}

export default GenericInfoCard
