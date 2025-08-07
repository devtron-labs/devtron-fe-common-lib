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

import { ConditionalWrap } from '@Common/Helper'
import { useIsTextTruncated } from '@Common/Hooks'
import { Tooltip, TooltipProps } from '@Common/Tooltip'

import { Icon } from '../Icon'
import { TreeViewNodeContentProps } from './types'

const wrapWithTooltip =
    (customTooltipConfig: TooltipProps, isTextTruncated: boolean, title: string, subtitle: string) =>
    (children: TooltipProps['children']) => {
        if (customTooltipConfig) {
            return <Tooltip {...customTooltipConfig}>{children}</Tooltip>
        }

        if (isTextTruncated) {
            return (
                <Tooltip
                    alwaysShowTippyOnHover
                    className="mxh-250 dc__overflow-auto mr-42"
                    placement="left"
                    content={
                        <div className="flexbox-col dc__gap-2 dc__overflow-auto">
                            <h6
                                className={`m-0 fs-12 ${subtitle ? 'fw-6' : 'fw-4'} lh-18 dc__word-break dc__align-left`}
                            >
                                {title}
                            </h6>
                            {subtitle && (
                                <p className="m-0 fs-12 fw-4 lh-18 dc__word-break dc__align-left">{subtitle}</p>
                            )}
                        </div>
                    }
                    interactive
                >
                    {children}
                </Tooltip>
            )
        }

        return children
    }

const TreeViewNodeContent = ({
    startIconConfig,
    title,
    subtitle,
    type,
    customTooltipConfig,
    strikeThrough,
    isSelected,
}: TreeViewNodeContentProps) => {
    const { isTextTruncated: isTitleTruncate, handleMouseEnterEvent: handleTitleMouseEnter } = useIsTextTruncated()
    const { isTextTruncated: isSubtitleTruncate, handleMouseEnterEvent: handleSubtitleMouseEnter } =
        useIsTextTruncated()

    const isTextTruncated = isTitleTruncate || isSubtitleTruncate

    return (
        <span className="flexbox flex-grow-1 px-8 py-6 flexbox dc__gap-8 dc__align-start">
            {startIconConfig && (
                <Tooltip
                    alwaysShowTippyOnHover={!!startIconConfig.tooltipContent}
                    content={startIconConfig.tooltipContent}
                >
                    {startIconConfig.customIcon || (
                        <Icon name={startIconConfig.name} color={startIconConfig.color} size={16} />
                    )}
                </Tooltip>
            )}

            <ConditionalWrap
                wrap={wrapWithTooltip(customTooltipConfig, isTextTruncated, title, subtitle)}
                condition={!!customTooltipConfig || isTextTruncated}
            >
                <span className="flexbox-col tree-view__container--title-wrapper">
                    <span
                        className={`tree-view__container--title dc__truncate dc__align-left cn-9 fs-13 lh-1-5 ${type === 'heading' || isSelected ? 'fw-6' : 'fw-4'} ${customTooltipConfig && type === 'item' ? 'title-with-tooltip' : ''} ${strikeThrough ? 'dc__strike-through' : ''}`}
                        onMouseEnter={handleTitleMouseEnter}
                    >
                        {title}
                    </span>
                    {subtitle && (
                        <span
                            className="dc__align-left dc__truncate cn-7 fs-12 fw-4 lh-1-5"
                            onMouseEnter={handleSubtitleMouseEnter}
                        >
                            {subtitle}
                        </span>
                    )}
                </span>
            </ConditionalWrap>
        </span>
    )
}

export default TreeViewNodeContent
