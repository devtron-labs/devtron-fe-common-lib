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

interface LoadingCardType {
    wider?: boolean
}

const LoadingCard = ({ wider }: LoadingCardType) => (
    <div
        className={`flexbox-col ${wider ? 'w-250' : 'w-200'} bg__primary border__secondary-translucent br-8 shadow__card--10`}
    >
        <div className="flexbox-col dc__gap-8 px-12 pt-12 pb-8">
            <span className="w-60 h-14 shimmer" />
            <span className="w-120 h-18 shimmer" />
        </div>
        <div className="flexbox px-12 py-10 border__secondary--top">
            <span className="w-44 h-14 shimmer" />
        </div>
    </div>
)

export default LoadingCard
