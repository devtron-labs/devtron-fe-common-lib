import { RefCallback } from 'react'
import DOMPurify from 'dompurify'
import { getTimeDifference } from '@Shared/Helpers'
import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'
import { ReactComponent as ICStack } from '@Icons/ic-stack.svg'
import { LogStageAccordionProps } from './types'
import { getLogSearchIndex, getStageStatusIcon } from './utils'
import { TargetPlatformListTooltip } from '../TargetPlatforms'

const LogsItemContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="display-grid dc__column-gap-10 dc__align-start logs-renderer__log-item">{children}</div>
)

const LogStageAccordion = ({
    stage,
    isOpen,
    logs,
    endTime,
    startTime,
    status,
    handleStageClose,
    handleStageOpen,
    stageIndex,
    isLoading,
    fullScreenView,
    searchIndex,
    targetPlatforms,
}: LogStageAccordionProps) => {
    const handleAccordionToggle = () => {
        if (isOpen) {
            handleStageClose(stageIndex)
        } else {
            handleStageOpen(stageIndex)
        }
    }

    const getFormattedTimeDifference = (): string => {
        const timeDifference = getTimeDifference(startTime, endTime)
        if (timeDifference === '0s') {
            return '< 1s'
        }
        return timeDifference
    }

    const scrollIntoView: RefCallback<HTMLSpanElement> = (node) => {
        if (!node) {
            return
        }

        if (node.dataset.containsMatch === 'true' && node.dataset.triggered !== 'true') {
            // eslint-disable-next-line no-param-reassign
            node.dataset.triggered = 'true'
            // TODO: this will additionally scroll the top most scrollbar. Need to check into that
            node.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }

        if (node.dataset.containsMatch === 'false') {
            // eslint-disable-next-line no-param-reassign
            node.dataset.triggered = 'false'
        }
    }

    return (
        <div className="flexbox-col dc__gap-8">
            <button
                className={`flexbox dc__transparent dc__content-space py-6 px-8 br-4 dc__align-items-center dc__select-text logs-renderer__stage-accordion ${
                    isOpen ? 'logs-renderer__stage-accordion--open-stage' : ''
                } dc__position-sticky dc__zi-1 ${fullScreenView ? 'dc__top-44' : 'dc__top-80'}`}
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
                            <TargetPlatformListTooltip targetPlatforms={targetPlatforms}>
                                <div className="flexbox dc__gap-4 dc__align-items-center">
                                    <ICStack className="scn-0 dc__no-shrink icon-stroke__white icon-dim-12" />
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

            {isOpen && (
                <div className="flexbox-col dc__gap-4">
                    {logs.map((log: string, logsIndex: number) => {
                        const doesLineContainSearchMatch =
                            getLogSearchIndex({ stageIndex, lineNumberInsideStage: logsIndex }) === searchIndex

                        return (
                            <LogsItemContainer
                                // eslint-disable-next-line react/no-array-index-key
                                key={`logs-${stage}-${startTime}-${logsIndex}`}
                            >
                                <span
                                    ref={scrollIntoView}
                                    className="cn-4 col-2 lh-20 dc__text-align-end dc__word-break mono fs-14 dc__user-select-none"
                                    data-contains-match={doesLineContainSearchMatch}
                                >
                                    {logsIndex + 1}
                                </span>
                                <pre
                                    className="mono fs-14 mb-0-imp text__white dc__word-break lh-20 dc__unset-pre"
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(log),
                                    }}
                                />
                            </LogsItemContainer>
                        )
                    })}

                    {isLoading && (
                        <LogsItemContainer>
                            <span />
                            <div className="dc__loading-dots text__white" />
                        </LogsItemContainer>
                    )}
                </div>
            )}
        </div>
    )
}

export default LogStageAccordion
