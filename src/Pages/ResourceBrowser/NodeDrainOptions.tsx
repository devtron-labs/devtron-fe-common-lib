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

import { Checkbox } from '@Common/Checkbox'
import { Tooltip } from '@Common/Tooltip'
import { CHECKBOX_VALUE } from '@Common/Types'
import { ReactComponent as ICTimer } from '@Icons/ic-timer.svg'
import { ChangeEvent, FocusEvent } from 'react'
import { DRAIN_NODE_MODAL_MESSAGING, NODE_DRAIN_OPTIONS_CHECKBOX_CONFIG } from './constants'
import { AdditionalConfirmationModalOptionsProps, NodeDrainRequest } from './types'

const NodeDrainOptions = ({
    optionsData,
    setOptionsData: setNodeDrainOptions,
    children,
}: AdditionalConfirmationModalOptionsProps<NodeDrainRequest['nodeDrainOptions']>) => {
    const nodeDrainOptions: NodeDrainRequest['nodeDrainOptions'] = optionsData ?? {
        gracePeriodSeconds: -1,
        deleteEmptyDirData: false,
        disableEviction: false,
        force: false,
        ignoreAllDaemonSets: false,
    }

    const handleGracePeriodOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNodeDrainOptions({
            ...nodeDrainOptions,
            gracePeriodSeconds: e.target.value ? Number(e.target.value) : -1,
        })
    }

    const handleGracePeriodOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        if (!e.target.value || Number(e.target.value) < -1) {
            e.target.value = '-1'
        }
    }

    const getCheckboxOnChangeHandler =
        (key: keyof NodeDrainRequest['nodeDrainOptions']) => (e: ChangeEvent<HTMLInputElement>) => {
            setNodeDrainOptions({
                ...nodeDrainOptions,
                [key]: e.target.checked,
            })
        }

    return (
        <div className="flexbox-col dc__gap-12 w-100">
            <div>
                <div className="flexbox dc__gap-8 dc__align-items-center px-8 py-2">
                    <ICTimer className="icon-dim-20 dc__no-shrink scn-7" />
                    <Tooltip content={DRAIN_NODE_MODAL_MESSAGING.GracePeriod.infoText} alwaysShowTippyOnHover>
                        <span className="fs-13 cn-9 lh-20 dc__underline-dotted">Grace period</span>
                    </Tooltip>
                    <span className="flex left dc__border br-4 cn-9 fw-4 fs-13 lh-20 dc__overflow-hidden">
                        <input
                            name="grace-period"
                            type="number"
                            autoComplete="off"
                            min={-1}
                            defaultValue={nodeDrainOptions.gracePeriodSeconds}
                            className="px-8 py-4 lh-20 w-60 dc__no-border"
                            onChange={handleGracePeriodOnChange}
                            onBlur={handleGracePeriodOnBlur}
                        />
                        <span className="flex px-8 py-4 dc__border--left">sec</span>
                    </span>
                </div>

                {NODE_DRAIN_OPTIONS_CHECKBOX_CONFIG.map(({ key, infoText, label }) => (
                    <Checkbox
                        key={key}
                        value={CHECKBOX_VALUE.CHECKED}
                        isChecked={nodeDrainOptions[key]}
                        dataTestId="disable-eviction"
                        rootClassName="mt-0 mb-0 ml-8 mr-8 cn-9 fs-13 py-6 px-8 form__checkbox__root--gap-8"
                        onChange={getCheckboxOnChangeHandler(key)}
                    >
                        <Tooltip content={infoText} alwaysShowTippyOnHover>
                            <span className="dc__underline-dotted">{label}</span>
                        </Tooltip>
                    </Checkbox>
                ))}
            </div>

            {children}
        </div>
    )
}

export default NodeDrainOptions
