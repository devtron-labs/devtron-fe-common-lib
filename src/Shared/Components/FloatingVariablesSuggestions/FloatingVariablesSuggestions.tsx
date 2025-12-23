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

import React, { memo, useCallback, useState } from 'react'
import Tippy from '@tippyjs/react'

import { ReactComponent as ICDrag } from '@Icons/ic-drag.svg'
import { DraggablePositionVariant, DraggableWrapper } from '@Common/DraggableWrapper'
import { useAsync } from '@Common/Helper'
import { ALLOW_ACTION_OUTSIDE_FOCUS_TRAP } from '@Shared/constants'

import { Icon } from '../Icon'
import { DRAG_SELECTOR } from './constants'
import { getScopedVariables } from './service'
import Suggestions from './Suggestions'
import { FloatingVariablesSuggestionsProps } from './types'

/**
 * Component uses react-draggable and handles the re-sizing and positioning of the suggestions on the assumption that the suggestions are going to expand to the right and bottom of the collapsed state
 * @param zIndex - To Set the zIndex of the suggestions
 * @param appId -  To fetch the scoped variables
 * @param envId - (Optional)
 * @param clusterId - (Optional)
 * @param hideObjectVariables - (Optional) To hide the object/array variables, default is true
 * @returns
 */
const FloatingVariablesSuggestions = ({
    appId,
    envId,
    clusterId,
    hideObjectVariables = true,
    showValueOnHover = true,
    isTemplateView,
    boundaryGap,
}: FloatingVariablesSuggestionsProps) => {
    const [isActive, setIsActive] = useState<boolean>(false)

    const [loadingScopedVariables, variablesData, error, reloadScopedVariables] = useAsync(
        () => getScopedVariables(appId, envId, clusterId, { hideObjectVariables, isTemplateView }),
        [appId, envId, clusterId],
    )

    const handleActivation = () => {
        setIsActive(true)
    }

    // Need to memoize this function since it is passed as a prop to Suggestions
    const handleDeActivation = useCallback((e: React.MouseEvent<HTMLOrSVGElement>) => {
        e.stopPropagation()
        setIsActive(false)
    }, [])

    return (
        <>
            <div className={`${isActive ? 'dc__visibility-hidden dc__disable-click' : ''} `}>
                <DraggableWrapper
                    key="collapsed"
                    positionVariant={DraggablePositionVariant.SCREEN_BOTTOM_RIGHT}
                    dragSelector={`.${DRAG_SELECTOR}`}
                    boundaryGap={boundaryGap}
                    parentRef={null}
                >
                    <div
                        className="bcn-7 dc__outline-none-imp dc__border-n0 br-48 flex h-40 pt-8 pb-8 pl-12 pr-12 dc__gap-8 dc__no-shrink"
                        style={{ boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.20)' }}
                        data-testid="collapsed-state"
                    >
                        <button type="button" className="dc__outline-none-imp dc__no-border p-0 bcn-7 h-24">
                            <ICDrag className={`${DRAG_SELECTOR} dc__grabbable icon-dim-24 fcn-2`} />
                        </button>

                        <Tippy content="Scoped variables" placement="top" className="default-tt" arrow={false}>
                            <button
                                className={`dc__outline-none-imp dc__no-border p-0 bcn-7 h-20 ${ALLOW_ACTION_OUTSIDE_FOCUS_TRAP}`}
                                type="button"
                                onClick={handleActivation}
                                data-testid="activate-suggestions"
                                aria-label="Activate suggestions"
                            >
                                <Icon name="ic-view-variable-toggle" color="N0" size={20} />
                            </button>
                        </Tippy>
                    </div>
                </DraggableWrapper>
            </div>

            <div className={`${!isActive ? 'dc__visibility-hidden dc__disable-click' : ''}`}>
                <DraggableWrapper
                    key={`expanded-${loadingScopedVariables}`}
                    positionVariant={DraggablePositionVariant.SCREEN_BOTTOM_RIGHT}
                    dragSelector={`.${DRAG_SELECTOR}`}
                    boundaryGap={boundaryGap}
                    parentRef={null}
                >
                    <div
                        className={`flex column dc__no-shrink w-356 dc__content-space dc__border-radius-8-imp dc__border dc__overflow-hidden mxh-504 bg__overlay--primary ${ALLOW_ACTION_OUTSIDE_FOCUS_TRAP}`}
                        style={{
                            boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.25)',
                        }}
                    >
                        <Suggestions
                            handleDeActivation={handleDeActivation}
                            loading={loadingScopedVariables}
                            variables={variablesData ?? []}
                            reloadVariables={reloadScopedVariables}
                            error={error}
                            showValueOnHover={showValueOnHover}
                        />
                    </div>
                </DraggableWrapper>
            </div>
        </>
    )
}

// This would save API call if the props are same
export default memo(FloatingVariablesSuggestions)
