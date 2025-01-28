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

import { SegmentedBarChart } from '@Common/SegmentedBarChart'
import { ReactComponent as ICShieldWarning } from '@Icons/ic-shield-warning-outline.svg'
import { ReactComponent as ICShieldSecure } from '@Icons/ic-shield-check.svg'
import { ReactComponent as ICError } from '@Icons/ic-error-exclamation.svg'
import { ReactComponent as ICArrowRight } from '@Icons/ic-caret-down-small.svg'
import { SecurityCardProps } from './types'
import { SUB_CATEGORIES } from '../SecurityModal/types'
import { SEVERITIES } from '../SecurityModal/constants'
import './securityCard.scss'
import { getTotalSeverities } from '../utils'
import { SECURITY_CONFIG } from '../constants'

const SecurityCard = ({
    category,
    subCategory,
    severities = {},
    handleCardClick,
    scanFailed = false,
}: SecurityCardProps) => {
    const totalCount = getTotalSeverities(severities)

    const hasThreats: boolean = !!totalCount

    const entities = Object.entries(SEVERITIES)
        .map(([key, severity]) => ({
            ...severity,
            value: severities[key],
        }))
        .filter((entity) => !!entity.value)

    const getInfoIcon = () => {
        if (scanFailed) {
            return <ICError className="icon-dim-24 dc__no-shrink" />
        }
        return hasThreats ? (
            <ICShieldWarning className="icon-dim-24 scr-5 dc__no-shrink" />
        ) : (
            <ICShieldSecure className="icon-dim-24 scg-5 dc__no-shrink" />
        )
    }

    const getTitleSubtitle = (): { title: string; subtitle?: string } => {
        if (scanFailed) {
            return subCategory === SUB_CATEGORIES.VULNERABILITIES
                ? { title: 'Vulnerability scan failed', subtitle: 'Failed' }
                : { title: 'License scan failed', subtitle: 'Failed' }
        }
        switch (subCategory) {
            case SUB_CATEGORIES.EXPOSED_SECRETS:
                return hasThreats
                    ? { title: `${totalCount} exposed secrets` }
                    : {
                          title: 'No exposed secrets',
                          subtitle: 'No exposed secrets like passwords, api keys, and tokens found',
                      }
            case SUB_CATEGORIES.LICENSE:
                return hasThreats
                    ? { title: `${totalCount} license risks` }
                    : { title: 'No license risks', subtitle: 'No license risks or compliance issues found' }
            case SUB_CATEGORIES.MISCONFIGURATIONS:
                return hasThreats
                    ? { title: `${totalCount} misconfigurations` }
                    : { title: 'No misconfiguration', subtitle: 'No configuration issues detected in scanned files' }
            default:
                return hasThreats
                    ? { title: `${totalCount} vulnerabilities` }
                    : { title: 'No vulnerabilities', subtitle: 'No vulnerabilities or potential threats found' }
        }
    }

    const { title, subtitle } = getTitleSubtitle()

    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleCardClick()
        }
    }

    return (
        <div
            className={`w-100 p-20 flexbox-col dc__gap-16 br-8 dc__border security-card security-card${hasThreats || scanFailed ? '--threat' : '--secure'}`}
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onKeyDown={onKeyDown}
        >
            <div className="flexbox dc__content-space">
                <div className="flexbox-col">
                    <span className="fs-12 fw-4 lh-1-5 cn-7">{SECURITY_CONFIG[category].label}</span>
                    <div className="fs-15 fw-6 lh-1-5 cn-9 flex">
                        <span className="security-card-title">{title}</span>
                        <ICArrowRight className="icon-dim-20 dc__flip-270 scb-5 arrow-right" />
                    </div>
                </div>
                {getInfoIcon()}
            </div>
            <div className="flexbox-col dc__gap-12">
                {scanFailed || !(hasThreats || severities.success) ? (
                    <div className="bcn-1 br-4 h-8" />
                ) : (
                    <SegmentedBarChart
                        entities={entities}
                        labelClassName="fs-13 fw-4 lh-20 cn-9"
                        countClassName="fs-13 fw-6 lh-20 cn-7"
                        swapLegendAndBar
                    />
                )}
                {subtitle && <span className="cn-9 fs-13 lh-20">{subtitle}</span>}
            </div>
        </div>
    )
}

export default SecurityCard
