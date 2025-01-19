import {
    ChangeEvent,
    FunctionComponent,
    KeyboardEvent as ReactKeyboardEvent,
    SVGProps,
    useEffect,
    useState,
} from 'react'
import { render } from 'react-dom'
import { EditorView, Panel, runScopeHandlers, ViewUpdate } from '@uiw/react-codemirror'
// eslint-disable-next-line import/no-extraneous-dependencies
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

import { FindReplaceProps, FindReplaceQuery } from './types'

const FindReplaceToggleButton = ({
    isChecked,
    onChange,
    Icon,
    iconType = 'stroke',
}: {
    isChecked: boolean
    Icon: FunctionComponent<SVGProps<SVGSVGElement>>
    onChange: (isChecked: boolean) => void
    iconType?: 'stroke' | 'fill'
}) => {
    const onClick = () => onChange(!isChecked)

    const getIconClass = () => {
        if (iconType === 'stroke') {
            return isChecked ? 'scb-5' : 'scn-7'
        }
        return isChecked ? 'fcb-5' : 'fcn-7'
    }

    return (
        <div
            aria-checked={isChecked}
            role="checkbox"
            tabIndex={0}
            className={`flex p-1 dc__border-transparent br-2 cursor ${isChecked ? 'eb-2 bcb-1' : ''}`}
            onClick={onClick}
        >
            <Icon className={`icon-dim-12 ${getIconClass()}`} />
        </div>
    )
}

const FindReplace = ({ view, defaultQuery }: FindReplaceProps) => {
    // STATES
    const [query, setQuery] = useState<SearchQuery>(new SearchQuery({ search: '' }))
    const [matchesCount, setMatchesCount] = useState({ count: 0, current: 0 })
    const [showReplace, setShowReplace] = useState(!!query.replace)

    // METHODS
    const updateSearchMatchesCount = (newQuery: SearchQuery = query) => {
        const cursor = newQuery.getCursor(view.state)
        const updatedMatchesCount = { count: 0, current: 0 }
        const { from, to } = view.state.selection.main

        let item = cursor.next()
        while (newQuery.search !== '' && !item.done) {
            if ((item.value.from === from && item.value.to === to) || item.value.from < from) {
                updatedMatchesCount.current = updatedMatchesCount.count + 1
            }

            item = cursor.next()
            updatedMatchesCount.count += 1
        }

        setMatchesCount(updatedMatchesCount)
    }

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
            updateSearchMatchesCount(newQuery)
        }
    }

    useEffect(() => {
        if (!defaultQuery.eq(query)) {
            updateSearchMatchesCount(defaultQuery)
            setQuery(defaultQuery)
        }
    }, [defaultQuery])

    useEffect(() => {
        updateSearchMatchesCount(defaultQuery)
    }, [view.state.doc.length])

    const onNext = () => {
        findNext(view)
        // TODO: can optimise this - check if count and then update current
        updateSearchMatchesCount()
    }

    const onPrevious = () => {
        findPrevious(view)
        updateSearchMatchesCount()
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

    const handleClose = () => {
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
            />
        </div>
    )

    const renderFindField = () => (
        <div className="code-editor__search__field-container">
            <input
                data-code-editor-find="true"
                className="dc__no-border dc__outline-none-imp p-0 flex-grow-1"
                type="text"
                value={query.search}
                placeholder="Find"
                onChange={onFindChange}
                onKeyDown={onFindKeyDown}
                {...{ 'main-field': 'true' }}
            />
            <FindReplaceToggleButton Icon={ICMatchCase} isChecked={query.caseSensitive} onChange={onMatchCaseToggle} />
            <FindReplaceToggleButton Icon={ICMatchWord} isChecked={query.wholeWord} onChange={onMatchWordToggle} />
            <FindReplaceToggleButton
                Icon={ICRegex}
                isChecked={query.regexp}
                onChange={onRegExpToggle}
                iconType="fill"
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
        />
    )

    const renderReplaceField = () => (
        <div className="flexbox dc__align-items-center dc__gap-8">
            <div className="code-editor__search__field-container">
                <input
                    data-code-editor-replace="true"
                    className="dc__no-border dc__outline-none-imp p-0 flex-grow-1"
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
                />
            </div>
        </div>
    )

    return (
        <div className="flexbox dc__align-items-center dc__gap-6">
            {renderReplaceShowButton()}
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

export const CodeEditorFindReplace = ({ view }: { view: EditorView }): Panel => {
    const dom = document.createElement('div')

    const keydown = (e: KeyboardEvent) => {
        if (runScopeHandlers(view, e, 'search-panel')) {
            e.preventDefault()
        }
    }

    dom.className = 'code-editor__search bg__secondary dc__border br-4 p-5 dc__position-abs dc__top-8 dc__right-8'
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
