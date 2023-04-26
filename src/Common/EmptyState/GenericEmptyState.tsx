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
    noImage
}: GenericEmptyStateType): JSX.Element {
    return (
        <div
            className={`flex column empty-state dc__align-reload-center ${classname ? classname : ''}`}
            style={styles}
            data-testid="generic-empty-state"
            {...(heightToDeduct >= 0 && { style: { ...styles, height: `calc(100vh - ${heightToDeduct}px)` } })}
        >
            {!noImage && <img className={imageClassName ? imageClassName : ''}
                src={image || AppNotDeployed}
                width={imageType === ImageType.Medium ? '200' : '250'}
                height={imageType === ImageType.Medium ? '160' : '200'}
                alt="empty-state"
            />}
            <h4 className="title fw-6 cn-9 mb-8">{title}</h4>
            {subTitle && <p className="subtitle">{subTitle}</p>}
            {isButtonAvailable && renderButton()}
              {children}
        </div>
    )
}

export default GenericEmptyState