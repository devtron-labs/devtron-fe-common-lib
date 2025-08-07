/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
