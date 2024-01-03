import React from 'react'
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
}: GenericEmptyStateType): JSX.Element => {
    const isRowLayout = layout === 'row'

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
                        width={imageType === ImageType.Medium ? '200' : '250'}
                        height={imageType === ImageType.Medium ? '160' : '200'}
                        alt="empty-state"
                    />
                )
            ) : (
                <SvgImage />
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
