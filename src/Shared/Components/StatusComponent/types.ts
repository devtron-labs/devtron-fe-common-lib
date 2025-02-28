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

import { IconsProps } from '../Icon'

export enum StatusType {
    QUEUED = 'QUEUED',
    FAILED = 'FAILED',
    ERROR = 'ERROR',
    CANCELLED = 'CANCELLED',
    ABORTED = 'ABORTED',
    HEALTHY = 'HEALTHY',
    SUCCEEDED = 'SUCCEEDED',
    DRIFTED = 'DRIFTED',
    MISSING = 'MISSING',
    UNKNOWN = 'UNKNOWN',
    NOT_DEPLOYED = 'NOT-DEPLOYED',
    SUSPENDED = 'SUSPENDED',
    DEGRADED = 'DEGRADED',
    PROGRESSING = 'PROGRESSING',
    INPROGRESS = 'INPROGRESS',
    HIBERNATING = 'HIBERNATING',
    TIMED_OUT = 'TIMED_OUT',
}

export interface StatusComponentProps {
    /** The status to display, either a predefined StatusType or a custom string. */
    status: StatusType | string
    /** A custom message to display instead of the status. If not provided, the status is shown. */
    message?: string
    /** If true, hides the status icon. */
    hideIcon?: boolean
    /**
     * If true, hides the status message and displays it in a tooltip instead.
     * @default false
     */
    hideMessage?: boolean
    /** Size of the status icon. */
    iconSize?: IconsProps['size']
    /** If true, displays an animated version of the icon (if available). */
    showAnimatedIcon?: boolean
    /**
     * If true, hides the tooltip on the status icon.
     * @note Tooltip is only shown when `hideMessage` is true.
     */
    hideIconTooltip?: boolean
}

export interface AppStatusProps extends Omit<StatusComponentProps, 'statusMessage'> {
    isJobView?: boolean
    isVirtualEnv?: boolean
}

export interface DeploymentStatusProps extends Omit<AppStatusProps, 'isJobView'> {}
