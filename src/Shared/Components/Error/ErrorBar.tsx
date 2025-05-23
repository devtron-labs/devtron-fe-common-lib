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

import { NavLink } from 'react-router-dom'

import { ReactComponent as ErrorInfo } from '../../../Assets/Icon/ic-errorInfo.svg'
import { DISCORD_LINK, URLS } from '../../../Common'
import { AppType } from '../../types'
import { ErrorBarType } from './types'
import { getIsImagePullBackOff, renderErrorHeaderMessage } from './utils'

const ErrorBar = ({ appDetails, useParentMargin = true }: ErrorBarType) => {
    if (
        !appDetails ||
        appDetails.appType !== AppType.DEVTRON_APP ||
        !appDetails.resourceTree ||
        !appDetails.resourceTree.nodes ||
        appDetails.externalCi
    ) {
        return null
    }

    const isImagePullBackOff = getIsImagePullBackOff(appDetails)

    return (
        isImagePullBackOff && (
            <div className={`er-2 bw-1 br-4 ${useParentMargin ? 'm-20' : ''} fs-13`}>
                <div className="bcr-1 pl-12 pr-12 pt-8 pb-8 dc__border-bottom-r2 flex left dc__top-radius-4">
                    <ErrorInfo className="icon-dim-24 mr-8" /> <span className="mr-8">IMAGEPULLBACKOFF:</span>
                    {renderErrorHeaderMessage(appDetails, 'error-bar')}
                </div>
                {!appDetails.ipsAccessProvided ? (
                    <div className="pl-12 pr-12 pt-8 pb-8">
                        <div className="fw-6">How to resolve? </div>
                        <div className="flex left">
                            1. Allow &apos;{appDetails.clusterName}&apos; cluster to access credentials for ‘
                            {appDetails.dockerRegistryId}’ registry and deploy again.
                            <br />
                            <NavLink
                                to={`${URLS.GLOBAL_CONFIG_DOCKER}/${appDetails.dockerRegistryId}`}
                                className="cb-5 fs-13 anchor w-auto dc__no-decor flex ml-8"
                            >
                                Manage access&nbsp;&nbsp;
                            </NavLink>
                        </div>
                        2. Redeploy the application after allowing access
                        <span className="flex left">
                            {/* Will add document link once available */}
                            {/* <NavLink
                                to={`${URLS.STACK_MANAGER_DISCOVER_MODULES_DETAILS}`}
                                className="cb-5 fs-13 anchor w-auto dc__no-decor flex ml-8"
                                target="_blank"
                            >
                                View Documentation&nbsp;
                            </NavLink> */}
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="pl-12 pr-12 pt-8 pb-8">
                            <div className="fw-6">Possible issues? </div>
                            1. Provided credentials may not have permission to pull image from ‘
                            {appDetails.dockerRegistryId}’ registry. <br />
                            2. Provided credentials may be invalid.
                        </div>
                        <div className="pl-12 pr-12 pt-8 pb-8" style={{ background: 'var(--bg-secondary)' }}>
                            <div className="flex left">
                                <span className="mr-8 fw-6">Already provided permission?</span>
                                Redeploy the application.
                                <NavLink
                                    to={`/app/${appDetails.appId}/${URLS.APP_TRIGGER}`}
                                    className="cb-5 fs-13 anchor w-auto dc__no-decor flex"
                                >
                                    &nbsp; Go to Deploy
                                </NavLink>
                            </div>
                            <div className="flex left">
                                <span className="mr-8 fw-6">Facing issues?</span>
                                <a
                                    href={DISCORD_LINK}
                                    className="cb-5 fs-13 anchor w-auto dc__no-decor flex"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Chat with support
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )
    )
}

export default ErrorBar
