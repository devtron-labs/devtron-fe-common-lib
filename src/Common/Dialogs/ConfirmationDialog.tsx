import React from 'react'
import { VisibleModal2 } from '../Modals/VisibleModal2'
import {
    ConfirmationDialogBodyType,
    ConfirmationDialogButtonGroupType,
    ConfirmationDialogIconType,
    ConfirmationDialogType,
} from './Types'

const ConfirmationDialog = ({ className = '', children }: ConfirmationDialogType) => (
    <VisibleModal2 className="confirmation-dialog">
        <div className={`confirmation-dialog__body ${className}`}>{children}</div>
    </VisibleModal2>
)

const Icon = ({ src, className = '' }: ConfirmationDialogIconType) => (
    <img src={src} className={`confirmation-dialog__icon ${className}`} alt="" />
)

const Body = ({ title, subtitle = null, children = null }: ConfirmationDialogBodyType) => (
    <div className="flex left column ">
        <h3 className="confirmation-dialog__title lh-1-5 dc__break-word w-100">{title}</h3>
        {subtitle && <div className="confirmation-dialog__subtitle">{subtitle}</div>}
        {children}
    </div>
)

const ButtonGroup = ({ children }: ConfirmationDialogButtonGroupType) => (
    <div className="flex right confirmation-dialog__button-group">{children}</div>
)

ConfirmationDialog.Icon = Icon
ConfirmationDialog.Body = Body
ConfirmationDialog.ButtonGroup = ButtonGroup
export default ConfirmationDialog
