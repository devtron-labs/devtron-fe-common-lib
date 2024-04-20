import AppNotDeployed from '../../Assets/Img/app-not-deployed.png'
import { GenericEmptyStateType, ImageType } from '../Types'

import './emptyState.scss'

const GenericEmptyState = ({
    title,
    image,
    subTitle,
    isButtonAvailable,
    classname,
    styles,
    heightToDeduct,
    imageType,
    renderButton,
    imageClassName,
    children,
    SvgImage,
    noImage,
    layout = 'column',
    contentClassName = '',
    imageStyles = {},
}: GenericEmptyStateType): JSX.Element => {
    const isRowLayout = layout === 'row'

    const getImageSize = () => {
        switch (imageType) {
            case ImageType.Large:
                return { width: '250px', height: '200px' }
            default:
                return { width: '200px', height: '160px' }
        }
    }

    return (
        <div
            className={`flex ${isRowLayout ? 'dc__gap-32' : 'column dc__gap-20'} empty-state ${classname || ''}`}
            style={styles}
            data-testid="generic-empty-state"
            {...(heightToDeduct >= 0 && { style: { ...styles, height: `calc(100vh - ${heightToDeduct}px)` } })}
        >
            {!SvgImage ? (
                !noImage && (
                    <img
                        className={imageClassName || ''}
                        src={image || AppNotDeployed}
                        style={{
                            ...imageStyles,
                            width: `${getImageSize().width}`,
                            height: `${getImageSize().height}`,
                        }}
                        alt="empty-state"
                    />
                )
            ) : (
                <SvgImage
                    style={{
                        ...imageStyles,
                        width: `${getImageSize().width}`,
                        height: `${getImageSize().height}`,
                    }}
                />
            )}
            <div
                className={`flex column dc__gap-20 dc__mxw-300 ${
                    isRowLayout ? 'dc__align-start' : ''
                } ${contentClassName}`}
            >
                <div className="flex column dc__gap-8">
                    <h4 className="title fw-6 cn-9 mt-0 mb-0 lh-24">{title}</h4>
                    {subTitle && (
                        <p className={`subtitle ${isRowLayout ? 'subtitle--text-start' : ''}`}>
                            {subTitle}
                        </p>
                    )}
                </div>
                {isButtonAvailable && renderButton()}
                {children}
            </div>
        </div>
    )
}

export default GenericEmptyState
