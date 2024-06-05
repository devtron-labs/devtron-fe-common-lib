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

import { ScannedObjectBarProps } from './types'
import './styles.scss'

const ScannedObjectBar = ({
    criticalVulnerabilitiesCount,
    moderateVulnerabilitiesCount,
    lowVulnerabilitiesCount,
    objectBarClassName,
    removeObjectCountMargin,
}: ScannedObjectBarProps) => {
    const totalVulnerabilitiesCount =
        criticalVulnerabilitiesCount + moderateVulnerabilitiesCount + lowVulnerabilitiesCount

    const renderScannedObject = (className: string, count: number) => (
        <div className={className} style={{ width: `${(100 * count) / totalVulnerabilitiesCount}%` }} />
    )

    const renderObjectCount = (count: number, title: string, objectIconClass: string) => (
        <p className={`scanned-object__counts ${removeObjectCountMargin ? 'm-0' : ''}`}>
            <span className={`scanned-object__icon ${objectIconClass}`} />
            {title}
            <span className="fw-6 ml-5 mr-20">{count}</span>
        </p>
    )

    return (
        <>
            <div className={`scanned-object__bar ${objectBarClassName || ''}`}>
                {renderScannedObject('scanned-object__critical-count', criticalVulnerabilitiesCount)}
                {renderScannedObject('scanned-object__moderate-count', moderateVulnerabilitiesCount)}
                {renderScannedObject('scanned-object__low-count', lowVulnerabilitiesCount)}
            </div>

            <div className="flexbox">
                {renderObjectCount(criticalVulnerabilitiesCount, 'Critical', 'scanned-object__critical-count')}
                {renderObjectCount(moderateVulnerabilitiesCount, 'Moderate', 'scanned-object__moderate-count')}
                {renderObjectCount(lowVulnerabilitiesCount, 'Low', 'scanned-object__low-count')}
            </div>
        </>
    )
}

export default ScannedObjectBar
