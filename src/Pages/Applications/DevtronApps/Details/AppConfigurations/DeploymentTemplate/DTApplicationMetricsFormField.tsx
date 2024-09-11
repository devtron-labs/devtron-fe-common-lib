import { Progressing } from '@Common/Progressing'
import { Checkbox } from '@Common/Checkbox'
import { CHECKBOX_VALUE } from '@Common/Types'
import { Tooltip } from '@Common/Tooltip'
import { DOCUMENTATION } from '@Common/Constants'
import { ReactComponent as ICHelpOutline } from '@Icons/ic-help-outline.svg'
import { ReactComponent as ICInfoFilledOverride } from '@Icons/ic-info-filled-override.svg'
import { DeploymentTemplateTabsType, DTApplicationMetricsFormFieldProps } from './types'

const DTApplicationMetricsFormField = ({
    showApplicationMetrics,
    isLoading,
    selectedChart,
    isDisabled,
    toggleAppMetrics,
    isAppMetricsEnabled,
    showReadMe,
    selectedTab,
    onlyShowCurrentStatus = false,
}: DTApplicationMetricsFormFieldProps) => {
    if (!showApplicationMetrics) {
        return null
    }

    const isCompareTab = selectedTab === DeploymentTemplateTabsType.COMPARE && !showReadMe

    if (onlyShowCurrentStatus) {
        return (
            <div className="flexbox dc__align-items-center dc__gap-8 fs-13 fw-4 lh-20 cn-9">
                <ICInfoFilledOverride className="icon-dim-16 dc__no-shrink" />
                <div className="flexbox dc__gap-7">
                    <span>Application metrics are</span>
                    <span className="fw-6">{isAppMetricsEnabled ? 'Enabled' : 'Not enabled'}</span>
                </div>
            </div>
        )
    }

    const getInfoText = (): string => {
        if (!selectedChart.isAppMetricsSupported) {
            return `Application metrics is not supported for ${selectedChart.name} version ${selectedChart.version}.`
        }
        return 'Capture and show key application metrics over time. (E.g. Status codes 2xx, 3xx, 5xx; throughput and latency).'
    }

    if (isLoading) {
        return (
            <div className="flexbox dc__align-items-center dc__gap-16">
                <Progressing data-testid="app-metrics-checkbox-loading" />
                <span className="fs-13 fw-4 lh-20">Application metrics</span>
            </div>
        )
    }

    return (
        <div className="flexbox dc__gap-8">
            <Checkbox
                rootClassName={`mb-0 mt-2 dc__align-start ${!selectedChart.isAppMetricsSupported ? 'dc__disabled' : ''}`}
                isChecked={isAppMetricsEnabled}
                value={CHECKBOX_VALUE.CHECKED}
                onChange={toggleAppMetrics}
                dataTestId="app-metrics-checkbox"
                disabled={isDisabled || !selectedChart.isAppMetricsSupported}
            />

            <div className="flex column left">
                <div className="flex left fs-13 dc__gap-8">
                    <b className="fw-6 lh-18 cn-9">Show application metrics</b>

                    {isCompareTab || showReadMe ? (
                        <Tooltip alwaysShowTippyOnHover content={getInfoText()}>
                            <button
                                type="button"
                                aria-label="show-app-metrics-info"
                                className="flex dc__transparent icon-dim-16"
                            >
                                <ICHelpOutline className="icon-dim-16 dc__no-shrink" />
                            </button>
                        </Tooltip>
                    ) : (
                        <a
                            data-testid="app-metrics-learnmore-link"
                            href={DOCUMENTATION.APP_METRICS}
                            target="_blank"
                            className="anchor"
                            rel="noreferrer noopener"
                        >
                            Learn more
                        </a>
                    )}
                </div>

                {!isCompareTab && !showReadMe && (
                    <div
                        data-testid="app-metrics-info-text"
                        className={`fs-13 fw-4 lh-18 ${!selectedChart.isAppMetricsSupported ? 'cr-5' : 'cn-7'}`}
                    >
                        {getInfoText()}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DTApplicationMetricsFormField
