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

import { OverrideStrategyTippyContentProps } from './types'

const OverrideStrategyTippyContent = ({ children }: OverrideStrategyTippyContentProps) => (
    <div className="p-12 flexbox-col dc__gap-20">
        <p className="m-0 fs-13 lh-20 cn-9 fw-4">
            Merge strategy determines how environment configurations are combined with inherited configurations
            configurations. Choose the strategy that best suits your needs:
        </p>

        <ul className="pl-12 m-0-imp">
            {children}

            <li className="m-0 fs-13 lh-20 cn-9 fw-4">
                <strong className="m-0 fw-6">Replace:</strong>&nbsp;Overwrites inherited values with
                environment-specific ones. Use when you want to completely change inherited settings.
            </li>
        </ul>
    </div>
)

export default OverrideStrategyTippyContent
