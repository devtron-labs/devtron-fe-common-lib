// NOTE: This file is auto-generated. Do not edit directly. Run the script `npm run generate-icon` to update.

import { ReactComponent as ICAborted } from '@IconsV2/ic-aborted.svg'
import { ReactComponent as ICCancelled } from '@IconsV2/ic-cancelled.svg'
import { ReactComponent as ICCircleLoader } from '@IconsV2/ic-circle-loader.svg'
import { ReactComponent as ICClock } from '@IconsV2/ic-clock.svg'
import { ReactComponent as ICCloseSmall } from '@IconsV2/ic-close-small.svg'
import { ReactComponent as ICError } from '@IconsV2/ic-error.svg'
import { ReactComponent as ICFailure } from '@IconsV2/ic-failure.svg'
import { ReactComponent as ICHeartGreen } from '@IconsV2/ic-heart-green.svg'
import { ReactComponent as ICHeartRedAnimated } from '@IconsV2/ic-heart-red-animated.svg'
import { ReactComponent as ICHeartRed } from '@IconsV2/ic-heart-red.svg'
import { ReactComponent as ICHibernate } from '@IconsV2/ic-hibernate.svg'
import { ReactComponent as ICInfoOutline } from '@IconsV2/ic-info-outline.svg'
import { ReactComponent as ICMissing } from '@IconsV2/ic-missing.svg'
import { ReactComponent as ICOutOfSync } from '@IconsV2/ic-out-of-sync.svg'
import { ReactComponent as ICSuccess } from '@IconsV2/ic-success.svg'
import { ReactComponent as ICSuspended } from '@IconsV2/ic-suspended.svg'
import { ReactComponent as ICTimeoutTwoDash } from '@IconsV2/ic-timeout-two-dash.svg'
import { ReactComponent as ICUnknown } from '@IconsV2/ic-unknown.svg'

// eslint-disable-next-line no-restricted-imports
import { IconBase } from './IconBase'
import { IconBaseProps } from './types'

export const iconMap = {
    'ic-aborted': ICAborted,
    'ic-cancelled': ICCancelled,
    'ic-circle-loader': ICCircleLoader,
    'ic-clock': ICClock,
    'ic-close-small': ICCloseSmall,
    'ic-error': ICError,
    'ic-failure': ICFailure,
    'ic-heart-green': ICHeartGreen,
    'ic-heart-red-animated': ICHeartRedAnimated,
    'ic-heart-red': ICHeartRed,
    'ic-hibernate': ICHibernate,
    'ic-info-outline': ICInfoOutline,
    'ic-missing': ICMissing,
    'ic-out-of-sync': ICOutOfSync,
    'ic-success': ICSuccess,
    'ic-suspended': ICSuspended,
    'ic-timeout-two-dash': ICTimeoutTwoDash,
    'ic-unknown': ICUnknown,
}

export type IconName = keyof typeof iconMap

export interface IconsProps extends Omit<IconBaseProps, 'name' | 'iconMap'> {
    name: keyof typeof iconMap
}

export const Icon = (props: IconsProps) => <IconBase {...props} iconMap={iconMap} />
