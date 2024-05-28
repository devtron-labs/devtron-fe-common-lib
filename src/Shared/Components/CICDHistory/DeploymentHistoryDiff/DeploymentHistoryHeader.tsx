import { useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import { useHistory, useRouteMatch, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import Tippy from '@tippyjs/react'
import { DATE_TIME_FORMATS, URLS, showError } from '../../../../Common'
import { DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP } from '../../../constants'
import { ReactComponent as LeftIcon } from '../../../../Assets/Icon/ic-arrow-backward.svg'
import { DeploymentTemplateOptions, DeploymentHistoryParamsType, CompareWithBaseConfiguration } from './types'
import { getDeploymentDiffSelector } from '../service'
import { dropdownStyles, Option } from './utils'

const DeploymentHistoryHeader = ({
    selectedDeploymentTemplate,
    setSelectedDeploymentTemplate,
    setFullScreenView,
    setLoader,
    setPreviousConfigAvailable,
    renderRunSource,
    resourceId,
}: CompareWithBaseConfiguration) => {
    const { url } = useRouteMatch()
    const history = useHistory()
    const { pipelineId, historyComponent, baseConfigurationId, historyComponentName } =
        useParams<DeploymentHistoryParamsType>()
    const [baseTemplateTimeStamp, setBaseTemplateTimeStamp] = useState<string>('')
    const [deploymentTemplateOption, setDeploymentTemplateOption] = useState<DeploymentTemplateOptions[]>([])

    const onClickTimeStampSelector = (selected: { label: string; value: string }) => {
        setSelectedDeploymentTemplate(selected)
    }

    useEffect(() => {
        if (pipelineId && historyComponent && baseConfigurationId) {
            try {
                setLoader(true)
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                getDeploymentDiffSelector(pipelineId, historyComponent, baseConfigurationId, historyComponentName).then(
                    (response) => {
                        const deploymentTemplateOpt = []
                        if (response.result) {
                            const resultLen = response.result.length
                            for (let i = 0; i < resultLen; i++) {
                                if (response.result[i].id.toString() === baseConfigurationId) {
                                    setBaseTemplateTimeStamp(response.result[i].deployedOn)
                                } else {
                                    deploymentTemplateOpt.push({
                                        value: String(response.result[i].id),
                                        label: moment(response.result[i].deployedOn).format(
                                            DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT,
                                        ),
                                        author: response.result[i].deployedBy,
                                        status: response.result[i].deploymentStatus,
                                        runSource: response.result[i].runSource,
                                        renderRunSource,
                                        resourceId,
                                    })
                                }
                            }
                        }
                        setPreviousConfigAvailable(deploymentTemplateOpt.length > 0)
                        setDeploymentTemplateOption(deploymentTemplateOpt)
                        setSelectedDeploymentTemplate(
                            deploymentTemplateOpt[0] || {
                                label: 'NA',
                                value: 'NA',
                                author: 'NA',
                                status: 'NA',
                                runSource: null,
                            },
                        )
                    },
                )
            } catch (err) {
                showError(err)
                setLoader(false)
            }
        }
    }, [historyComponent, baseConfigurationId, historyComponentName])

    const renderGoBackToConfiguration = () => (
        <NavLink
            data-testid="configuration-back-arrow"
            to=""
            className="flex"
            onClick={(e) => {
                e.preventDefault()
                setFullScreenView(false)
                history.push(
                    `${url.split(URLS.DEPLOYMENT_HISTORY_CONFIGURATIONS)[0]}${URLS.DEPLOYMENT_HISTORY_CONFIGURATIONS}`,
                )
            }}
        >
            <LeftIcon className="rotate icon-dim-24 mr-16" />
        </NavLink>
    )

    const renderCompareDeploymentConfig = () => (
        <div className="pt-12 pb-12 pl-16 compare-history__border-left pr-16">
            <div className="cn-6 lh-1-43 " data-testid="configuration-compare-with-heading">
                Compare with
            </div>
            <div style={{ minWidth: '200px' }}>
                {deploymentTemplateOption.length > 0 ? (
                    <ReactSelect
                        placeholder="Select Timestamp"
                        classNamePrefix="configuration-compare-with-dropdown"
                        isSearchable={false}
                        styles={dropdownStyles}
                        onChange={onClickTimeStampSelector}
                        options={deploymentTemplateOption}
                        components={{
                            IndicatorSeparator: null,
                            Option,
                        }}
                        value={selectedDeploymentTemplate || deploymentTemplateOption[0]}
                    />
                ) : (
                    <div className="cn-9 fs-13 fw-4">
                        <Tippy
                            className="default-tt left-50"
                            placement="bottom"
                            arrow={false}
                            content={
                                <span style={{ display: 'block', width: '180px' }}>
                                    {
                                        DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP[
                                            historyComponent.replace('-', '_').toUpperCase()
                                        ]?.DISPLAY_NAME
                                    }
                                    {historyComponentName ? ` “${historyComponentName}”` : ''} was added in this
                                    deployment. There is no previous instance to compare with.
                                </span>
                            }
                        >
                            <span data-testid="deployment-history-configuration-no-options">No options</span>
                        </Tippy>
                    </div>
                )}
            </div>
        </div>
    )

    const renderBaseDeploymentConfig = () => (
        <div className="compare-history__border-left pt-12 pb-12 pl-16 pr-16">
            <span className="cn-6" data-testid="configuration-base-configuration-heading">
                Base configuration
            </span>
            <div className="cn-9 fs-13">
                {baseTemplateTimeStamp && moment(baseTemplateTimeStamp).format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT)}
            </div>
        </div>
    )
    return (
        <div className="dc__border-bottom pl-20 pr-20 flex left bcn-0">
            {renderGoBackToConfiguration()}
            {renderCompareDeploymentConfig()}
            {renderBaseDeploymentConfig()}
        </div>
    )
}

export default DeploymentHistoryHeader
