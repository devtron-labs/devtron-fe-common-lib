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

/* eslint-disable eqeqeq */
import { useState } from 'react'
import moment from 'moment'
import Tippy from '@tippyjs/react'
import ClipboardButton from '@Common/ClipboardButton/ClipboardButton'
import { ReactComponent as Circle } from '@Icons/ic-circle.svg'
import { ReactComponent as Commit } from '@Icons/ic-commit.svg'
import { ReactComponent as PersonIcon } from '@Icons/ic-person.svg'
import { ReactComponent as CalendarIcon } from '@Icons/ic-calendar.svg'
import { ReactComponent as MessageIcon } from '@Icons/ic-message.svg'
import { ReactComponent as PullRequestIcon } from '@Icons/ic-pull-request.svg'
import { ReactComponent as Check } from '@Icons/ic-check-circle.svg'
import { ReactComponent as Abort } from '@Icons/ic-abort.svg'
import { SourceTypeMap, createGitCommitUrl } from '@Common/Common.service'
import { stopPropagation } from '@Common/Helper'
import { DATE_TIME_FORMATS } from '@Common/Constants'
import { ReactComponent as Tag } from '@Icons/ic-tag.svg'
import GitMaterialInfoHeader from './GitMaterialInfoHeader'
import { MATERIAL_EXCLUDE_TIPPY_TEXT } from '../../constants'
import { WEBHOOK_EVENT_ACTION_TYPE } from './constants'
import { GitCommitInfoGenericProps } from './types'

