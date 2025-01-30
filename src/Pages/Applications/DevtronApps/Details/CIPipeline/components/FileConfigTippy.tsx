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

import Tippy from '@tippyjs/react'

import { ReactComponent as ICInfoOutline } from '@Icons/ic-info-outline.svg'
import { VariableType } from '@Common/CIPipeline.Types'

export const FileConfigTippy = ({ fileMountDir }: Pick<VariableType, 'fileMountDir'>) => (
    <Tippy
        trigger="click"
        arrow={false}
        className="default-tt w-200"
        content={
            <div className="fs-12 lh-18 flexbox-col dc__gap-2 mw-none">
                <p className="m-0 fw-6">File mount path</p>
                <p className="m-0 flexbox-col flex-nowrap dc__word-break">
                    {fileMountDir}
                    <br />
                    <br />
                    Ensure the uploaded file name is unique to avoid conflicts or overrides.
                </p>
            </div>
        }
    >
        <div className="cursor flex dc__no-shrink">
            <ICInfoOutline className="icon-dim-18" />
        </div>
    </Tippy>
)
