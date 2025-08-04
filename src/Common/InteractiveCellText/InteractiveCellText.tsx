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

import { Tooltip } from '@Common/Tooltip'

import { InteractiveCellTextProps } from './types'
/**
 * A reusable component for rendering text within a tooltip. The text can be interactive (clickable) or static.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.text - The text to display inside the component. Defaults to `'-'` if not provided.
 * @param {function} [props.onClickHandler] - Optional click handler function. If provided, the text will be rendered as a button.
 * @param {string} [props.dataTestId] - Optional test ID for the component, useful for testing purposes.
 * @param {string} [props.rootClassName] - Additional CSS class names to apply to the root element.
 * @param {boolean} [props.interactive=false] - Whether the tooltip content is interactive.
 * @param {number} [props.fontSize=13] - Font size for the text. Defaults to `13`.
 * @param {React.ReactNode} [props.tippyContent=null] - Custom content for the tooltip. If not provided, `text` will be used.
 * @returns {JSX.Element} The rendered `InteractiveCellText` component.
 *
 * @example
 * // Example usage:
 * <InteractiveCellText
 *     text="Click me"
 *     onClickHandler={() => alert('Clicked!')}
 *     dataTestId="interactive-cell"
 *     rootClassName="custom-class"
 *     interactive={true}
 *     fontSize={14}
 *     tippyContent="Tooltip content"
 * />
 */

export const InteractiveCellText = ({
    text,
    onClickHandler,
    dataTestId,
    rootClassName,
    interactive = false,
    fontSize = 13,
    tippyContent = null,
}: InteractiveCellTextProps) => (
    <Tooltip
        content={tippyContent || text}
        placement="bottom"
        className="mxh-210 dc__overflow-auto dc__word-break"
        interactive={interactive}
    >
        {typeof onClickHandler === 'function' ? (
            <button
                type="button"
                onClick={onClickHandler}
                className={`flex left dc__unset-button-styles lh-20 dc__truncate cb-5 dc__no-decor cursor ${rootClassName} fs-${fontSize}`}
                data-testid={dataTestId}
            >
                {text || '-'}
            </button>
        ) : (
            <p
                className={`lh-20 dc__truncate m-0 dc__align-item-left ${rootClassName} fs-${fontSize}`}
                data-testid={dataTestId}
            >
                {text || '-'}
            </p>
        )}
    </Tooltip>
)
