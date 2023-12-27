import React from 'react'
import AppNotDeployed from '../../Assets/Img/app-not-deployed.png'
import { GenericEmptyStateType, ImageType } from '../Types'

import './emptyState.scss'

function GenericEmptyState({
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
}: GenericEmptyStateType): JSX.Element {
    const isRowLayout = layout === 'row'

    const getImageSize = () => {
        switch (imageType) {
            case ImageType.Medium:
                return { width: '200', height: '160' }
            case ImageType.Large:
                return { width: '250', height: '200' }
            default:
                return { width: '200', height: '160' }
        }
    }

    return (
        <div
            className={`flex ${isRowLayout ? 'dc__gap-32' : 'column dc__gap-20'} empty-state ${
                classname ? classname : ''
            }`}
            style={styles}
            data-testid="generic-empty-state"
            {...(heightToDeduct >= 0 && { style: { ...styles, height: `calc(100vh - ${heightToDeduct}px)` } })}
        >
            {!SvgImage ? (
                !noImage && (
                    <img
                        className={imageClassName ? imageClassName : ''}
                        src={image || AppNotDeployed}
                        width={getImageSize().width}
                        height={getImageSize().height}
                        alt="empty-state"
                    />
                )
            ) : (
                <SvgImage style={{ width: `${getImageSize().width}px`, height: `${getImageSize().height}px` }} />
            )}
            <div
                className={`flex column dc__gap-10 dc__mxw-300 ${
                    isRowLayout ? 'dc__align-start' : ''
                } ${contentClassName}`}
            >
                <h4 className="title fw-6 cn-9 mt-0 mb-0">{title}</h4>
                {subTitle && <p className={`subtitle ${isRowLayout ? 'subtitle--text-start' : ''}`}>{subTitle}</p>}
                {isButtonAvailable && renderButton()}
                {children}
            </div>
        </div>
    )
}

export default GenericEmptyState
