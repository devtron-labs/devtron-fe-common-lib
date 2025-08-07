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

import RadioGroup from '@Common/RadioGroup'
import RadioGroupItem from '@Common/RadioGroupItem'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { Popover, usePopover, UsePopoverProps } from '../Popover'
import { DeploymentConfigDiffRadioSelectConfig } from './DeploymentConfigDiff.types'

import './DeploymentConfigDiff.scss'

const DeploymentConfigDiffRadioSelect = ({
    radioSelectConfig,
    position = 'bottom',
}: {
    radioSelectConfig: DeploymentConfigDiffRadioSelectConfig
    position?: UsePopoverProps['position']
}) => {
    const { open, closePopover, overlayProps, popoverProps, triggerProps, scrollableRef } = usePopover({
        id: 'deployment-config',
        width: 300,
        position,
        variant: 'overlay',
    })

    const { triggerElementTitle, radioGroupConfig } = radioSelectConfig

    const renderTriggerElement = () => (
        <div className="flex dc__content-space dc__gap-8">
            <span className="fs-13 cn-9 fw-6 lh-20 dc__mxw-250 dc__truncate">{triggerElementTitle}</span>
            <Icon name="ic-caret-left" color={null} size={20} rotateBy={open ? 90 : -90} />
        </div>
    )

    return (
        <Popover
            open={open}
            triggerElement={renderTriggerElement()}
            buttonProps={null}
            popoverProps={popoverProps}
            overlayProps={overlayProps}
            triggerProps={triggerProps}
        >
            {/* TODO: Remove any after syncing with develop */}
            <div className="flexbox-col dc__overflow-auto" ref={scrollableRef as any}>
                <div className="p-12 flexbox dc__content-space border__primary--bottom">
                    <span className="fs-13 fw-6 lh-20 cn-9">Deployment with Configuration</span>
                    <Button
                        dataTestId="close-config-popup"
                        icon={<Icon name="ic-close-small" color={null} />}
                        showAriaLabelInTippy={false}
                        ariaLabel="close button"
                        style={ButtonStyleType.negativeGrey}
                        variant={ButtonVariantType.borderLess}
                        size={ComponentSizeType.xxs}
                        onClick={closePopover}
                    />
                </div>
                <div className="flexbox-col dc__gap-12 p-12 config-strategy-radio">
                    {radioGroupConfig.map(({ name, title, options, groupValue, onChange }) => (
                        <div className="flexbox-col dc__gap-6">
                            <span className="fs-13 fw-6 lh-20 cn-9">{title}</span>
                            <RadioGroup
                                className="flexbox-col dc__no-border-imp"
                                name={name}
                                value={groupValue}
                                onChange={onChange}
                            >
                                {options.map(({ label, value, description }) => (
                                    <RadioGroupItem value={value}>
                                        <div className="flexbox-col">
                                            <span>{label}</span>
                                            <span className="fs-12 fw-4 lh-18 cn-7">{description}</span>
                                        </div>
                                    </RadioGroupItem>
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
                </div>
            </div>
        </Popover>
    )
}

export default DeploymentConfigDiffRadioSelect
