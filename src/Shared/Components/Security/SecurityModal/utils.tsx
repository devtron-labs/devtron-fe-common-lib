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

import { ReactComponent as NoVulnerability } from '@Icons/ic-vulnerability-not-found.svg'
import { SegmentedBarChartProps } from '@Common/SegmentedBarChart'
import { VulnerabilityType } from '@Common/Types'
import { ScannedByToolModal } from '@Shared/Components/ScannedByToolModal'
import { Severity } from '@Shared/types'

import { ORDERED_SEVERITY_KEYS, SEVERITIES, TRIVY_ICON_URL } from './constants'
import {
    CATEGORIES,
    GetResourceScanDetailsResponseType,
    ImageScanVulnerabilityType,
    ImageVulnerabilityType,
    ScanResultDTO,
    SeveritiesDTO,
    SUB_CATEGORIES,
    VulnerabilityCountType,
    VulnerabilityState,
} from './types'

export const mapSeveritiesToSegmentedBarChartEntities = (
    severities: Partial<Record<keyof typeof SEVERITIES, number>>,
) =>
    /* for all the SEVERITY keys in @severities create @Entity */
    severities &&
    ORDERED_SEVERITY_KEYS.map(
        (key: keyof typeof SEVERITIES) =>
            severities[key] && {
                color: SEVERITIES[key].color,
                label: SEVERITIES[key].label,
                value: severities[key],
            },
    ).filter((entity: SegmentedBarChartProps['entities'][number]) => !!entity)

export const stringifySeverities = (severities: Partial<Record<keyof typeof SEVERITIES, number>>) =>
    severities &&
    Object.keys(severities)
        .sort(
            (a: keyof typeof SEVERITIES, b: keyof typeof SEVERITIES) =>
                ORDERED_SEVERITY_KEYS.indexOf(a) - ORDERED_SEVERITY_KEYS.indexOf(b),
        )
        .map((key: keyof typeof SEVERITIES) => `${severities[key]} ${SEVERITIES[key].label}`)
        .join(', ')

export const getSeverityWeight = (severity: SeveritiesDTO): number =>
    ({
        [SeveritiesDTO.UNKNOWN]: 1,
        [SeveritiesDTO.LOW]: 2,
        [SeveritiesDTO.MEDIUM]: 3,
        [SeveritiesDTO.HIGH]: 4,
        [SeveritiesDTO.CRITICAL]: 5,
        [SeveritiesDTO.FAILURES]: 6,
        [SeveritiesDTO.EXCEPTIONS]: 7,
        [SeveritiesDTO.SUCCESSES]: 8,
    })[severity] || 10000
/* NOTE: not using POS_INFY or MAX_VALUE due to possibility of NaN & overflow */

export const compareSeverity = (a: SeveritiesDTO, b: SeveritiesDTO) => getSeverityWeight(a) - getSeverityWeight(b)

export const getSecurityScanSeveritiesCount = (data: ScanResultDTO) => {
    const imageScanSeverities = data[CATEGORIES.IMAGE_SCAN].vulnerability?.summary?.severities
    const codeScanSeverities = data[CATEGORIES.CODE_SCAN].vulnerability?.summary?.severities
    return {
        critical:
            (imageScanSeverities?.[SeveritiesDTO.CRITICAL] || 0) + (codeScanSeverities?.[SeveritiesDTO.CRITICAL] || 0),
        high: (imageScanSeverities?.[SeveritiesDTO.HIGH] || 0) + (codeScanSeverities?.[SeveritiesDTO.HIGH] || 0),
        medium: (imageScanSeverities?.[SeveritiesDTO.MEDIUM] || 0) + (codeScanSeverities?.[SeveritiesDTO.MEDIUM] || 0),
        low: (imageScanSeverities?.[SeveritiesDTO.LOW] || 0) + (codeScanSeverities?.[SeveritiesDTO.LOW] || 0),
        unknown:
            (imageScanSeverities?.[SeveritiesDTO.UNKNOWN] || 0) + (codeScanSeverities?.[SeveritiesDTO.UNKNOWN] || 0),
    }
}

export const compareSeverities = (a: Record<SeveritiesDTO, number>, b: Record<SeveritiesDTO, number>) =>
    ORDERED_SEVERITY_KEYS.reduce((result, currentKey) => result || a[currentKey] - b[currentKey], 0)

export const getScanCompletedEmptyState = (scanToolName: string, scanToolUrl: string) => ({
    SvgImage: NoVulnerability,
    title: "You're secure!",
    children: (
        <span className="flex dc__border-radius-24 bg__primary pl-16 pr-16 pt-8 pb-8 en-1 bw-1">
            <ScannedByToolModal scanToolName={scanToolName} scanToolUrl={scanToolUrl} />
        </span>
    ),
})

export const compareStringAndObject = (a: string | object, b: string | object) =>
    a.toString().localeCompare(b.toString())

