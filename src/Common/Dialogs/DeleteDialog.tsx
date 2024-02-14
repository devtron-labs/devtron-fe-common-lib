import React from 'react'
import warn from '../../Assets/Img/delete-medium.svg'
import { Progressing } from '../Progressing'
import ConfirmationDialog from './ConfirmationDialog'
import { DeleteDialogProps } from './Types'

export const DeleteDialog: React.FC<DeleteDialogProps> & { Description?: React.FC<any> } = (props) => {
    const handleDelete = (e: React.MouseEvent) => {
        if (props.shouldStopPropagation) {
            e.stopPropagation()
        }

        props.delete()
    }

    const handleModalClose = (e: React.MouseEvent) => {
        if (props.shouldStopPropagation) {
            e.stopPropagation()
        }

        props.closeDelete()
    }

    return (
        <ConfirmationDialog className="confirmation-dialog__body--w-400">
            <ConfirmationDialog.Icon src={warn} />
            <ConfirmationDialog.Body title={props.title}>
                <div className="fs-13 cn-7 lh-1-54 w-100">
                    {props.description ? props.description : null}
                    {props.children}
                </div>
            </ConfirmationDialog.Body>
            <ConfirmationDialog.ButtonGroup>
                <div className="flex right">
                    <button
                        type="button"
                        className="cta cancel cta-cd-delete-modal ml-16"
                        onClick={handleModalClose}
                        disabled={props.apiCallInProgress}
                        data-testid="dialog-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="cta delete cta-cd-delete-modal ml-16"
                        onClick={handleDelete}
                        disabled={props.apiCallInProgress || props.disabled}
                        data-testid="dialog-delete"
                    >
                        {props.apiCallInProgress ? (
                            <Progressing />
                        ) : (
                            `${props.deletePrefix || ''}${
                                props.buttonPrimaryText ? props.buttonPrimaryText : 'Delete'
                            }${props.deletePostfix || ''}`
                        )}
                    </button>
                </div>
            </ConfirmationDialog.ButtonGroup>
        </ConfirmationDialog>
    )
}

const DeleteDialogDescription = (props) => <>{props.children}</>

DeleteDialog.Description = DeleteDialogDescription
