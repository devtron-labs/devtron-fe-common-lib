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

import { InfoBlock } from '../InfoBlock'

export const renderHashiOrAwsDeprecatedInfo = () => (
    <InfoBlock
        description={
            <p className="m-0 cn-9 fs-13 lh-20">
                <span>
                    Kubernetes External Secret (KES) has been deprecated and will be removed in the next Devtron
                    version. You can delete this file and create a secret using
                </span>
                &nbsp;
                <a
                    className="anchor"
                    href="https://github.com/external-secrets/external-secrets"
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    External Secret Operator (ESO).
                </a>
            </p>
        }
        variant="warning"
    />
)
