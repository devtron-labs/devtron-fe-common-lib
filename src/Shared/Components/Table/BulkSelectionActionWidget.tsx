/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { MouseEvent } from 'react'

import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { DraggableButton, DraggablePositionVariant, DraggableWrapper } from '@Common/DraggableWrapper'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonComponentType, ButtonStyleType, ButtonVariantType } from '../Button'
import { DRAG_SELECTOR_IDENTIFIER } from './constants'
import { BulkSelectionActionWidgetProps } from './types'

const BulkSelectionActionWidget = ({
    count,
    handleClearBulkSelection,
    parentRef,
    BulkActionsComponent,
    bulkActionsData,
    setBulkActionState,
}: BulkSelectionActionWidgetProps) => {
    const onActionClick = (event: MouseEvent<HTMLButtonElement>) => {
        const {
            dataset: { key },
        } = event.currentTarget
        setBulkActionState(key)
    }

    return (
        <DraggableWrapper
            dragSelector={`.${DRAG_SELECTOR_IDENTIFIER}`}
            positionVariant={DraggablePositionVariant.PARENT_BOTTOM_CENTER}
            zIndex="calc(var(--modal-index) - 1)"
            parentRef={parentRef}
        >
            <div className="dc__separated-flexbox dc__separated-flexbox--gap-8 p-12 bulk-selection-widget br-8">
                <div className="flexbox dc__gap-8">
                    <DraggableButton dragClassName={DRAG_SELECTOR_IDENTIFIER} />

                    <div className="fs-13 lh-20 fw-6 flex dc__gap-12">
                        <span className="flex dc__gap-2 bcb-5 text__white br-4 px-6">{count}</span>
                        <span className="cn-9">Selected</span>
                    </div>
                </div>

                <BulkActionsComponent onActionClick={onActionClick} bulkActionsData={bulkActionsData} />

                <Button
                    icon={<ICClose />}
                    dataTestId="table__action-widget--close"
                    component={ButtonComponentType.button}
                    style={ButtonStyleType.negativeGrey}
                    variant={ButtonVariantType.borderLess}
                    ariaLabel="Clear selection(s)"
                    size={ComponentSizeType.small}
                    onClick={handleClearBulkSelection}
                    showAriaLabelInTippy={false}
                />
            </div>
        </DraggableWrapper>
    )
}

export default BulkSelectionActionWidget