const GitCommitInfoGeneric = ({
    materialSourceType,
    materialSourceValue,
    commitInfo,
    selectedCommitInfo,
    materialUrl,
    showMaterialInfoHeader,
    index,
    isExcluded = false,
}: GitCommitInfoGenericProps) => {
    const [showSeeMore, setShowSeeMore] = useState(true)

    function _lowerCaseObject(input): any {
        const _output = {}
        if (!input) {
            return _output
        }
        Object.keys(input).forEach((_key) => {
            const _modifiedKey = _key.toLowerCase()
            const _value = input[_key]
            if (_value && typeof _value === 'object') {
                _output[_modifiedKey] = _lowerCaseObject(_value)
            } else {
                _output[_modifiedKey] = _value
            }
        })
        return _output
    }

    const _lowerCaseCommitInfo = _lowerCaseObject(commitInfo)
    const _isWebhook =
        materialSourceType === SourceTypeMap.WEBHOOK ||
        (_lowerCaseCommitInfo && _lowerCaseCommitInfo.webhookdata && _lowerCaseCommitInfo.webhookdata.id !== 0)
    const _webhookData = _isWebhook ? _lowerCaseCommitInfo.webhookdata : {}
    // eslint-disable-next-line no-nested-ternary
    const _commitUrl = _isWebhook
        ? null
        : _lowerCaseCommitInfo.commiturl
          ? _lowerCaseCommitInfo.commiturl
          : createGitCommitUrl(materialUrl, _lowerCaseCommitInfo.commit)

    function renderBasicGitCommitInfoForWebhook() {
        let _date
        if (_webhookData.data.date) {
            const _moment = moment(_webhookData.data.date, 'YYYY-MM-DDTHH:mm:ssZ')
            _date = _moment.isValid() ? _moment.format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT) : _webhookData.data.date
        }
        return (
            <>
                {_webhookData.data.author ? (
                    <div className="material-history__text lh-20 flex left dc__gap-8">
                        <PersonIcon className="icon-dim-16" /> {_webhookData.data.author}
                    </div>
                ) : null}
                {_date ? (
                    <div className="material-history__text lh-20 flex left dc__gap-8">
                        <CalendarIcon className="icon-dim-16" />
                        <time className="cn-7 fs-12">{_date}</time>
                    </div>
                ) : null}
                {_webhookData.data.message ? (
                    <div className="material-history__text lh-20 flex left dc__gap-8 top material-history-text--padded">
                        <MessageIcon className="icon-dim-16 mw-16 mr-8 mt-2" />
                        {_webhookData.data.message}
                    </div>
                ) : null}
            </>
        )
    }

    function renderMoreDataForWebhook(_moreData) {
        return !showSeeMore ? (
            <div className="material-history__all-changes">
                <div className="material-history__body mt-4">
                    {Object.keys(_moreData).map((_key, idx) => {
                        let classes
                        if (idx % 2 == 0) {
                            classes = 'bcn-1'
                        }
                        return (
                            <div
                                key={_key}
                                className={`material-history__text material-history__grid left pt-4 pb-4 ${classes}`}
                            >
                                <div>{_key}</div>
                                <div>{_moreData[_key]}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        ) : null
    }

    function renderSeeMoreButtonForWebhook() {
        return (
            <button
                type="button"
                className="fs-12 fw-6 pt-12 mt-12 pl-12 pr-12 w-100 bcn-0 flex left br-4 dc__box-shadow-top cb-5 dc__no-border"
                onClick={(event) => {
                    event.stopPropagation()
                    setShowSeeMore(!showSeeMore)
                }}
            >
                {showSeeMore ? 'See More' : 'See Less'}
            </button>
        )
    }

    function handleMoreDataForWebhook() {
        const _moreData = {}
        if (_webhookData.eventactiontype === WEBHOOK_EVENT_ACTION_TYPE.MERGED) {
            Object.keys(_webhookData.data).forEach((_key) => {
                if (
                    _key != 'author' &&
                    _key != 'date' &&
                    _key != 'git url' &&
                    _key != 'source branch name' &&
                    _key != 'source checkout' &&
                    _key != 'target branch name' &&
                    _key != 'target checkout' &&
                    _key != 'title'
                ) {
                    _moreData[_key] = _webhookData.data[_key]
                }
            })
        } else if (_webhookData.eventactiontype === WEBHOOK_EVENT_ACTION_TYPE.NON_MERGED) {
            Object.keys(_webhookData.data).forEach((_key) => {
                if (_key !== 'author' && _key !== 'date' && _key !== 'target checkout') {
                    _moreData[_key] = _webhookData.data[_key]
                }
            })
        }

        const _hasMoreData = Object.keys(_moreData).length > 0

        return (
            <>
                {_hasMoreData && renderMoreDataForWebhook(_moreData)}
                {_hasMoreData && renderSeeMoreButtonForWebhook()}
            </>
        )
    }

    const matSelectionText = (): JSX.Element => {
        if (isExcluded) {
            return (
                <Tippy
                    className="default-tt w-200 dc__align-left fw-4 fs-12 dc__no-text-transform"
                    arrow={false}
                    placement="bottom"
                    content={MATERIAL_EXCLUDE_TIPPY_TEXT}
                    interactive
                >
                    <span
                        data-testid="excluded-git-commit"
                        className="dc_max-width__max-content flex left cr-5 cursor-not-allowed dc__uppercase"
                    >
                        <Abort className="mr-4 fcr-5" />
                        Excluded
                    </span>
                </Tippy>
            )
        }

        return <Circle data-testid="valid-git-commit" />
    }

    const renderCommitStatus = () => {
        if (_lowerCaseCommitInfo.isselected) {
            return <Check data-testid="selected-git-commit" className="dc__align-right icon-dim-20" />
        }
        return matSelectionText()
    }

    const renderWebhookTitle = () =>
        _webhookData.data.title ? <span className="flex left cn-9 fs-13 fw-6">{_webhookData.data.title}</span> : null

    const renderPullRequestId = (pullRequestUrl: string) => {
        const pullRequestId = pullRequestUrl.split('/').pop()
        if (pullRequestId) {
            return (
                <a
                    href={pullRequestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="commit-hash fs-14 px-6 mono dc__w-fit-content"
                    onClick={stopPropagation}
                >
                    # {pullRequestId}
                </a>
            )
        }
        return null
    }

    const renderTargetBranch = () => {
        if (_webhookData.data['target branch name']) {
            return (
                <div className="flex left">
                    into&nbsp;
                    <a
                        href={createGitCommitUrl(materialUrl, _webhookData.data['target checkout'])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="commit-hash fs-14 px-6 mono"
                        onClick={stopPropagation}
                    >
                        {_webhookData.data['target branch name']}
                    </a>
                </div>
            )
        }
        return null
    }

    const renderSourceBranch = () => {
        if (_webhookData.data['source branch name']) {
            return (
                <div className="flex left">
                    from&nbsp;
                    <a
                        href={createGitCommitUrl(materialUrl, _webhookData.data['source checkout'])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="commit-hash fs-14 px-6 mono"
                        onClick={stopPropagation}
                    >
                        {_webhookData.data['source branch name']}
                    </a>
                </div>
            )
        }
        return null
    }

    const renderPRInfoCard = () =>
        _isWebhook &&
        _webhookData.eventactiontype === WEBHOOK_EVENT_ACTION_TYPE.MERGED && (
            <>
                {renderPullRequestId(_webhookData.data['git url'])}
                <div className="flex dc__content-space pr-16 ">
                    {renderWebhookTitle()}
                    {selectedCommitInfo ? (
                        <div className="flexbox dc__align-items-center dc__content-end fs-12">
                            {_lowerCaseCommitInfo.isselected ? (
                                <Check className="dc__align-right" />
                            ) : (
                                <Circle data-testid="valid-git-commit" />
                            )}
                        </div>
                    ) : null}
                </div>

                <div className="flex left lh-20 dc__gap-8">
                    <PullRequestIcon className="icon-dim-16" />
                    <div className="flex left dc__gap-4">
                        Merge 1 commit
                        {renderTargetBranch()}
                        {renderSourceBranch()}
                    </div>
                </div>
                {renderBasicGitCommitInfoForWebhook()}
                {handleMoreDataForWebhook()}
            </>
        )

    const renderTagInfoCard = () =>
        _isWebhook &&
        _webhookData.eventactiontype === WEBHOOK_EVENT_ACTION_TYPE.NON_MERGED && (
            <>
                <div className="flex left dc__content-space">
                    <div className="commit-hash px-6 dc__w-fit-content dc__gap-4">
                        <Tag className="icon-dim-14 scb-5" />
                        {_webhookData.data['target checkout']}
                    </div>
                    {selectedCommitInfo ? (
                        <div className="material-history__select-text">
                            {_lowerCaseCommitInfo.isselected ? <Check className="dc__align-right" /> : 'Select'}
                        </div>
                    ) : null}
                </div>
                {renderBasicGitCommitInfoForWebhook()}
                {handleMoreDataForWebhook()}
            </>
        )

    return (
        <div className="git-commit-info-generic__wrapper cn-9 fs-12">
            {showMaterialInfoHeader && (_isWebhook || _lowerCaseCommitInfo.commit) && (
                <GitMaterialInfoHeader
                    index={index}
                    repoUrl={materialUrl}
                    materialType={materialSourceType}
                    materialValue={materialSourceValue}
                />
            )}
            <div className="flexbox-col left dc__gap-8 p-16">
                {!_isWebhook && (
                    <>
                        {_lowerCaseCommitInfo.commit && (
                            <div className="flex dc__content-space">
                                {_commitUrl ? (
                                    <div className="flex dc__gap-8">
                                        <a
                                            href={_commitUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="commit-hash"
                                            onClick={stopPropagation}
                                            data-testid={`deployment-history-source-code-material-history${index}`}
                                        >
                                            <div
                                                className="material-history__header flex dc__gap-4"
                                                data-testid={`git-commit-credential${index}`}
                                            >
                                                <Commit className="commit-hash__icon mr-0" />
                                                {_lowerCaseCommitInfo.commit.slice(0, 7)}
                                            </div>
                                        </a>
                                        <span
                                            className="git-commit-info-generic__copy dc__visibility-hidden p-2"
                                            data-testid="git-commit-copy"
                                        >
                                            <ClipboardButton content={_lowerCaseCommitInfo.commit} />
                                        </span>
                                    </div>
                                ) : null}
                                {selectedCommitInfo ? renderCommitStatus() : null}
                            </div>
                        )}
                        {_lowerCaseCommitInfo.message ? (
                            <div
                                data-testid={`${_lowerCaseCommitInfo.message.trim()}-${isExcluded ? 'excluded' : 'included'}`}
                                className="material-history__text lh-20 flex left dc__gap-8 top material-history-text--padded dc__word-break-all"
                            >
                                <span className="fs-13 fw-6 lh-20 cn-9  dc__truncate--clamp-3">
                                    {_lowerCaseCommitInfo.message}
                                </span>
                            </div>
                        ) : null}
                        <div className="flexbox-col dc__gap-4">
                            {_lowerCaseCommitInfo.author ? (
                                <div className="material-history__text lh-20 flex left dc__gap-8">
                                    <PersonIcon className="icon-dim-16" />
                                    <span className="lh-20"> {_lowerCaseCommitInfo.author}</span>
                                </div>
                            ) : null}
                            {_lowerCaseCommitInfo.date ? (
                                <div className="material-history__text lh-20 flex left dc__gap-8">
                                    <CalendarIcon className="icon-dim-16" />
                                    <span className="lh-20">
                                        {moment(_lowerCaseCommitInfo.date).format(
                                            DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT,
                                        )}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </>
                )}

                {renderPRInfoCard()}
                {renderTagInfoCard()}
            </div>
        </div>
    )
}

export default GitCommitInfoGeneric
