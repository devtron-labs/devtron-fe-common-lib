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

import { ChangeEvent, KeyboardEvent as ReactKeyboardEvent, MouseEvent, useEffect, useState } from 'react'
import { render } from 'react-dom'
import {
    closeSearchPanel,
    findNext,
    findPrevious,
    getSearchQuery,
    replaceAll,
    replaceNext,
    SearchQuery,
    selectMatches,
    setSearchQuery,
} from '@codemirror/search'
import { EditorView, Panel, runScopeHandlers, ViewUpdate } from '@uiw/react-codemirror'

import { ReactComponent as ICArrowDown } from '@Icons/ic-arrow-down.svg'
import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'
import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ReactComponent as ICMatchCase } from '@Icons/ic-match-case.svg'
import { ReactComponent as ICMatchWord } from '@Icons/ic-match-word.svg'
import { ReactComponent as ICRegex } from '@Icons/ic-regex.svg'
import { ReactComponent as ICReplaceAllText } from '@Icons/ic-replace-all-text.svg'
import { ReactComponent as ICReplaceText } from '@Icons/ic-replace-text.svg'
import { ReactComponent as ICWorld } from '@Icons/ic-world.svg'
import { Tooltip } from '@Common/Tooltip'
import { Button, ButtonStyleType, ButtonVariantType, Collapse } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import {
    CLOSE_SEARCH_SHORTCUT_KEYS,
    NEXT_MATCH_SHORTCUT_KEYS,
    PREVIOUS_MATCH_SHORTCUT_KEYS,
    REPLACE_ALL_SHORTCUT_KEYS,
    REPLACE_SHORTCUT_KEYS,
} from '../CodeEditor.constants'
import { getShowReplaceField, setShowReplaceField } from '../Commands'
import { CodeEditorProps, FindReplaceProps, FindReplaceQuery, FindReplaceToggleButtonProps } from '../types'
import { getFindReplaceToggleButtonIconClass, getUpdatedSearchMatchesCount } from '../utils'

const FindReplaceToggleButton = ({
    isChecked,
    onChange,
    Icon,
    iconType = 'stroke',
    tooltipText,
}: FindReplaceToggleButtonProps) => {
    const onClick = (e: ChangeEvent<HTMLLabelElement>) => {
        e.stopPropagation()
        onChange(!isChecked)
    }

    return (
        <Tooltip alwaysShowTippyOnHover content={tooltipText} placement="bottom">
            <label
                htmlFor={`find-replace-${tooltipText}-toggle-button`}
                className={`m-0 flex p-1 dc__border-transparent br-2 cursor dc__position-rel ${isChecked ? 'eb-2 bcb-1' : ''}`}
                onChange={onClick}
            >
                <input
                    id={`find-replace-${tooltipText}-toggle-button`}
                    name={`find-replace-${tooltipText}-toggle-button`}
                    className="dc__position-abs dc__visibility-hidden dc__top-0 dc__right-0 dc__bottom-0 dc__left-0 m-0-imp"
                    type="checkbox"
                    aria-checked={isChecked}
                />
                <Icon className={`icon-dim-12 ${getFindReplaceToggleButtonIconClass({ isChecked, iconType })}`} />
            </label>
        </Tooltip>
    )
}

