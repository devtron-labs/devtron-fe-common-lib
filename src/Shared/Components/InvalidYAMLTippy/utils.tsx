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

import { ReactComponent as ICArrowCounterClockwise } from '@Icons/ic-arrow-counter-clockwise.svg'
import { DEFAULT_INVALID_YAML_ERROR } from './constants'
import { InvalidTippyProps, InvalidTippyTypeEnum } from './types'

export const getInvalidTippyContent = ({
    type = InvalidTippyTypeEnum.YAML,
    parsingError,
    restoreLastSavedYAML,
}: InvalidTippyProps) => {
    const text = type.toUpperCase()

    return (
        <div className="flexbox-col dc__gap-8 py-6">
            <div className="flexbox-col dc__gap-4">
                <h6 className="m-0 fs-12 fw-6 lh-18">Invalid {text}</h6>
                <p className="m-0 cn-50 fs-12 fw-4 lh-18 dc__truncate--clamp-3">
                    {parsingError || DEFAULT_INVALID_YAML_ERROR}
                </p>
            </div>

            {restoreLastSavedYAML && (
                <button
                    type="button"
                    data-testid="restore-last-saved-yaml"
                    className="flexbox dc__gap-6 dc__transparent cn-0 fs-12 fw-6 lh-20 p-0 dc__align-items-center"
                    onClick={restoreLastSavedYAML}
                >
                    <ICArrowCounterClockwise className="dc__no-shrink icon-dim-16 scn-0" />
                    Restore last saved {text}
                </button>
            )}
        </div>
    )
}
