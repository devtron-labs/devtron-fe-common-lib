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

import { InfoIconTippy } from '@Shared/Components/InfoIconTippy'

import { BreadCrumb } from '../../../Common'
import { BUILD_INFRA_TEXT } from './constants'
import { BuildInfraDescriptorProps } from './types'

const Descriptor = ({
    additionalContainerClasses,
    breadCrumbs,
    children,
    tippyInfoText,
    tippyAdditionalContent,
    tooltipNode,
    tooltipHeading,
}: BuildInfraDescriptorProps) => (
    <div className={`flexbox dc__content-space dc__align-items-center w-100 ${additionalContainerClasses ?? ''}`}>
        <div className="flexbox dc__align-items-center dc__gap-4">
            {tooltipNode || (
                <>
                    <BreadCrumb breadcrumbs={breadCrumbs} />
                    <InfoIconTippy
                        infoText={tippyInfoText ?? BUILD_INFRA_TEXT.EDIT_DEFAULT_TOOLTIP}
                        additionalContent={tippyAdditionalContent}
                        heading={tooltipHeading || BUILD_INFRA_TEXT.HEADING}
                        documentationLink="GLOBAL_CONFIG_BUILD_INFRA"
                        documentationLinkText="View Documentation"
                        iconClassName="icon-dim-20 fcn-6"
                    />
                </>
            )}
        </div>

        {children}
    </div>
)

export default Descriptor
