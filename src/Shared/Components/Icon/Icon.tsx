// NOTE: This file is auto-generated. Do not edit directly. Run the script `npm run generate-icon` to update.

import { ReactComponent as ICAborted } from '@IconsV2/ic-aborted.svg'
import { ReactComponent as ICBitbucket } from '@IconsV2/ic-bitbucket.svg'
import { ReactComponent as ICBuildColor } from '@IconsV2/ic-build-color.svg'
import { ReactComponent as ICCancelled } from '@IconsV2/ic-cancelled.svg'
import { ReactComponent as ICCd } from '@IconsV2/ic-cd.svg'
import { ReactComponent as ICCiLinked } from '@IconsV2/ic-ci-linked.svg'
import { ReactComponent as ICCiWebhook } from '@IconsV2/ic-ci-webhook.svg'
import { ReactComponent as ICCircleLoader } from '@IconsV2/ic-circle-loader.svg'
import { ReactComponent as ICClock } from '@IconsV2/ic-clock.svg'
import { ReactComponent as ICCloseSmall } from '@IconsV2/ic-close-small.svg'
import { ReactComponent as ICEnv } from '@IconsV2/ic-env.svg'
import { ReactComponent as ICError } from '@IconsV2/ic-error.svg'
import { ReactComponent as ICFailure } from '@IconsV2/ic-failure.svg'
import { ReactComponent as ICGit } from '@IconsV2/ic-git.svg'
import { ReactComponent as ICGithub } from '@IconsV2/ic-github.svg'
import { ReactComponent as ICGitlab } from '@IconsV2/ic-gitlab.svg'
import { ReactComponent as ICHeartGreen } from '@IconsV2/ic-heart-green.svg'
import { ReactComponent as ICHeartRedAnimated } from '@IconsV2/ic-heart-red-animated.svg'
import { ReactComponent as ICHeartRed } from '@IconsV2/ic-heart-red.svg'
import { ReactComponent as ICHibernate } from '@IconsV2/ic-hibernate.svg'
import { ReactComponent as ICInfoOutline } from '@IconsV2/ic-info-outline.svg'
import { ReactComponent as ICJobColor } from '@IconsV2/ic-job-color.svg'
import { ReactComponent as ICMissing } from '@IconsV2/ic-missing.svg'
import { ReactComponent as ICNodeScript } from '@IconsV2/ic-node-script.svg'
import { ReactComponent as ICOpenInNew } from '@IconsV2/ic-open-in-new.svg'
import { ReactComponent as ICOutOfSync } from '@IconsV2/ic-out-of-sync.svg'
import { ReactComponent as ICPaperPlaneColor } from '@IconsV2/ic-paper-plane-color.svg'
import { ReactComponent as ICSuccess } from '@IconsV2/ic-success.svg'
import { ReactComponent as ICSuspended } from '@IconsV2/ic-suspended.svg'
import { ReactComponent as ICTimeoutTwoDash } from '@IconsV2/ic-timeout-two-dash.svg'
import { ReactComponent as ICUnknown } from '@IconsV2/ic-unknown.svg'

// eslint-disable-next-line no-restricted-imports
import { IconBase } from './IconBase'
import { IconBaseProps } from './types'

export const iconMap = {
    'ic-aborted': ICAborted,
    'ic-bitbucket': ICBitbucket,
    'ic-build-color': ICBuildColor,
    'ic-cancelled': ICCancelled,
    'ic-cd': ICCd,
    'ic-ci-linked': ICCiLinked,
    'ic-ci-webhook': ICCiWebhook,
    'ic-circle-loader': ICCircleLoader,
    'ic-clock': ICClock,
    'ic-close-small': ICCloseSmall,
    'ic-env': ICEnv,
    'ic-error': ICError,
    'ic-failure': ICFailure,
    'ic-git': ICGit,
    'ic-github': ICGithub,
    'ic-gitlab': ICGitlab,
    'ic-heart-green': ICHeartGreen,
    'ic-heart-red-animated': ICHeartRedAnimated,
    'ic-heart-red': ICHeartRed,
    'ic-hibernate': ICHibernate,
    'ic-info-outline': ICInfoOutline,
    'ic-job-color': ICJobColor,
    'ic-missing': ICMissing,
    'ic-node-script': ICNodeScript,
    'ic-open-in-new': ICOpenInNew,
    'ic-out-of-sync': ICOutOfSync,
    'ic-paper-plane-color': ICPaperPlaneColor,
    'ic-success': ICSuccess,
    'ic-suspended': ICSuspended,
    'ic-timeout-two-dash': ICTimeoutTwoDash,
    'ic-unknown': ICUnknown,
}

export type IconName = keyof typeof iconMap

export interface IconsProps extends Omit<IconBaseProps, 'name' | 'iconMap'> {
    /** The name of the icon to render. */
    name: keyof typeof iconMap
}

export const Icon = (props: IconsProps) => <IconBase {...props} iconMap={iconMap} />
