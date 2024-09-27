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

import { components } from 'react-select'

export const Option = (props: any) => {
    const {
        isSelected,
        data: { status, author, runSource, renderRunSource, resourceId },
        label,
    } = props
    return (
        <components.Option {...props}>
            <div className={`flex dc__align-start left pt-8 pb-8 pl-8 pr-8 ${isSelected ? 'bcb-1' : ''}`}>
                <div
                    className={`flexbox dc__align-items-start dc__app-summary__icon icon-dim-22 ${status
                        .toLocaleLowerCase()
                        .replace(/\s+/g, '')} mr-8`}
                />
                <div className="flexbox-col dc__gap-8">
                    <div>
                        <div className="cn-9 fs-13"> {label}</div>
                        <div className="cn-7 flex left">
                            <span className="dc__capitalize">Deploy</span>&nbsp;
                            <div className="dc__bullet ml-4 dc__bullet--d2 mr-4" />
                            &nbsp;
                            {author === 'system' ? 'auto-triggered' : author}
                        </div>
                    </div>
                    {runSource && renderRunSource && renderRunSource(runSource, resourceId === runSource.id)}
                </div>
            </div>
        </components.Option>
    )
}
