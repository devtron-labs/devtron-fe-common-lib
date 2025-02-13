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

import { ReactComponent as ICHelpOutline } from '@Icons/ic-help-outline.svg'
import { ReactComponent as ICHelp } from '@Icons/ic-help.svg'
import { TippyCustomized } from '@Common/TippyCustomized'
import { TippyTheme } from '@Common/Types'
import { ConditionalWrap } from '@Common/Helper'
import { ReactElement } from 'react'
import { Tooltip, TooltipProps } from '@Common/Tooltip'
import { getFormLabelElementId } from './utils'
import { FormFieldLabelProps } from './types'

const FormFieldLabel = ({
    label,
    inputId,
    required,
    layout,
    labelTooltipConfig,
    labelTippyCustomizedConfig,
}: FormFieldLabelProps) => {
    if (!label) {
        return null
    }

    const labelId = getFormLabelElementId(inputId)
    const isRowLayout = layout === 'row'
    const showTooltip = isRowLayout && !!labelTooltipConfig?.content

    const wrapWithTooltip = (children: ReactElement) => (
        <Tooltip
            {...({
                placement: 'bottom',
                alwaysShowTippyOnHover: true,
                ...labelTooltipConfig,
            } as TooltipProps)}
        >
            {children}
        </Tooltip>
    )

    return (
        <div className="flex left dc__gap-4">
            <div className={`flex left ${required ? 'dc__required-field' : ''}`}>
                <ConditionalWrap condition={showTooltip} wrap={wrapWithTooltip}>
                    <label
                        className={`fs-13 lh-20 fw-4 dc__block mb-0 cursor ${isRowLayout ? `cn-9 ${showTooltip ? 'dc__underline-dotted' : ''}` : 'cn-7'}`}
                        htmlFor={inputId}
                        id={labelId}
                        data-testid={labelId}
                    >
                        {typeof label === 'string' ? (
                            <span className="flex left">
                                <span className="dc__truncate">{label}</span>
                            </span>
                        ) : (
                            label
                        )}
                    </label>
                </ConditionalWrap>
                {required && <span>&nbsp;</span>}
            </div>
            {!isRowLayout && labelTippyCustomizedConfig && (
                <TippyCustomized
                    theme={TippyTheme.white}
                    className="w-300 dc__align-left"
                    placement="bottom-start"
                    Icon={ICHelp}
                    iconClass="fcv-5"
                    showCloseButton
                    trigger="click"
                    interactive
                    {...labelTippyCustomizedConfig}
                >
                    <div className="flex cursor">
                        <ICHelpOutline className="fcn-7 icon-dim-16 dc__no-shrink" />
                    </div>
                </TippyCustomized>
            )}
        </div>
    )
}

export default FormFieldLabel
