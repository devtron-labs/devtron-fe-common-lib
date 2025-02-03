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

import React from 'react'
import { ReactComponent as ICScanFallback } from '@Icons/ic-scan-fallback.svg'
import { ScannedByToolModalProps } from './types'
import { ImageWithFallback } from '../ImageWithFallback'

const ScannedByToolModal: React.FC<ScannedByToolModalProps> = ({
    scanToolName,
    scanToolUrl,
    fontSize = 13,
    spacingBetweenTextAndIcon = 6,
}) => (
    <div className="flexbox" style={{ gap: `${spacingBetweenTextAndIcon}px` }}>
        <span className={`dc__italic-font-style fs-${fontSize}`}>
            Scanned by
            <span className="fw-6 ml-4" data-testid="scanned-by-tool">
                {scanToolName}
            </span>
        </span>
        <ImageWithFallback
            imageProps={{
                src: scanToolUrl,
                className: 'icon-dim-20-imp',
                alt: 'scan-tool',
            }}
            fallbackImage={<ICScanFallback className="icon-dim-20-imp dc__no-shrink" />}
        />
    </div>
)

export default ScannedByToolModal
