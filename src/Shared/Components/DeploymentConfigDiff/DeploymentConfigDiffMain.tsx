import { Fragment, useCallback, useState } from 'react'

import { ReactComponent as ICSortArrowDown } from '@Icons/ic-sort-arrow-down.svg'
import { Progressing } from '@Common/Progressing'
import { CodeEditor } from '@Common/CodeEditor'
import { MODES, SortingOrder } from '@Common/Constants'

import { SelectPicker } from '../SelectPicker'
import { DeploymentHistoryDiffView } from '../CICDHistory'
import { DeploymentConfigDiffAccordion } from './DeploymentConfigDiffAccordion'
import { DeploymentConfigDiffMainProps, DeploymentConfigDiffSelectPickerProps } from './types'

export const DeploymentConfigDiffMain = ({
    isLoading,
    headerText = 'Compare With',
    configList = [],
    scrollIntoViewId,
    selectorsConfig,
    sortOrder,
    onSortBtnClick,
}: DeploymentConfigDiffMainProps) => {
    // STATES
    const [collapsedView, setCollapsedView] = useState<Record<string | number, boolean>>({})

    // SCROLL CALLBACK FUNCTION
    const scroll = useCallback((node: HTMLDivElement) => {
        if (node !== null) {
            // scrolls to the item
            node.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])

    const handleAccordionClick = (id: string) => () => {
        setCollapsedView({
            ...collapsedView,
            [id]: !collapsedView[id],
        })
    }

    const renderHeaderSelectors = (list: DeploymentConfigDiffSelectPickerProps[]) =>
        list.map((configItem, index) => {
            if (configItem.type === 'string') {
                return (
                    <Fragment key={configItem.id}>
                        {typeof configItem.text === 'string' ? (
                            <p className="m-0 cn-9 fs-13 lh-20 fw-6">{configItem.text}</p>
                        ) : (
                            configItem.text
                        )}
                    </Fragment>
                )
            }

            const { selectPickerProps } = configItem
            return (
                <Fragment key={configItem.id}>
                    <div className="dc__mxw-300">
                        <SelectPicker {...selectPickerProps} isDisabled={isLoading || selectPickerProps?.isDisabled} />
                    </div>
                    {index !== list.length - 1 && <span className="cn-9 fs-13 lh-20">/</span>}
                </Fragment>
            )
        })

    const renderSortButton = () => (
        <div className="dc__border-left p-12 h-100">
            <button
                type="button"
                className={`dc__unset-button-styles flexbox dc__align-items-center dc__gap-6 ${isLoading ? 'dc__disabled' : ''}`}
                onClick={onSortBtnClick}
                disabled={isLoading}
            >
                <ICSortArrowDown
                    className="fcn-7 rotate"
                    style={{ ['--rotateBy' as string]: sortOrder === SortingOrder.ASC ? '0deg' : '180deg' }}
                />
                <span className="cn-7 fs-13 lh-20 fw-6">Sort keys</span>
            </button>
        </div>
    )

    const renderDiffs = () =>
        configList.map(({ id, isDeploymentTemplate, primaryConfig, secondaryConfig, title, hasDiff }) => {
            const { heading: primaryHeading, list: primaryList } = primaryConfig
            const { heading: secondaryHeading, list: secondaryList } = secondaryConfig

            return (
                <DeploymentConfigDiffAccordion
                    key={`${id}-${title}`}
                    ref={id === scrollIntoViewId ? scroll : null}
                    id={id}
                    title={title}
                    isExpanded={!collapsedView[id]}
                    hasDiff={hasDiff}
                    handleOnClick={handleAccordionClick(id)}
                >
                    {isDeploymentTemplate ? (
                        <>
                            <div className="bcn-1 deployment-diff__upper dc__border-top">
                                <div className="px-12 py-6 dc__border-right">{primaryHeading}</div>
                                <div className="px-12 py-6">{secondaryHeading}</div>
                            </div>
                            <CodeEditor
                                diffView
                                defaultValue={primaryList.codeEditorValue.value}
                                value={secondaryList.codeEditorValue.value}
                                mode={MODES.YAML}
                                height="656px"
                                noParsing
                                readOnly
                            />
                        </>
                    ) : (
                        <>
                            <div className="bcn-1 deployment-diff__upper dc__top-radius-4 mt-16 ml-16 mr-16 dc__border-right dc__border-left dc__border-top">
                                <div className="px-12 py-6 dc__border-right">{primaryHeading}</div>
                                <div className="px-12 py-6">{secondaryHeading}</div>
                            </div>
                            <DeploymentHistoryDiffView
                                baseTemplateConfiguration={secondaryList}
                                currentConfiguration={primaryList}
                                previousConfigAvailable
                                rootClassName="m-16 mt-0-imp dc__no-top-radius dc__no-top-border"
                                comparisonBodyClassName="m-16"
                                sortOrder={sortOrder}
                            />
                        </>
                    )}
                </DeploymentConfigDiffAccordion>
            )
        })

    return (
        <div className="bcn-0 deployment-config-diff__main-top">
            <div className="dc__border-bottom-n1 flexbox dc__align-items-center dc__position-sticky dc__top-0 bcn-0 w-100 dc__zi-11">
                <div className="flexbox dc__align-items-center p-12 dc__gap-4 deployment-config-diff__main-top__header">
                    <p className="m-0 cn-9 fs-13 lh-20">{headerText}</p>
                    {renderHeaderSelectors(selectorsConfig.primaryConfig)}
                </div>
                <div className="dc__border-left flexbox dc__align-items-center deployment-config-diff__main-top__header">
                    <div className="flex-grow-1 flexbox dc__align-items-center dc__gap-4 p-12">
                        {renderHeaderSelectors(selectorsConfig.secondaryConfig)}
                    </div>
                    {onSortBtnClick && renderSortButton()}
                </div>
            </div>
            <div className="deployment-config-diff__main-content">
                {isLoading ? (
                    <Progressing fullHeight size={48} />
                ) : (
                    <div className="flexbox-col dc__gap-16 p-12">{renderDiffs()}</div>
                )}
            </div>
        </div>
    )
}