const getSeverityFromVulnerabilitySeverity = (severity: VulnerabilityType['severity']) => {
    switch (severity.toLowerCase()) {
        case Severity.HIGH:
            return SeveritiesDTO.HIGH
        case Severity.UNKNOWN:
            return SeveritiesDTO.UNKNOWN
        case Severity.MEDIUM:
            return SeveritiesDTO.MEDIUM
        case Severity.LOW:
            return SeveritiesDTO.LOW
        case Severity.CRITICAL:
            return SeveritiesDTO.CRITICAL
        default:
            return null
    }
}

export const parseGetResourceScanDetailsResponse = (data: GetResourceScanDetailsResponseType): ScanResultDTO => ({
    [CATEGORIES.IMAGE_SCAN]: {
        [SUB_CATEGORIES.VULNERABILITIES]: {
            summary: {
                severities: {
                    [SeveritiesDTO.CRITICAL]: data.criticalVulnerabilitiesCount || 0,
                    [SeveritiesDTO.HIGH]: data.highVulnerabilitiesCount || 0,
                    [SeveritiesDTO.MEDIUM]: data.mediumVulnerabilitiesCount || 0,
                    [SeveritiesDTO.LOW]: data.lowVulnerabilitiesCount || 0,
                    [SeveritiesDTO.UNKNOWN]: data.unknownVulnerabilitiesCount || 0,
                },
            },
            list: data.imageVulnerabilities.map((value) => ({
                image: value.image,
                summary: {
                    severities: {
                        ...(value.scanResult.severityCount.critical
                            ? { [SeveritiesDTO.CRITICAL]: value.scanResult.severityCount.critical }
                            : {}),
                        ...(value.scanResult.severityCount.high
                            ? { [SeveritiesDTO.HIGH]: value.scanResult.severityCount.high }
                            : {}),
                        ...(value.scanResult.severityCount.medium
                            ? { [SeveritiesDTO.MEDIUM]: value.scanResult.severityCount.medium }
                            : {}),
                        ...(value.scanResult.severityCount.low
                            ? { [SeveritiesDTO.LOW]: value.scanResult.severityCount.low }
                            : {}),
                        ...(value.scanResult.severityCount.unknown
                            ? { [SeveritiesDTO.LOW]: value.scanResult.severityCount.unknown }
                            : {}),
                    },
                },
                list: value.scanResult.vulnerabilities.map((vulnerability) => ({
                    cveId: vulnerability.name,
                    package: vulnerability.package,
                    currentVersion: vulnerability.version,
                    fixedInVersion: vulnerability.fixedVersion,
                    severity: getSeverityFromVulnerabilitySeverity(vulnerability.severity),
                })),
                scanToolName: 'TRIVY' /* TODO: need to create a mapping */,
                scanToolUrl: TRIVY_ICON_URL,
                StartedOn: value.scanResult.lastExecution,
                status: VulnerabilityState[value.state],
            })),
        },
        [SUB_CATEGORIES.LICENSE]: null,
    },
    [CATEGORIES.CODE_SCAN]: null,
    [CATEGORIES.KUBERNETES_MANIFEST]: null,
    scanned: true,
    isImageScanEnabled: true,
})

export const getTotalVulnerabilityCount = (scannedResult: ImageVulnerabilityType[]): VulnerabilityCountType =>
    scannedResult.reduce(
        (acc, imageVulnerability) => {
            if (!imageVulnerability?.scanResult?.severityCount) {
                return acc
            }

            const {
                unknownVulnerabilitiesCount,
                lowVulnerabilitiesCount,
                mediumVulnerabilitiesCount,
                highVulnerabilitiesCount,
                criticalVulnerabilitiesCount,
            } = acc
            const {
                severityCount: { critical, high, medium, low, unknown },
            } = imageVulnerability.scanResult

            /* NOTE: counts can be sent as undefined */
            return {
                unknownVulnerabilitiesCount: unknownVulnerabilitiesCount + (unknown || 0),
                lowVulnerabilitiesCount: lowVulnerabilitiesCount + (low || 0),
                mediumVulnerabilitiesCount: mediumVulnerabilitiesCount + (medium || 0),
                highVulnerabilitiesCount: highVulnerabilitiesCount + (high || 0),
                criticalVulnerabilitiesCount: criticalVulnerabilitiesCount + (critical || 0),
            }
        },
        {
            unknownVulnerabilitiesCount: 0,
            lowVulnerabilitiesCount: 0,
            mediumVulnerabilitiesCount: 0,
            highVulnerabilitiesCount: 0,
            criticalVulnerabilitiesCount: 0,
        },
    )

const getSeveritiesFrequencyMap = (severities: SeveritiesDTO[]) => {
    const map: Partial<Record<SeveritiesDTO, number>> = {}
    severities.forEach((severity) => {
        map[severity] = (map[severity] ?? 0) + 1
    })
    return map
}

export const groupByTarget = (list: ImageScanVulnerabilityType[]) => {
    const map: Record<string, Array<ImageScanVulnerabilityType>> = {}
    list.forEach((element) => {
        if (map[element.target]) {
            map[element.target].push(element)
        } else {
            map[element.target] = [element]
        }
    })
    return Object.entries(map).map(([key, value]) => ({
        source: key,
        list: value,
        summary: {
            severities: getSeveritiesFrequencyMap(value.map((el) => el.severity)),
        },
    }))
}
