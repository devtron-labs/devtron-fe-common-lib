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

import { Entity } from '@Common/SegmentedBarChart/types'
import { ServerErrors } from '@Common/ServerError'
import { GenericEmptyStateType } from '@Common/Types'
import { LastExecutionResultType, Nodes, NodeType } from '@Shared/types'

import { ScanCategories, ScanSubCategories } from '../types'

export interface GetResourceScanDetailsPayloadType {
    name: string
    namespace: string
    group: string
    version: string
    kind: Nodes | NodeType
    clusterId: number
    appId?: string
    appType?: number
    deploymentType?: number
    isAppDetailView?: boolean
}

export interface ScanResultParamsType {
    appId?: number | string
    envId?: number | string
    installedAppId?: number | string
    artifactId?: number | string
    installedAppVersionHistoryId?: number | string
}

export const CATEGORIES = {
    IMAGE_SCAN: 'imageScan',
    CODE_SCAN: 'codeScan',
    KUBERNETES_MANIFEST: 'kubernetesManifest',
} as const

export const SUB_CATEGORIES = {
    VULNERABILITIES: 'vulnerability',
    LICENSE: 'license',
    MISCONFIGURATIONS: 'misConfigurations',
    EXPOSED_SECRETS: 'exposedSecrets',
} as const

export enum SortOrderEnum {
    'ASC' = 1,
    'DESC' = -1,
}

export type TableRowCellType = {
    component: React.ReactNode | JSX.Element
    cellContent: string | object
}

export type TableHeaderCellType = {
    headerText: string
    isSortable: boolean
    width: number
    compareFunc?: (a: TableRowCellType['cellContent'], b: TableRowCellType['cellContent']) => number
    defaultSortOrder?: SortOrderEnum
}

export interface TableRowType {
    id: string | number
    cells: Array<TableRowCellType>
    expandableComponent: React.ReactNode | JSX.Element
}

export interface TablePropsType {
    headers: Array<TableHeaderCellType>
    rows: Array<TableRowType>
    defaultSortIndex?: number
    hasExpandableRows?: boolean
    /* TODO: a better/more meaningful name? */
    headerTopPosition?: number
}

export type TableSortStateType = {
    index: number
    order: SortOrderEnum
}

export interface StatusType {
    status: 'Completed' | 'Running' | 'Failed' | 'Progressing'
    StartedOn: string
    scanToolName: string
    scanToolUrl: string
}

export interface InfoCardPropsType extends Pick<StatusType, 'scanToolName' | 'scanToolUrl'> {
    entities: NonNullable<Entity[]>
    lastScanTimeString?: string
}

export type DetailViewDataType = {
    titlePrefix: string
    title: string
    status: StatusType['status']
} & TablePropsType &
    InfoCardPropsType

export type SecurityModalStateType = {
    category: ScanCategories
    subCategory: ScanSubCategories
    detailViewData: DetailViewDataType[]
}

export enum SeveritiesDTO {
    CRITICAL = 'critical',
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
    UNKNOWN = 'unknown',
    FAILURES = 'fail',
    SUCCESSES = 'success',
    EXCEPTIONS = 'exceptions',
}

type Summary<T extends 'severities' | 'status'> = Record<T, Partial<Record<SeveritiesDTO, number>>>

type GenericGroupType<T> = {
    list: T[]
}

type GenericGroupTypeWithSummary<T> = {
    summary: Summary<'severities'>
} & GenericGroupType<T>

type GenericGroupTypeWithMisConfSummary<T> = {
    misConfSummary: Summary<'status'>
} & GenericGroupType<T>

export interface CodeScanVulnerabilityType {
    cveId: string
    severity: SeveritiesDTO
    package: string
    currentVersion: string
    fixedInVersion: string
    permission?: string
}

export interface ImageScanVulnerabilityType extends CodeScanVulnerabilityType {
    target?: string
}

export interface ImageScanVulnerabilityListType extends StatusType {
    image: string
    summary: Summary<'severities'>
    list: ImageScanVulnerabilityType[]
}

export interface CodeScanLicenseType {
    classification: string
    severity: string
    license: string
    package: string
    source: string
}

export interface ImageScanLicenseListType extends StatusType {
    image: string
    summary: Summary<'severities'>
    list: CodeScanLicenseType[]
}

