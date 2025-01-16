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

import { ComponentSizeType } from '@Shared/constants'
import StyledRadioGroup from '../RadioGroup/RadioGroup'
import { SegmentedControlProps, SegmentedControlVariant } from './types'
import { SEGMENTED_CONTROL_SIZE_TO_CLASS_MAP } from './constants'

const SegmentedControl = ({
    tabs,
    initialTab,
    onChange,
    tooltips,
    disabled = false,
    rootClassName = '',
    name,
    variant = SegmentedControlVariant.WHITE_ON_GRAY,
    size = ComponentSizeType.medium,
}: SegmentedControlProps) => (
    <StyledRadioGroup
        className={`${variant} ${SEGMENTED_CONTROL_SIZE_TO_CLASS_MAP[size]} ${rootClassName}`}
        onChange={onChange}
        initialTab={initialTab}
        name={name}
        disabled={disabled}
    >
        {tabs.map((tab, index) => (
            <StyledRadioGroup.Radio
                value={tab.value}
                key={tab.value}
                className="fs-12 cn-7 fw-6 lh-20"
                showTippy={!!tooltips?.[index]}
                tippyContent={tooltips?.[index] ?? ''}
                dataTestId={`${name}-${tab.value}`}
            >
                {tab.label}
            </StyledRadioGroup.Radio>
        ))}
    </StyledRadioGroup>
)

export default SegmentedControl
