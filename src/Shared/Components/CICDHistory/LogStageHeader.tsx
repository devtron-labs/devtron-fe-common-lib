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

import ICCaretDown from '@Icons/ic-caret-down.svg?react'
import ICStack from '@Icons/ic-stack.svg?react'
import { getTimeDifference } from '@Shared/Helpers'

import { TargetPlatformListTooltip } from '../TargetPlatforms'
import { LogStageHeaderProps } from './types'
import { getStageStatusIcon } from './utils'

const LogStageHeader = ({
    stage,
    isOpen,
    status,
    startTime,
    endTime,
    targetPlatforms,
    stageIndex,
    fullScreenView,
    handleStageClose,
    handleStageOpen,
    logsRendererRef,
    applySticky = true,
}: LogStageHeaderProps) => {
    const handleAccordionToggle = () => {
        if (isOpen) {
            handleStageClose(stageIndex)
        } else {
            handleStageOpen(stageIndex)
        }
    }

    const getFormattedTimeDifference = (): string => {
        const timeDifference = getTimeDifference({ startTime, endTime })
        if (timeDifference === '0s') {
            return '< 1s'
        }
        return timeDifference
    }

    const getLogsRendererReference = () => logsRendererRef.current

    return (
        <button
            className={`flexbox dc__transparent dc__content-space py-6 px-8 br-4 dc__align-items-center dc__select-text logs-renderer__stage-accordion w-100 ${
                isOpen ? 'logs-renderer__stage-accordion--open-stage' : ''
            } ${applySticky ? `dc__position-sticky dc__zi-1 ${fullScreenView ? 'dc__top-44' : 'dc__top-80'}` : ''}`}
            type="button"
            role="tab"
            onClick={handleAccordionToggle}
        >
            <div className="flexbox dc__gap-8 dc__transparent dc__align-items-center">
                <ICCaretDown
                    className={`icon-dim-16 dc__no-shrink dc__transition--transform icon-stroke__white ${!isOpen ? 'dc__flip-n90 dc__opacity-0_5' : ''}`}
                />

                <div className="flexbox dc__gap-12 dc__align-items-center">
                    {getStageStatusIcon(status)}

                    <h3 className="m-0 text__white fs-13 fw-4 lh-20 dc__word-break">{stage}</h3>
                </div>
            </div>

            <div className="flexbox dc__gap-8 dc__align-items-center">
                {!!targetPlatforms?.length && (
                    <>
                        <TargetPlatformListTooltip
                            targetPlatforms={targetPlatforms}
                            appendTo={getLogsRendererReference}
                        >
                            <div className="flexbox dc__gap-4 dc__align-items-center">
                                <ICStack className="dc__no-shrink icon-stroke__white icon-dim-12" />
                                <span className="text__white fs-13 fw-4 lh-20">
                                    {targetPlatforms.length}&nbsp;target platform
                                    {targetPlatforms.length > 1 ? 's' : ''}
                                </span>
                            </div>
                        </TargetPlatformListTooltip>

                        {!!endTime && <div className="dc__bullet--white dc__bullet" />}
                    </>
                )}

                {!!endTime && <span className="text__white fs-13 fw-4 lh-20">{getFormattedTimeDifference()}</span>}
            </div>
        </button>
    )
}

export default LogStageHeader
