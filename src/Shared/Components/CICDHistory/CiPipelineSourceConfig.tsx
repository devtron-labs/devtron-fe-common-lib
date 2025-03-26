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

import { useState, useEffect, ReactNode } from 'react'
import { ReactComponent as Info } from '@Icons/ic-info-outlined.svg'
import { getBranchIcon, getWebhookEventsForEventId, SourceTypeMap, Tooltip } from '../../../Common'
import { GIT_BRANCH_NOT_CONFIGURED, DEFAULT_GIT_BRANCH_VALUE } from './constants'
import { buildHoverHtmlForWebhook } from './utils'
import { CIPipelineSourceConfigInterface } from './types'
import { Icon } from '../Icon'

export const CiPipelineSourceConfig = ({
    sourceType,
    sourceValue,
    showTooltip,
    showIcons = true,
    baseText = undefined,
    regex,
    isRegex,
    primaryBranchAfterRegex,
    rootClassName = '',
}: CIPipelineSourceConfigInterface) => {
    const _isWebhook = sourceType === SourceTypeMap.WEBHOOK
    const _isRegex = sourceType === SourceTypeMap.BranchRegex || !!regex || isRegex

    const [sourceValueBase, setSourceValueBase] = useState('')
    const [sourceValueAdv, setSourceValueAdv] = useState<ReactNode>('')
    const [loading, setLoading] = useState(!!_isWebhook)
    const [hasError, setHasError] = useState(false)

    const updateSourceValue = () => {
        if (_isWebhook) {
            setLoading(true)
            setHasError(false)
            const _sourceValueObj = JSON.parse(sourceValue)
            getWebhookEventsForEventId(_sourceValueObj.eventId)
                .then((_res) => {
                    const _webhookEvent = _res.result
                    setSourceValueBase(_webhookEvent.name)
                    setSourceValueAdv(
                        buildHoverHtmlForWebhook(
                            _webhookEvent.name,
                            _sourceValueObj.condition,
                            _webhookEvent.selectors,
                        ),
                    )
                    setLoading(false)
                })
                .catch(() => {
                    setLoading(false)
                    setHasError(true)
                })
        } else {
            setSourceValueBase(sourceValue)
            setSourceValueAdv(sourceValue)
        }
    }

    useEffect(() => {
        updateSourceValue()
    }, [sourceValue])

    // tippy content for regex type
    const renderRegexSourceVal = (): JSX.Element => (
        <>
            <>
                <div className="fw-6">Regex</div>
                <p>{regex}</p>
            </>

            {window.location.href.includes('trigger') && (
                <>
                    <div className="fw-6">Primary Branch</div>
                    <p>{primaryBranchAfterRegex || 'Not set'}</p>
                </>
            )}
        </>
    )
    // for non webhook case, data is already set in use state initialization
    function _init() {
        if (!_isWebhook) {
            return
        }

        setLoading(true)
        setHasError(false)
        const _sourceValueObj = JSON.parse(sourceValue)
        const _eventId = _sourceValueObj.eventId
        const _condition = _sourceValueObj.condition

        getWebhookEventsForEventId(_eventId)
            .then((_res) => {
                const _webhookEvent = _res.result
                setSourceValueBase(_webhookEvent.name)
                setSourceValueAdv(buildHoverHtmlForWebhook(_webhookEvent.name, _condition, _webhookEvent.selectors))
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
                setHasError(true)
            })
    }

    function regexTippyContent() {
        if (!_isRegex) {
            return
        }
        setSourceValueAdv(renderRegexSourceVal())
    }

    useEffect(() => {
        _init()
        regexTippyContent()
    }, [])

    if (!loading && hasError) {
        return (
            <div className="flex left dc__gap-4">
                <Icon name="ic-error" size={16} color={null} />
                <span className="dc__truncate fw-5 cr-5">Failed to fetch</span>
            </div>
        )
    }

    return (
        <div className={`flex left ${showTooltip ? 'fw-5' : ''}  ${rootClassName}`}>
            {loading && showIcons && <span className="dc__loading-dots">loading</span>}
            {!loading && (
                <div className="flexbox dc__gap-4 dc__align-start">
                    {showIcons && (
                        <span className="icon-dim-12 flex dc__no-shrink dc__fill-available-space mt-4">
                            {getBranchIcon(sourceType, _isRegex, sourceValueBase)}
                        </span>
                    )}
                    {showTooltip ? (
                        <Tooltip
                            wordBreak
                            alwaysShowTippyOnHover
                            arrow={false}
                            placement="bottom"
                            content={sourceValueAdv}
                        >
                            <div
                                className="flex left dc__gap-4"
                                style={{ maxWidth: !baseText ? 'calc(100% - 15px)' : 'auto' }}
                            >
                                {!baseText && (
                                    <>
                                        <div
                                            className={`dc__ellipsis-right ${
                                                sourceValue === GIT_BRANCH_NOT_CONFIGURED ? 'cr-5' : ''
                                            }`}
                                        >
                                            {sourceValueBase}
                                        </div>
                                        {sourceValue !== DEFAULT_GIT_BRANCH_VALUE && (
                                            <Info className="icon-dim-12 fcn-5" />
                                        )}
                                    </>
                                )}
                                {baseText && (
                                    <span className="dc__border-dashed--n3-bottom fw-6 fs-13 lh-19-imp">
                                        {baseText}
                                    </span>
                                )}
                            </div>
                        </Tooltip>
                    ) : (
                        <span className="dc__ellipsis-right">{sourceValueAdv}</span>
                    )}
                </div>
            )}
        </div>
    )
}
