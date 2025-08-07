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

import { Icon } from '../Icon'
import { TestimonialCardConfig } from './types'

const TestimonialContent = ({ quote, name, designation, iconName }: TestimonialCardConfig) => (
    <>
        <p className="fs-14 fw-4 lh-1-5 cn-9 dc__truncate--clamp-4 m-0">{quote}&quot;</p>
        <div className="flex dc__content-space">
            <div>
                <span className="fs-13 fw-6 lh-1-5 cn-9">{name}</span>
                <span className="fs-12 fw-4 lh-1-5 cn-7 dc__truncate">{designation}</span>
            </div>
            {iconName && (
                <div className="dc__fill-available-space w-auto-imp h-36">
                    <Icon name={iconName} color="N900" />
                </div>
            )}
        </div>
    </>
)

export default TestimonialContent
