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

import React from 'react'
import dayjs from 'dayjs'

import { ReactComponent as ICClock } from '@Icons/ic-clock.svg'
import { SegmentedBarChart } from '@Common/SegmentedBarChart'
import { ScannedByToolModal } from '@Shared/Components/ScannedByToolModal'

import { DATE_TIME_FORMATS, ZERO_TIME_STRING } from '../../../../../Common/Constants'
import { InfoCardPropsType } from '../types'

const InfoCard: React.FC<InfoCardPropsType> = ({ entities, lastScanTimeString, scanToolName, scanToolUrl }) => (
    <div className="info-card">
        <SegmentedBarChart entities={entities} rootClassName="p-16 fs-13" countClassName="fw-6" showAnimationOnBar />

        {(lastScanTimeString || scanToolName) && (
            <>
                <div className="dc__border-bottom-n1 w-100 h-1" />

                <div className="w-100 flexbox dc__content-space pl-16 pr-16 pb-8 pt-8">
                    {lastScanTimeString && lastScanTimeString !== ZERO_TIME_STRING && (
                        <div className="flexbox dc__gap-4 dc__align-items-center">
                            <ICClock className="icon-dim-16" />
                            <span
                                className="fs-12 lh-20 fw-4 fcn-8"
                                data-testid="security-info-card-last-scan-time"
                            >{`Scanned on ${dayjs(lastScanTimeString).format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT)}`}</span>
                        </div>
                    )}
                    {scanToolName && (
                        <ScannedByToolModal
                            scanToolName={scanToolName}
                            scanToolUrl={scanToolUrl}
                            fontSize={12}
                            spacingBetweenTextAndIcon={8}
                        />
                    )}
                </div>
            </>
        )}
    </div>
)

export default InfoCard
