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
import { InvalidYAMLTippyWrapperProps } from './types'
import { getInvalidTippyContent } from './utils'

const InvalidYAMLTippy = ({ parsingError, restoreLastSavedYAML, children }: InvalidYAMLTippyWrapperProps) => (
    <Tooltip
        alwaysShowTippyOnHover
        interactive
        content={getInvalidTippyContent({
            parsingError,
            restoreLastSavedYAML,
        })}
    >
        {children}
    </Tooltip>
)

const InvalidYAMLTippyWrapper = ({ parsingError, restoreLastSavedYAML, children }: InvalidYAMLTippyWrapperProps) => {
    if (parsingError) {
        return (
            <InvalidYAMLTippy parsingError={parsingError} restoreLastSavedYAML={restoreLastSavedYAML}>
                {children}
            </InvalidYAMLTippy>
        )
    }

    return children
}

export default InvalidYAMLTippyWrapper
