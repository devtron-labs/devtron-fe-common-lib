// NOTE: This file is auto-generated. Do not edit directly. Run the script `npm run generate-illustration` to update.

import CreateBackupSchedule from '@Illustrations/create-backup-schedule.webp'
import CreateBackupSnapshot from '@Illustrations/create-backup-snapshot.webp'
import EmptyStateKey from '@Illustrations/empty-state-key.svg?react'
import ImgCelebration from '@Illustrations/img-celebration.svg?react'
import ImgCode from '@Illustrations/img-code.webp'
import ImgDevtronFreemium from '@Illustrations/img-devtron-freemium.webp'
import ImgFolderEmpty from '@Illustrations/img-folder-empty.svg?react'
import ImgInstallFreemiumSaas from '@Illustrations/img-install-freemium-saas.svg?react'
import ImgInstallViaAwsMarketplace from '@Illustrations/img-install-via-aws-marketplace.svg?react'
import ImgInstallingDevtron from '@Illustrations/img-installing-devtron.svg?react'
import ImgManOnRocket from '@Illustrations/img-man-on-rocket.webp'
import ImgMechanicalOperation from '@Illustrations/img-mechanical-operation.svg?react'
import ImgNoBackupLocation from '@Illustrations/img-no-backup-location.svg?react'
import ImgNoRestores from '@Illustrations/img-no-restores.svg?react'
import ImgNoResult from '@Illustrations/img-no-result.webp'
import ImgPageNotFound from '@Illustrations/img-page-not-found.svg?react'
import NoClusterCostEnabled from '@Illustrations/no-cluster-cost-enabled.webp'

// eslint-disable-next-line no-restricted-imports
import { IllustrationBase } from './IllustrationBase'
import { IllustrationBaseProps } from './types'

export const illustrationMap = {
    'empty-state-key': EmptyStateKey,
    'img-celebration': ImgCelebration,
    'img-folder-empty': ImgFolderEmpty,
    'img-install-freemium-saas': ImgInstallFreemiumSaas,
    'img-install-via-aws-marketplace': ImgInstallViaAwsMarketplace,
    'img-installing-devtron': ImgInstallingDevtron,
    'img-mechanical-operation': ImgMechanicalOperation,
    'img-no-backup-location': ImgNoBackupLocation,
    'img-no-restores': ImgNoRestores,
    'img-page-not-found': ImgPageNotFound,
    'create-backup-schedule': CreateBackupSchedule,
    'create-backup-snapshot': CreateBackupSnapshot,
    'img-code': ImgCode,
    'img-devtron-freemium': ImgDevtronFreemium,
    'img-man-on-rocket': ImgManOnRocket,
    'img-no-result': ImgNoResult,
    'no-cluster-cost-enabled': NoClusterCostEnabled,
}

export type IllustrationName = keyof typeof illustrationMap

export interface IllustrationProps extends Omit<IllustrationBaseProps, 'name' | 'illustrationMap'> {
    /**
     * The name of the illustration to render.
     * @note The component will return either an img component or an SVG component based on the type of illustration (.svg, .webp)
     */
    name: keyof typeof illustrationMap
}

export const Illustration = (props: IllustrationProps) => (
    <IllustrationBase {...props} illustrationMap={illustrationMap} />
)