const FindReplace = ({ view, defaultQuery, defaultShowReplace, onSearchBarAction }: FindReplaceProps) => {
    // STATES
    const [query, setQuery] = useState<SearchQuery>(new SearchQuery({ search: '' }))
    const [matchesCount, setMatchesCount] = useState({ count: 0, current: 1 })
    const [showReplace, setShowReplace] = useState<boolean>(defaultShowReplace)

    // CONSTANTS
    const isPreviousNextButtonDisabled = !matchesCount.count
    const isReadOnly = view.state.readOnly

    // METHODS
    const sendQuery = ({
        caseSensitive = query.caseSensitive,
        regexp = query.regexp,
        replace = query.replace,
        search = query.search,
        wholeWord = query.wholeWord,
    }: FindReplaceQuery) => {
        const newQuery = new SearchQuery({
            caseSensitive,
            regexp,
            replace,
            search,
            wholeWord,
        })

        onSearchBarAction()
        if (!newQuery.eq(query)) {
            setQuery(newQuery)
            view.dispatch({ effects: setSearchQuery.of(newQuery) })
            setMatchesCount(getUpdatedSearchMatchesCount(newQuery, view))
        }
    }

    useEffect(() => {
        if (!defaultQuery.eq(query)) {
            onSearchBarAction()
            setMatchesCount(getUpdatedSearchMatchesCount(defaultQuery, view))
            setQuery(defaultQuery)
        }
    }, [defaultQuery])

    useEffect(() => {
        setMatchesCount(getUpdatedSearchMatchesCount(defaultQuery, view))
    }, [view.state.doc.length])

    useEffect(() => {
        if (defaultShowReplace !== showReplace) {
            setShowReplace(defaultShowReplace)
        }
    }, [defaultShowReplace])

    useEffect(() => {
        if (isReadOnly && showReplace) {
            setShowReplace(false)
        }
    }, [isReadOnly])

    const onNext = (e?: MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault()
        e?.stopPropagation()
        onSearchBarAction()
        findNext(view)
        setMatchesCount(getUpdatedSearchMatchesCount(query, view))
    }

    const onPrevious = (e?: MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault()
        e?.stopPropagation()
        onSearchBarAction()
        findPrevious(view)
        setMatchesCount(getUpdatedSearchMatchesCount(query, view))
    }

    const onFindChange = (e: ChangeEvent<HTMLInputElement>) => {
        sendQuery({ search: e.target.value })
    }

    const onFindKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if (e.key === 'Enter') {
            e.preventDefault()
            if (e.shiftKey) {
                onPrevious()
            } else {
                onNext()
            }
        }
    }

    const onReplaceChange = (e: ChangeEvent<HTMLInputElement>) => {
        sendQuery({ replace: e.target.value })
    }

    const onReplaceKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if (e.key === 'Enter') {
            e.preventDefault()
            onSearchBarAction()
            replaceNext(view)
        }
    }

    const onSelectAllClick = () => {
        selectMatches(view)
    }

    const onReplaceTextClick = () => {
        onSearchBarAction()
        replaceNext(view)
    }

    const onReplaceTextAllClick = () => {
        onSearchBarAction()
        replaceAll(view)
    }

    const onMatchCaseToggle = (caseSensitive: boolean) => {
        sendQuery({ caseSensitive })
    }

    const onMatchWordToggle = (wholeWord: boolean) => {
        sendQuery({ wholeWord })
    }

    const onRegExpToggle = (regexp: boolean) => {
        sendQuery({ regexp })
    }

    const handleReplaceVisibility = () => {
        setShowReplace(!showReplace)
        view.dispatch({ effects: [setShowReplaceField.of(!showReplace)] })
    }

    const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        closeSearchPanel(view)
    }

    // RENDERERS
    const renderReplaceShowButton = () => (
        <div className="code-editor__search__replace-expand-button flexbox dc__align-self-stretch">
            <Button
                dataTestId="find-replace-expand-button"
                ariaLabel="find-replace-expand-button"
                showAriaLabelInTippy={false}
                icon={
                    <ICCaretDown
                        className="rotate"
                        style={{
                            ['--rotateBy' as string]: showReplace ? '0deg' : '-90deg',
                        }}
                    />
                }
                variant={ButtonVariantType.borderLess}
                style={ButtonStyleType.neutral}
                size={ComponentSizeType.xxs}
                onClick={handleReplaceVisibility}
                showTooltip
                tooltipProps={{
                    content: 'Toggle Replace',
                    placement: 'bottom',
                }}
            />
        </div>
    )

    const renderFindField = () => (
        <div className="code-editor__search__field-container">
            <input
                data-code-editor-find="true"
                className="dc__no-border dc__outline-none-imp p-0 w-100"
                type="text"
                value={query.search}
                placeholder="Find"
                onChange={onFindChange}
                onKeyDown={onFindKeyDown}
                {...{ 'main-field': 'true' }}
            />
            <FindReplaceToggleButton
                Icon={ICMatchCase}
                isChecked={query.caseSensitive}
                onChange={onMatchCaseToggle}
                tooltipText="Match Case"
            />
            <FindReplaceToggleButton
                Icon={ICMatchWord}
                isChecked={query.wholeWord}
                onChange={onMatchWordToggle}
                tooltipText="Match Whole Word"
            />
            <FindReplaceToggleButton
                Icon={ICRegex}
                isChecked={query.regexp}
                onChange={onRegExpToggle}
                iconType="fill"
                tooltipText="Use Regular Expression"
            />
        </div>
    )

    const renderFindNextPreviousAllBtns = () => (
        <div className="flex dc__gap-4">
            <Button
                dataTestId="find-previous-button"
                ariaLabel="find-previous-button"
                showAriaLabelInTippy={false}
                icon={<ICArrowDown className="rotate" style={{ ['--rotateBy' as string]: '180deg' }} />}
                variant={ButtonVariantType.borderLess}
                style={ButtonStyleType.neutral}
                size={ComponentSizeType.xxs}
                onClick={onPrevious}
                disabled={isPreviousNextButtonDisabled}
                showTooltip
                tooltipProps={{
                    shortcutKeyCombo: {
                        text: 'Previous Match',
                        combo: PREVIOUS_MATCH_SHORTCUT_KEYS,
                    },
                    placement: 'bottom',
                }}
            />
            <Button
                dataTestId="find-next-button"
                ariaLabel="find-next-button"
                showAriaLabelInTippy={false}
                icon={<ICArrowDown />}
                variant={ButtonVariantType.borderLess}
                style={ButtonStyleType.neutral}
                size={ComponentSizeType.xxs}
                onClick={onNext}
                disabled={isPreviousNextButtonDisabled}
                showTooltip
                tooltipProps={{
                    shortcutKeyCombo: {
                        text: 'Next Match',
                        combo: NEXT_MATCH_SHORTCUT_KEYS,
                    },
                    placement: 'bottom',
                }}
            />
            <Button
                dataTestId="find-replace-select-all-button"
                ariaLabel="find-replace-select-all-button"
                showAriaLabelInTippy={false}
                icon={<ICWorld />}
                variant={ButtonVariantType.borderLess}
                style={ButtonStyleType.neutral}
                size={ComponentSizeType.xxs}
                onClick={onSelectAllClick}
                showTooltip
                tooltipProps={{
                    content: 'Select All',
                    placement: 'bottom',
                }}
            />
        </div>
    )

    const renderCloseButton = () => (
        <Button
            dataTestId="find-replace-close-button"
            ariaLabel="find-replace-close-button"
            showAriaLabelInTippy={false}
            icon={<ICClose />}
            variant={ButtonVariantType.borderLess}
            style={ButtonStyleType.neutral}
            size={ComponentSizeType.xxs}
            onClick={handleClose}
            showTooltip
            tooltipProps={{
                shortcutKeyCombo: {
                    text: 'Close',
                    combo: CLOSE_SEARCH_SHORTCUT_KEYS,
                },
                placement: 'bottom',
            }}
        />
    )

    const renderReplaceField = () => (
        <div className="flexbox dc__align-items-center dc__gap-8">
            <div className="code-editor__search__field-container">
                <input
                    data-code-editor-replace="true"
                    className="dc__no-border dc__outline-none-imp p-0 w-100"
                    type="text"
                    value={query.replace}
                    placeholder="Replace with..."
                    onChange={onReplaceChange}
                    onKeyDown={onReplaceKeyDown}
                />
            </div>
            <div className="flex dc__gap-4">
                <Button
                    dataTestId="replace-text-button"
                    ariaLabel="replace-text-button"
                    showAriaLabelInTippy={false}
                    icon={<ICReplaceText />}
                    variant={ButtonVariantType.borderLess}
                    style={ButtonStyleType.neutral}
                    size={ComponentSizeType.xxs}
                    onClick={onReplaceTextClick}
                    showTooltip
                    tooltipProps={{
                        shortcutKeyCombo: {
                            text: 'Replace',
                            combo: REPLACE_SHORTCUT_KEYS,
                        },
                        placement: 'bottom',
                    }}
                />
                <Button
                    dataTestId="replace-all-text-button"
                    ariaLabel="replace-all-text-button"
                    showAriaLabelInTippy={false}
                    icon={<ICReplaceAllText />}
                    variant={ButtonVariantType.borderLess}
                    style={ButtonStyleType.neutral}
                    size={ComponentSizeType.xxs}
                    onClick={onReplaceTextAllClick}
                    showTooltip
                    tooltipProps={{
                        shortcutKeyCombo: {
                            text: 'Replace All',
                            combo: REPLACE_ALL_SHORTCUT_KEYS,
                        },
                        placement: 'bottom',
                    }}
                />
            </div>
        </div>
    )

    return (
        <div className="flexbox dc__align-items-center dc__gap-6">
            {!isReadOnly && renderReplaceShowButton()}
            <div className="flexbox-col dc__gap-4">
                <div className="flexbox dc__align-items-center dc__gap-8">
                    {renderFindField()}
                    <p className={`m-0 w-80px fs-12 lh-18 cn-7 ${query.search && !matchesCount.count ? 'cr-5' : ''}`}>
                        {matchesCount.count ? `${matchesCount.current || '?'} of ${matchesCount.count}` : 'No results'}
                    </p>
                    {renderFindNextPreviousAllBtns()}
                    {renderCloseButton()}
                </div>
                <Collapse expand={showReplace}>{renderReplaceField()}</Collapse>
            </div>
        </div>
    )
}

