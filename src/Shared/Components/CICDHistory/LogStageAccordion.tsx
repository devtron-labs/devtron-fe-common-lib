import DOMPurify from 'dompurify'
import { getTimeDifference } from '@Shared/Helpers'
import { LogStageAccordionProps } from './types'
import { getStageStatusIcon } from './utils'
import { ReactComponent as ICCaretDown } from '../../../Assets/Icon/ic-caret-down.svg'

const LogStageAccordion = ({
    stage,
    isOpen,
    logs,
    endTime,
    startTime,
    status,
    handleStageClose,
    handleStageOpen,
    accordionIndex,
}: LogStageAccordionProps) => {
    const handleAccordionToggle = () => {
        if (isOpen) {
            handleStageClose(accordionIndex)
        } else {
            handleStageOpen(accordionIndex)
        }
    }

    return (
        <div className="flexbox-col dc__gap-8">
            <button
                className="flexbox dc__transparent dc__content-space py-6 px-8 br-4 dc__align-items-center dc__select-text logs-renderer__stage-accordion-hover"
                style={{
                    backgroundColor: isOpen ? '#2C3354' : '#0C1021',
                }}
                type="button"
                role="tab"
                onClick={handleAccordionToggle}
            >
                <div className="flexbox dc__gap-8 dc__transparent dc__align-items-center">
                    <ICCaretDown
                        className={`icon-dim-16 dc__no-shrink dc__transition--transform scn-6 ${!isOpen ? 'dc__flip-n90 dc__opacity-0_5' : ''}`}
                    />

                    <div className="flexbox dc__gap-12 dc__align-items-center">
                        {getStageStatusIcon(status)}

                        <h3 className="m-0 cn-0 fs-13 fw-6 lh-20 dc__word-break">{stage}</h3>
                    </div>
                </div>

                {!!endTime && <span className="cn-0 fs-13 fw-4 lh-20">{getTimeDifference(startTime, endTime)}</span>}
            </button>

            {isOpen &&
                logs.map((log: string, logsIndex: number) => (
                    <div
                        className="flex top left pl-24 dc__gap-10 lh-24 pb-10"
                        // eslint-disable-next-line react/no-array-index-key
                        key={`logs-${stage}-${startTime}-${logsIndex}`}
                    >
                        <span className="cn-4 col-2">{logsIndex + 1}</span>
                        <p
                            className="mono fs-14 mb-0-imp cn-0 dc__word-break"
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(log),
                            }}
                        />
                    </div>
                ))}
        </div>
    )
}

export default LogStageAccordion
