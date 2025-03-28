/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { DraggableButton, DraggablePositionVariant, DraggableWrapper } from '@Common/DraggableWrapper'
import { ComponentSizeType } from '@Shared/constants'
import { useRegisterShortcut } from '@Common/Hooks'
import { useEffect } from 'react'
import { BulkSelectionActionWidgetProps } from './types'
import { Button, ButtonComponentType, ButtonStyleType, ButtonVariantType } from '../Button'

const BulkSelectionActionWidget = ({
    count,
    handleClearBulkSelection,
    parentRef,
    BulkActionsComponent,
}: BulkSelectionActionWidgetProps) => {
    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    useEffect(() => {
        registerShortcut({ keys: ['Escape'], callback: handleClearBulkSelection })

        return () => {
            unregisterShortcut(['Escape'])
        }
    }, [])

    return (
        <DraggableWrapper
            dragSelector=".drag-selector"
            positionVariant={DraggablePositionVariant.PARENT_BOTTOM_CENTER}
            zIndex="calc(var(--modal-index) - 1)"
            parentRef={parentRef}
        >
            <div className="dc__separated-flexbox dc__separated-flexbox--gap-8 pt-12 pb-12 pr-12 pl-12 bulk-selection-widget br-8">
                <div className="flexbox dc__gap-8">
                    <DraggableButton dragClassName="drag-selector" />

                    <div className="fs-13 lh-20 fw-6 flex dc__gap-12">
                        <span className="flex dc__gap-2 bcb-5 cn-0 br-4 pr-6 pl-6">{count}</span>
                        <span className="cn-9">Selected</span>
                    </div>
                </div>

                <BulkActionsComponent />

                <Button
                    icon={<ICClose />}
                    dataTestId="table__action-widget--close"
                    component={ButtonComponentType.button}
                    style={ButtonStyleType.negativeGrey}
                    variant={ButtonVariantType.borderLess}
                    ariaLabel="Clear selection(s)"
                    size={ComponentSizeType.small}
                    onClick={handleClearBulkSelection}
                    showAriaLabelInTippy
                />
            </div>
        </DraggableWrapper>
    )
}

export default BulkSelectionActionWidget