export type ImageScan = {
    [SUB_CATEGORIES.VULNERABILITIES]: GenericGroupTypeWithSummary<ImageScanVulnerabilityListType>
    [SUB_CATEGORIES.LICENSE]: GenericGroupTypeWithSummary<ImageScanLicenseListType>
}

export interface Line {
    number: number
    content: string
    isCause: boolean
    truncated: boolean
}

export interface CauseMetadata {
    startLine: number
    EndLine: number
    lines?: Line[]
}

export interface CodeScanMisconfigurationsDetailListType {
    id: string
    title: string
    message: string
    resolution: string
    status: string
    severity: string
    causeMetadata: CauseMetadata
}

export interface CodeScanMisconfigurationsListType {
    filePath: string
    link: string
    type: string
    misConfSummary: Summary<'status'>
    summary: Summary<'severities'>
    list: CodeScanMisconfigurationsDetailListType[]
}

export interface CodeScanExposedSecretsDetailListType {
    severity: string
    ruleId: string
    category: string
    startLine: number
    EndLine: number
    title: string /* TODO: confirm with real data */
    lines: Line[]
}

export interface CodeScanExposedSecretsListType {
    filePath: string
    link: string
    summary: Summary<'severities'>
    list: CodeScanExposedSecretsDetailListType[]
}

export type CodeScan = {
    [SUB_CATEGORIES.VULNERABILITIES]: GenericGroupTypeWithSummary<CodeScanVulnerabilityType>
    [SUB_CATEGORIES.LICENSE]: GenericGroupTypeWithSummary<CodeScanLicenseType>
    [SUB_CATEGORIES.MISCONFIGURATIONS]: GenericGroupTypeWithMisConfSummary<CodeScanMisconfigurationsListType>
    [SUB_CATEGORIES.EXPOSED_SECRETS]: GenericGroupTypeWithSummary<CodeScanExposedSecretsListType>
} & StatusType

export type KubernetesManifest = {
    [SUB_CATEGORIES.MISCONFIGURATIONS]: GenericGroupTypeWithMisConfSummary<CodeScanMisconfigurationsListType>
    [SUB_CATEGORIES.EXPOSED_SECRETS]: GenericGroupTypeWithSummary<CodeScanExposedSecretsListType>
} & StatusType

export type ScanResultDTO = {
    scanned: boolean
    isImageScanEnabled: boolean
    [CATEGORIES.IMAGE_SCAN]: ImageScan
    [CATEGORIES.CODE_SCAN]: CodeScan
    [CATEGORIES.KUBERNETES_MANIFEST]: KubernetesManifest
}

export interface SidebarPropsType {
    modalState: SecurityModalStateType
    setModalState: React.Dispatch<React.SetStateAction<SecurityModalStateType>>
    scanResult: ScanResultDTO
}

interface SecurityModalBaseProps {
    isLoading: boolean
    error: ServerErrors
    responseData: ScanResultDTO
    handleModalClose: (event?: React.MouseEvent<HTMLElement>) => void
    Sidebar?: React.FC<SidebarPropsType>
    hidePolicy?: boolean
    defaultState?: SecurityModalStateType
}

export type SecurityModalPropsType = SecurityModalBaseProps

export interface IndexedTextDisplayPropsType {
    title: string
    lines: Line[]
    link: string
}

export type SidebarDataChildType = {
    label: string
    value: {
        category: ScanCategories
        subCategory: ScanSubCategories
    }
}

export type EmptyStateType = Pick<GenericEmptyStateType, 'image' | 'SvgImage' | 'subTitle' | 'title' | 'children'>

export const VulnerabilityState = {
    [-1]: 'Failed',
    0: 'Progressing',
    1: 'Completed',
} as const

export interface ImageVulnerabilityType {
    image: string
    state: keyof typeof VulnerabilityState
    error?: string
    scanResult: LastExecutionResultType | null
}

export interface VulnerabilityCountType {
    unknownVulnerabilitiesCount: number
    lowVulnerabilitiesCount: number
    mediumVulnerabilitiesCount: number
    highVulnerabilitiesCount: number
    criticalVulnerabilitiesCount: number
}

export interface GetResourceScanDetailsResponseType extends VulnerabilityCountType {
    imageVulnerabilities: ImageVulnerabilityType[]
}

export interface OpenDetailViewButtonProps {
    detailViewData: DetailViewDataType
    setDetailViewData: (detailViewData: DetailViewDataType) => void
}
