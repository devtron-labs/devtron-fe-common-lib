import { ChangeEvent, MouseEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from 'react'
import { render } from 'react-dom'
import { EditorView, Panel, runScopeHandlers, ViewUpdate } from '@uiw/react-codemirror'
import {
    findNext,
    findPrevious,
    SearchQuery,
    setSearchQuery,
    getSearchQuery,
    replaceNext,
    replaceAll,
    closeSearchPanel,
    selectMatches,
} from '@codemirror/search'

import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'
import { ReactComponent as ICArrowDown } from '@Icons/ic-arrow-down.svg'
import { ReactComponent as ICWorld } from '@Icons/ic-world.svg'
import { ReactComponent as ICReplaceText } from '@Icons/ic-replace-text.svg'
import { ReactComponent as ICReplaceAllText } from '@Icons/ic-replace-all-text.svg'
import { ReactComponent as ICMatchCase } from '@Icons/ic-match-case.svg'
import { ReactComponent as ICMatchWord } from '@Icons/ic-match-word.svg'
import { ReactComponent as ICRegex } from '@Icons/ic-regex.svg'
import { Button, ButtonStyleType, ButtonVariantType, Collapse } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import { Tooltip } from '@Common/Tooltip'

import { FindReplaceProps, FindReplaceQuery, FindReplaceToggleButtonProps } from '../types'
import {
    CLOSE_SEARCH_SHORTCUT_KEYS,
    NEXT_MATCH_SHORTCUT_KEYS,
    PREVIOUS_MATCH_SHORTCUT_KEYS,
    REPLACE_ALL_SHORTCUT_KEYS,
    REPLACE_SHORTCUT_KEYS,
    SELECT_ALL_SHORTCUT_KEYS,
} from '../CodeEditor.constants'
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

const FindReplace = ({ view, defaultQuery }: FindReplaceProps) => {
    // STATES
    const [query, setQuery] = useState<SearchQuery>(new SearchQuery({ search: '' }))
    const [matchesCount, setMatchesCount] = useState({ count: 0, current: 1 })
    const [showReplace, setShowReplace] = useState(!!query.replace)

    // CONSTANTS
    const isPreviousNextButtonDisabled = !matchesCount.count

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

        if (!newQuery.eq(query)) {
            setQuery(newQuery)
            view.dispatch({ effects: setSearchQuery.of(newQuery) })
            setMatchesCount(getUpdatedSearchMatchesCount(newQuery, view))
        }
    }

    useEffect(() => {
        if (!defaultQuery.eq(query)) {
            setMatchesCount(getUpdatedSearchMatchesCount(defaultQuery, view))
            setQuery(defaultQuery)
        }
    }, [defaultQuery])

    useEffect(() => {
        setMatchesCount(getUpdatedSearchMatchesCount(defaultQuery, view))
    }, [view.state.doc.length])

    const onNext = (e?: MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault()
        e?.stopPropagation()
        findNext(view)
        setMatchesCount(getUpdatedSearchMatchesCount(query, view))
    }

    const onPrevious = (e?: MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault()
        e?.stopPropagation()
        findPrevious(view)
        setMatchesCount(getUpdatedSearchMatchesCount(query, view))
    }

    const onFindChange = (e: ChangeEvent<HTMLInputElement>) => {
        sendQuery({ search: e.target.value })
    }

    const onFindKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
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
        if (e.key === 'Enter') {
            e.preventDefault()
            replaceNext(view)
        }
    }

    const onSelectAllClick = () => {
        selectMatches(view)
    }

    const onReplaceTextClick = () => {
        replaceNext(view)
    }

    const onReplaceTextAllClick = () => {
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
                    shortcutKeyCombo: {
                        text: 'Select All',
                        combo: SELECT_ALL_SHORTCUT_KEYS,
                    },
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
            {!view.state.readOnly && renderReplaceShowButton()}
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

export const codeEditorFindReplace = (view: EditorView): Panel => {
    const dom = document.createElement('div')

    const keydown = (e: KeyboardEvent) => {
        if (runScopeHandlers(view, e, 'search-panel')) {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    dom.className = 'code-editor__search mt-8 mb-4 mr-8 ml-auto p-5 bg__secondary dc__border br-4 dc__w-fit-content'
    dom.onkeydown = keydown

    const renderFindReplace = () => {
        render(<FindReplace view={view} defaultQuery={getSearchQuery(view.state)} />, dom)
    }

    const mount = () => {
        const findField = document.querySelector('[data-code-editor-find]') as HTMLInputElement
        findField?.focus()
        findField?.select()
    }

    const update = ({ transactions, docChanged }: ViewUpdate) => {
        transactions.forEach((tr) => {
            tr.effects.forEach((effect) => {
                if (effect.is(setSearchQuery)) {
                    renderFindReplace()
                }
            })
        })

        if (docChanged) {
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
