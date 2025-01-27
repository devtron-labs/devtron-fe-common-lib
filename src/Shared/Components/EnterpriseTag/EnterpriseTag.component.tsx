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

import { ReactComponent as ICMedal } from '@Icons/ic-medal.svg'

const EnterpriseTag = () => (
    <div className="px-4 py-2 flex dc__gap-2 br-4 ey-2 bcy-1 dc__no-shrink">
        <ICMedal className="icon-dim-12 dc__no-shrink scy-7" />
        <span className="cy-7 fs-11 fw-6 lh-16">Enterprise</span>
    </div>
)

export default EnterpriseTag