export const getCodeEditorFindReplace =
    (onSearchBarAction: CodeEditorProps['onSearchBarAction']) =>
    (view: EditorView): Panel => {
        const dom = document.createElement('div')

        const keydown = (e: KeyboardEvent) => {
            if (runScopeHandlers(view, e, 'search-panel')) {
                e.preventDefault()
                e.stopPropagation()
            }
        }

        dom.className =
            'code-editor__search mt-8 mb-4 mr-8 ml-auto p-5 bg__secondary dc__border br-4 dc__w-fit-content fs-14'
        dom.onkeydown = keydown

        const renderFindReplace = () => {
            render(
                <FindReplace
                    view={view}
                    defaultQuery={getSearchQuery(view.state)}
                    defaultShowReplace={getShowReplaceField(view.state)}
                    onSearchBarAction={onSearchBarAction}
                />,
                dom,
            )
        }

        const mount = () => {
            requestAnimationFrame(() => {
                const findField = document.querySelector('[data-code-editor-find]') as HTMLInputElement
                findField?.focus()
                findField?.select()
            })
        }

        const update = ({ transactions, docChanged, state, startState }: ViewUpdate) => {
            transactions.forEach((tr) => {
                tr.effects.forEach((effect) => {
                    if (effect.is(setSearchQuery)) {
                        renderFindReplace()
                    }
                    if (effect.is(setShowReplaceField)) {
                        renderFindReplace()
                    }
                })
            })

            if (docChanged || state.readOnly !== startState.readOnly) {
                renderFindReplace()
            }
        }

        renderFindReplace()

        return {
            top: true,
            dom,
            mount,
            update,
        }
    }
